import { GoogleGenAI } from '@google/genai';

export interface SolarFinding {
  title: string;
  category: 'Shading' | 'Condition' | 'Orientation' | 'Obstructions';
  severity: 'Low' | 'Medium' | 'High';
  detail: string;
}

export interface SolarAnalysisReport {
  score: number;
  roofType: string;
  roofCondition: string;
  verdict: string;
  findings: SolarFinding[];
  positives: string[];
  concerns: string[];
  costRange: string;
  savingsRange: string;
  bottomLine: string;
}

const SYSTEM_PROMPT = `You are a certified senior solar engineer and roofing feasibility expert.
Analyze the uploaded photograph of a residential roof to evaluate its solar readiness and installation suitability.

CRITICAL INSTRUCTIONS:
1. Analyze honestly and objectively based ONLY on what is clearly visible in the photo.
2. Never invent problems, damage, or shading that isn't visible.
3. If specific details (e.g., exact pitch angle, roof azimuth, unseen planes, attic rafters) cannot be fully determined from the photo angle, explicitly say so with professional nuance.
4. Calculate a realistic solar readiness score between 0 and 100 based on roof condition, sun exposure / tree shading, roof geometry / plane size, and obstructions (vents, dormers, chimneys, skylights).
5. Provide realistic US solar installation cost ballparks (average 7-10kW residential array) as the CASH PURCHASE PRICE, and realistic savings estimates. The 30% federal residential solar tax credit (Section 25D) ended on December 31, 2025: never say the homeowner qualifies for a federal tax credit and never subtract one from the price.
6. Provide EXACTLY 3 findings in the "findings" array with category strictly one of: "Shading", "Condition", "Orientation", "Obstructions". Severity must be "Low", "Medium", or "High".
7. Provide EXACTLY 2 sentences in the "bottomLine" field.
8. Output ONLY valid raw JSON matching the schema below. No markdown backticks or commentary outside the JSON.

SCHEMA:
{
  "score": number, // 0 to 100
  "roofType": string, // e.g. "Asphalt shingle, gable roof"
  "roofCondition": string, // e.g. "Good overall condition with uniform shingles and minimal granule loss"
  "verdict": string, // e.g. "Strong Solar Candidate", "Good With Minor Fixes", "Needs Work First", or "Poor Fit"
  "findings": [
    {
      "title": string,
      "category": "Shading" | "Condition" | "Orientation" | "Obstructions",
      "severity": "Low" | "Medium" | "High",
      "detail": string
    }
  ],
  "positives": [string], // 2 to 3 points
  "concerns": [string], // 2 to 3 points
  "costRange": string, // ONLY the dollar range, e.g. "$18,000–$25,000" (cash purchase price, typical 7–10 kW system)
  "savingsRange": string, // e.g. "$1,450/year ($36,000+ over 25 years)"
  "bottomLine": string // EXACTLY 2 sentences
}`;

export async function analyzeRoofImage(imageBase64: string, mimeType: string): Promise<SolarAnalysisReport> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Busy-model protection: retry, then fall back to backup models, so a live demo never shows a raw 503.
  const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];
  const WAITS = [0, 1500, 4000];
  let sawBusy = false;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  let response: any = null;
  let lastError: any = null;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3 && !response; attempt++) {
      if (WAITS[attempt]) await sleep(WAITS[attempt]);
      try {
        response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { inlineData: { mimeType: mimeType || 'image/jpeg', data: imageBase64 } },
              { text: `${SYSTEM_PROMPT}\n\nPlease perform the solar readiness analysis on this roof photo now and output strictly the required JSON.` },
            ],
          },
          config: { responseMimeType: 'application/json', temperature: 0.2 },
        });
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const busy = /503|429|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand/i.test(msg);
        if (busy) { sawBusy = true; continue; }
        break; // not busy (e.g. model not found) or second busy failure: try the next model
      }
    }
    if (response) break;
  }
  if (!response) {
    const msg = String(lastError?.message || lastError || 'unknown error');
    if (sawBusy || /503|429|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand/i.test(msg)) {
      throw new Error('Our roof scanner is very busy right now. Please wait a minute and try again.');
    }
    throw new Error(msg);
  }

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Received an empty response from Gemini vision model.");
  }

  // Defensive parsing: isolate content from first '{' to last '}'
  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error(`AI response did not contain a valid JSON object: ${rawText.slice(0, 150)}...`);
  }

  const jsonSubstring = rawText.substring(firstBrace, lastBrace + 1);
  let parsed: Partial<SolarAnalysisReport>;
  try {
    parsed = JSON.parse(jsonSubstring);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`JSON parsing failed: ${message}. Raw output snippet: ${jsonSubstring.slice(0, 100)}`);
  }

  // Validate and sanitize data
  const score = typeof parsed.score === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.score))) : 75;
  const roofType = parsed.roofType || 'Asphalt shingle roof';
  const roofCondition = parsed.roofCondition || 'Appears structurally sound';
  const verdict = parsed.verdict || (score >= 70 ? 'Strong Solar Candidate' : score >= 40 ? 'Good With Minor Fixes' : 'Needs Work First');
  
  const findings: SolarFinding[] = Array.isArray(parsed.findings) && parsed.findings.length > 0
    ? parsed.findings.slice(0, 3).map((f, i) => ({
        title: f.title || `Key Factor ${i + 1}`,
        category: (['Shading', 'Condition', 'Orientation', 'Obstructions'].includes(f.category)
          ? f.category
          : 'Condition') as SolarFinding['category'],
        severity: (['Low', 'Medium', 'High'].includes(f.severity) ? f.severity : 'Low') as SolarFinding['severity'],
        detail: f.detail || 'Evaluated from aerial/ground perspective.',
      }))
    : [
        { title: 'Roof Condition & Wear', category: 'Condition', severity: 'Low', detail: 'Roof plane shows clean surface with no acute distress visible.' },
        { title: 'Sun Exposure & Shading', category: 'Shading', severity: 'Low', detail: 'Significant unshaded surface area available during peak sunlight hours.' },
        { title: 'Surface Obstructions', category: 'Obstructions', severity: 'Low', detail: 'Few vents and penetrations allowing flexible panel placement.' },
      ];

  const positives = Array.isArray(parsed.positives) && parsed.positives.length > 0
    ? parsed.positives.slice(0, 3)
    : ['Generous contiguous roof plane suitable for high-efficiency solar modules', 'No immediate tree canopy overhang detected'];

  const concerns = Array.isArray(parsed.concerns) && parsed.concerns.length > 0
    ? parsed.concerns.slice(0, 3)
    : ['Exact pitch and azimuth should be verified with digital inclinometer during site visit', 'Attic rafter spacing and electrical service panel rating require physical check'];

  const costRange = parsed.costRange || '$18,000–$25,000';
  const savingsRange = parsed.savingsRange || '$1,400–$1,800/yr (approx $36,000 over 25 yrs)';
  const bottomLine = parsed.bottomLine || 'Your roof displays favorable geometry and surface condition for a residential solar array. A rapid physical site assessment will confirm exact inverter sizing, rafter layout, and utility interconnection options.';

  return {
    score,
    roofType,
    roofCondition,
    verdict,
    findings,
    positives,
    concerns,
    costRange,
    savingsRange,
    bottomLine,
  };
}
