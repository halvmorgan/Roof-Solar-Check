import { useRef, useState } from 'react';
import { Camera, Sun, Sparkles, FileText, CheckCircle2, ShieldCheck, Clock, AlertTriangle, ArrowRight, UploadCloud } from 'lucide-react';
import { SAMPLE_ROOFS, SampleRoofOption } from '../utils/sampleRoofs';

interface HeroScreenProps {
  onPhotoSelected: (file: File) => void;
  onSampleSelected: (sample: SampleRoofOption) => void;
  errorMessage: string | null;
}

export function HeroScreen({ onPhotoSelected, onSampleSelected, errorMessage }: HeroScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onPhotoSelected(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onPhotoSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Brand Header / Logo Placeholder */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="inline-flex items-center gap-2 border-2 border-dashed border-amber-400/80 bg-amber-50/70 text-amber-900 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-xs mb-3">
          <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>[ Your Business Name Here ]</span>
        </div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
          White-Label Solar Conversion Funnel
        </p>
      </div>

      {/* Visible Red Error Alert (if previous analysis encountered an error) */}
      {errorMessage && (
        <div className="mb-8 p-5 bg-red-50/95 border-2 border-red-300 rounded-2xl shadow-sm text-red-900 flex items-start gap-3.5 transition-all animate-shake">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="text-left text-sm">
            <p className="font-bold text-red-950 text-base mb-1">Analysis Notice</p>
            <p className="text-red-800 leading-relaxed font-mono text-xs sm:text-sm bg-white/70 p-2.5 rounded-lg border border-red-200">
              {errorMessage}
            </p>
            <p className="font-semibold text-red-900 mt-2 flex items-center gap-1.5">
              <span>Tap the button and try again.</span>
            </p>
          </div>
        </div>
      )}

      {/* Main Hook & Headline */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Instant Roof Solar Check
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-5">
          Is Your Roof <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600">Solar-Ready?</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-normal">
          Get a free, instant automated read on whether your roof is a good fit for solar. We analyze pitch, shading, roof condition, and obstructions in seconds — 100% free with no obligation.
        </p>
      </div>

      {/* ONE Large Upload Button & Interactive Dropzone */}
      <div className="max-w-xl mx-auto mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload roof photo"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          className={`cursor-pointer group relative overflow-hidden rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 border-2 ${
            isDragging
              ? 'border-amber-500 bg-amber-50/80 scale-[1.01] shadow-xl'
              : 'border-amber-300/70 hover:border-amber-500 bg-gradient-to-b from-white to-amber-50/40 hover:to-amber-50/70 shadow-lg hover:shadow-xl hover:shadow-amber-500/10'
          }`}
        >
          {/* Subtle Sun Burst Background Accents */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-yellow-400/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

          {/* Primary Action Button Inner */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 group-hover:shadow-amber-500/40 transition-all duration-300 mb-4">
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-lg sm:text-xl py-4 px-8 rounded-xl shadow-lg shadow-amber-500/25 transition-all transform group-hover:-translate-y-0.5">
              <UploadCloud className="w-6 h-6 text-amber-100" />
              <span>Upload Photo of Roof</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-3 font-medium">
              Snap a picture from your yard or choose from camera roll
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP & HEIC (Phone photos)
            </p>
          </div>
        </div>
      </div>

      {/* Trust Line */}
      <div className="text-center mb-10">
        <div className="inline-flex flex-wrap items-center justify-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-500 font-medium bg-white/80 py-2 px-5 rounded-full border border-slate-200/60 shadow-2xs">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Takes 30 seconds
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            No obligation
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
            Your photo is never stored
          </span>
        </div>
      </div>

      {/* Fast Demo Testing Option (for solar company prospects viewing on desktop) */}
      <div className="max-w-3xl mx-auto mb-12 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Evaluating this sales demo on desktop? Try a sample roof:
          </p>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">1-Click Test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_ROOFS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSampleSelected(sample)}
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-20 rounded-lg overflow-hidden bg-slate-100 mb-2 border border-slate-200/60 relative">
                  <img src={sample.dataUrl} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white tracking-wide">
                    {sample.label}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 group-hover:text-amber-700 leading-tight">
                  {sample.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                  {sample.description}
                </p>
              </div>
              <div className="mt-2 text-[11px] font-medium text-amber-600 flex items-center gap-1">
                <span>Analyze this roof</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3-Step "How It Works" Row */}
      <div className="pt-6 border-t border-slate-200/70">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          How It Works
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">
              1
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Camera className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">Upload a photo</h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a simple snap from your driveway or yard. Any standard smartphone photo works.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">
              2
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sun className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">We analyze solar potential</h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Computer vision reads roof pitch, shading, obstructions, and structural plane availability.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">
              3
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <FileText className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">Get your free report</h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant solar score, estimated system pricing, and 25-year energy savings breakdown.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
