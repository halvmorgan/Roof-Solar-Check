import { CheckCircle, Calendar, ArrowRight, RotateCcw, Sparkles, PhoneCall, Zap, UserCheck } from 'lucide-react';
import { SolarAnalysisReport } from '../server/analyzeService';

interface BookedScreenProps {
  leadInfo: { name: string; phone: string; email: string };
  report: SolarAnalysisReport | null;
  onReset: () => void;
}

export function BookedScreen({ leadInfo, report, onReset }: BookedScreenProps) {
  const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/LVpOsNeO7yzeOGttipmW";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 sm:py-16">
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-12 text-center relative overflow-hidden">
        {/* Subtle Decorative Background Rings */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Big Success Check Animation */}
        <div className="relative mb-6 flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50 shadow-lg animate-bounce">
            <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-600" />
          </div>
        </div>

        {/* Agency Note Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Sales Demo Simulation Complete
        </div>

        {/* Speaks directly to the Solar Company OWNER */}
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4 max-w-xl mx-auto">
          In the live version, this lead lands directly on <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">YOUR calendar</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium mb-8 max-w-xl mx-auto">
          Booked, confirmed, and ready for a site assessment.
        </p>

        {/* Lead Capture Summary Card (shows owner what data was secured) */}
        <div className="bg-stone-50 border border-slate-200/90 rounded-2xl p-5 mb-8 text-left max-w-lg mx-auto shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Incoming Qualified Lead Packet
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Synced to CRM
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Homeowner:</span>
              <span className="font-semibold text-slate-900">{leadInfo.name || 'Sample Homeowner'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Phone:</span>
              <span className="font-semibold text-slate-900">{leadInfo.phone || '(555) 234-5678'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Email:</span>
              <span className="font-semibold text-slate-900">{leadInfo.email || 'lead@homeowner.com'}</span>
            </div>
            {report && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Solar Score:</span>
                  <span className="font-bold text-amber-600">{report.score} / 100 ({report.verdict})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Roof Profile:</span>
                  <span className="font-medium text-slate-800 text-right">{report.roofType}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pitch to the Solar Business Owner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-base mb-2">
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Ready to convert your website visitors into booked site visits?</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-normal">
            Want this activated for your business? Book a 15-minute setup call with <strong>Ecentra Concierge</strong> below — we'll have it live on your site and branded to you within days.
          </p>
        </div>

        {/* Primary CTA: Large "Book Your Setup Call" Button (Plain link with target="_blank" rel="noopener noreferrer") */}
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-white font-bold text-lg py-4 px-8 rounded-xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-3 group no-underline"
          >
            <Calendar className="w-5 h-5 text-amber-100" />
            <span>Book Your Setup Call</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Secondary "Run another analysis" Button */}
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 py-3 px-6 rounded-xl border border-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Run another analysis (Reset Demo)</span>
          </button>
        </div>

        {/* Agency Footer */}
        <div className="mt-12 pt-6 border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            Sales Funnel Engine by Ecentra Concierge
          </span>
          <span className="text-slate-400">
            Automated Calendar Sync · HighLevel · Zapier · HubSpot
          </span>
        </div>
      </div>
    </div>
  );
}
