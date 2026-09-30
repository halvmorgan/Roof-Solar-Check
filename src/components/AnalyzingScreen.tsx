import { useEffect, useState } from 'react';
import { Sun, Sparkles } from 'lucide-react';

interface AnalyzingScreenProps {
  photoPreviewUrl: string;
}

const STATUS_MESSAGES = [
  "Scanning your roof...",
  "Checking for shading...",
  "Estimating orientation...",
  "Building your report...",
];

export function AnalyzingScreen({ photoPreviewUrl }: AnalyzingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
      {/* Brand Header Placeholder */}
      <div className="inline-flex items-center gap-2 border-2 border-dashed border-amber-400/80 bg-amber-50/70 text-amber-900 px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide mb-10">
        <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        <span>[ Your Business Name Here ]</span>
      </div>

      {/* Uploaded photo in rounded frame with pulsing amber ring animation */}
      <div className="relative mb-10">
        {/* Pulsing Amber Glow Ring */}
        <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full pulsing-amber-ring border-4 border-amber-400/70 p-2 relative bg-amber-50">
          <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-slate-100">
            <img
              src={photoPreviewUrl}
              alt="Uploaded Roof"
              className="w-full h-full object-cover"
            />
            {/* Radar scanner sweep line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent radar-scan shadow-md shadow-amber-400" />
            <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
          </div>
        </div>

        {/* Small floating badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 text-xs font-semibold px-4 py-1 rounded-full shadow-lg border border-slate-700 flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Roof Scan in Progress</span>
        </div>
      </div>

      {/* Rotating status messages every ~1.5s */}
      <div className="min-h-[70px] flex flex-col items-center justify-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight transition-opacity duration-300">
          {STATUS_MESSAGES[messageIndex]}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Evaluating structural geometry, surface planes & solar irradiance
        </p>
      </div>

      {/* Animated Step Dots */}
      <div className="flex items-center gap-2 mt-6">
        {STATUS_MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === messageIndex ? 'w-8 bg-amber-500' : 'w-2 bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
