export function LiveBanner() {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 text-slate-100 text-xs sm:text-sm py-2.5 px-4 shadow-sm relative z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-center text-center font-medium tracking-wide">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20" />
          <span className="font-semibold text-amber-400 uppercase text-[11px] sm:text-xs tracking-wider">LIVE DEMO</span>
          <span className="text-slate-400 hidden sm:inline">—</span>
          <span className="text-slate-200">
            This tool was built for <strong className="text-white font-semibold underline decoration-amber-400/60 decoration-2 underline-offset-4">YOUR solar company</strong>. Your name, your branding, your calendar. Try it below.
          </span>
        </span>
      </div>
    </div>
  );
}
