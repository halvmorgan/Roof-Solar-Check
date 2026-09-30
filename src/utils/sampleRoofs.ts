// Generates realistic SVG data URLs for sample roofs to facilitate one-click testing in the sales demo

export interface SampleRoofOption {
  id: string;
  name: string;
  label: string;
  description: string;
  dataUrl: string;
}

// 1. South-Facing Architectural Shingle Roof
const svgSample1 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="sky1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4A90E2" />
      <stop offset="60%" stop-color="#87CEEB" />
      <stop offset="100%" stop-color="#E0F2FE" />
    </linearGradient>
    <radialGradient id="sun1" cx="80%" cy="20%" r="35%">
      <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#FDE68A" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#F5A623" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="roofPlane1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="50%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <pattern id="shingles1" width="30" height="15" patternUnits="userSpaceOnUse">
      <path d="M 0,0 L 30,0 L 30,15 L 0,15 Z" fill="none" stroke="#1E293B" stroke-width="1.2" opacity="0.4"/>
      <line x1="15" y1="0" x2="15" y2="15" stroke="#0F172A" stroke-width="0.8" opacity="0.3"/>
    </pattern>
  </defs>
  <!-- Sky -->
  <rect width="1200" height="800" fill="url(#sky1)" />
  <circle cx="950" cy="150" r="280" fill="url(#sun1)" />
  
  <!-- Distant trees -->
  <path d="M0,600 Q150,560 300,590 T600,580 T900,590 T1200,570 L1200,800 L0,800 Z" fill="#14532D" opacity="0.6" />
  
  <!-- House base -->
  <rect x="250" y="480" width="700" height="320" fill="#F8FAFC" />
  <!-- Siding lines -->
  <line x1="250" y1="520" x2="950" y2="520" stroke="#E2E8F0" stroke-width="2" />
  <line x1="250" y1="560" x2="950" y2="560" stroke="#E2E8F0" stroke-width="2" />
  <line x1="250" y1="600" x2="950" y2="600" stroke="#E2E8F0" stroke-width="2" />
  
  <!-- Main Large Gable Roof Plane (South Facing, pristine, sunny) -->
  <polygon points="600,180 180,480 1020,480" fill="url(#roofPlane1)" />
  <polygon points="600,180 180,480 1020,480" fill="url(#shingles1)" />
  
  <!-- Roof Ridge & Trim -->
  <polygon points="600,175 170,485 185,492 600,186 1015,492 1030,485" fill="#0F172A" opacity="0.7" />
  <line x1="600" y1="180" x2="600" y2="480" stroke="#0F172A" stroke-width="3" opacity="0.4" />
  
  <!-- Single small plumbing pipe vent -->
  <rect x="780" y="320" width="12" height="35" rx="3" fill="#64748B" />
  
  <!-- Ground & Lawn -->
  <rect x="0" y="740" width="1200" height="60" fill="#166534" />
</svg>
`;

// 2. Gable Roof with Tree Shading
const svgSample2 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="sky2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#93C5FD" />
    </linearGradient>
    <linearGradient id="roofPlane2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="100%" stop-color="#1F2937" />
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky2)" />
  <rect x="220" y="470" width="760" height="330" fill="#E5E7EB" />
  
  <!-- Roof -->
  <polygon points="600,190 150,470 1050,470" fill="url(#roofPlane2)" />
  
  <!-- Chimney obstruction on right -->
  <rect x="750" y="220" width="60" height="120" fill="#991B1B" />
  <rect x="745" y="215" width="70" height="15" fill="#B91C1C" />
  
  <!-- Large mature tree casting partial shade on left roof plane -->
  <path d="M 0,120 Q 150,80 280,180 T 420,320 T 350,540 L 0,600 Z" fill="#15803D" opacity="0.95" />
  <!-- Shadow cast over the left roof -->
  <polygon points="350,300 480,380 430,470 200,470" fill="#030712" opacity="0.45" />
</svg>
`;

// 3. Tile Roof with Multiple Dormers & Vents
const svgSample3 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="sky3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#BFDBFE" />
    </linearGradient>
    <linearGradient id="tileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EA580C" />
      <stop offset="50%" stop-color="#C2410C" />
      <stop offset="100%" stop-color="#9A3412" />
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky3)" />
  <!-- House -->
  <rect x="200" y="460" width="800" height="340" fill="#FEF3C7" />
  <!-- Hip tile roof -->
  <polygon points="400,240 800,240 1060,460 140,460" fill="url(#tileGrad)" />
  
  <!-- Left Dormer -->
  <polygon points="350,300 300,380 400,380" fill="#7C2D12" />
  <rect x="320" y="340" width="60" height="40" fill="#FEF3C7" />
  
  <!-- Right Dormer -->
  <polygon points="750,300 700,380 800,380" fill="#7C2D12" />
  <rect x="720" y="340" width="60" height="40" fill="#FEF3C7" />
  
  <!-- Skylight -->
  <rect x="540" y="310" width="80" height="90" fill="#38BDF8" stroke="#1E293B" stroke-width="4" />
</svg>
`;

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const SAMPLE_ROOFS: SampleRoofOption[] = [
  {
    id: 'optimal-shingle',
    name: 'Sample 1: Clear South Shingle',
    label: 'High Potential (Clean Shingle)',
    description: 'Generous unshaded south-facing pitch with minimal obstructions.',
    dataUrl: svgToDataUrl(svgSample1),
  },
  {
    id: 'shaded-gable',
    name: 'Sample 2: Shaded Gable & Chimney',
    label: 'Moderate (Canopy Shading)',
    description: 'Tree foliage overhang on left plane + brick chimney.',
    dataUrl: svgToDataUrl(svgSample2),
  },
  {
    id: 'complex-tile',
    name: 'Sample 3: Spanish Tile with Dormers',
    label: 'Complex (Tile & Multiple Dormers)',
    description: 'Clay tile material with skylight and dual front dormers.',
    dataUrl: svgToDataUrl(svgSample3),
  },
];
