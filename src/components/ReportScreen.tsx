import { useState, useEffect } from 'react';
import { Sun, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Compass, CloudSun, Wrench, Layers } from 'lucide-react';
import { SolarAnalysisReport, SolarFinding } from '../server/analyzeService';

interface ReportScreenProps {
  report: SolarAnalysisReport;
  photoPreviewUrl: string;
  onBookAssessment: (lead: { name: string; phone: string; email: string }) => void;
}

export function ReportScreen({ report, photoPreviewUrl, onBookAssessment }: ReportScreenProps) {
  // Score count-up animation
  const [displayScore, setDisplayScore] = useState(0);

  // Form input state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Inline validation errors
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  useEffect(() => {
    let start = 0;
    const target = report.score;
    const duration = 1200; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [report.score]);

  // Determine score color
  const getScoreTheme = (score: number) => {
    if (score >= 70) {
      return {
        text: 'text-emerald-600',
        stroke: '#10B981',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        label: 'High Solar Potential',
      };
    }
    if (score >= 40) {
      return {
        text: 'text-amber-500',
        stroke: '#F5A623',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        label: 'Moderate Solar Potential',
      };
    }
    return {
      text: 'text-rose-600',
      stroke: '#EF4444',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      label: 'Challenging Solar Fit',
    };
  };

  const scoreTheme = getScoreTheme(report.score);

  // SVG circular progress calculation
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const getCategoryIcon = (category: SolarFinding['category']) => {
    switch (category) {
      case 'Shading':
        return <CloudSun className="w-4 h-4" />;
      case 'Orientation':
        return <Compass className="w-4 h-4" />;
      case 'Obstructions':
        return <Layers className="w-4 h-4" />;
      case 'Condition':
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: SolarFinding['severity']) => {
    switch (severity) {
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Moderate
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Favorable
          </span>
        );
    }
  };

  const handleBookClick = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length < 7) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onBookAssessment({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Brand Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="inline-flex items-center gap-2 border-2 border-dashed border-amber-400/80 bg-amber-50/70 text-amber-900 px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide shadow-2xs mb-2">
          <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>[ Your Business Name Here ]</span>
        </div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
          Automated Site Assessment & Feasibility Report
        </p>
      </div>

      {/* Main Report Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-10">
        {/* Top Header Bar with Score and Primary Verdict */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-stone-50 to-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Headline & Pills */}
          <div className="text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${scoreTheme.badge}`}>
                {report.verdict}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {report.roofType}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Roof Solar Readiness Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
              Condition: <strong className="text-slate-800 font-medium">{report.roofCondition}</strong>
            </p>
          </div>

          {/* Right: Circular Score Ring & Photo Thumbnail */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Thumbnail */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm relative group">
              <img src={photoPreviewUrl} alt="Analyzed roof" className="w-full h-full object-cover" />
            </div>

            {/* SVG Score Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#E2E8F0"
                  strokeWidth="9"
                />
                {/* Progress Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={scoreTheme.stroke}
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-2xl sm:text-3xl font-bold font-serif ${scoreTheme.text} leading-none`}>
                  {displayScore}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  / 100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Findings Cards Section */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Key Diagnostic Findings
            </h2>
            <span className="text-xs text-slate-400 font-medium">3-Point Vision Scan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.findings.map((finding, idx) => (
              <div
                key={idx}
                className="bg-stone-50/70 rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <span className="text-amber-500">{getCategoryIcon(finding.category)}</span>
                      {finding.category}
                    </span>
                    {getSeverityBadge(finding.severity)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                    {finding.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {finding.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Columns: Good News vs Watch Out For */}
        <div className="p-6 sm:p-8 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positives */}
          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/70">
            <div className="flex items-center gap-2 mb-3 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2 className="font-bold text-sm tracking-wide">Good News</h2>
            </div>
            <ul className="space-y-2.5">
              {report.positives.map((pos, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{pos}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns / Watch out for */}
          <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/70">
            <div className="flex items-center gap-2 mb-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h2 className="font-bold text-sm tracking-wide">Watch Out For</h2>
            </div>
            <ul className="space-y-2.5">
              {report.concerns.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dark "Bottom Line" Section */}
        <div className="bg-[#0B132B] text-white p-6 sm:p-8">
          <div className="max-w-3xl mx-auto">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-2">
              The Bottom Line
            </span>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6 font-medium">
              {report.bottomLine}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-slate-400 block mb-1">Estimated System Cost</span>
                <span className="text-xl sm:text-2xl font-bold font-serif text-amber-400 block tracking-tight">
                  {report.costRange}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Cash price, typical 7–10 kW system · ask about financing & lease options
                </span>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-slate-400 block mb-1">Estimated Utility Savings</span>
                <span className="text-xl sm:text-2xl font-bold font-serif text-amber-400 block tracking-tight">
                  {report.savingsRange}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Offsetting rising grid electricity utility bills
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 text-center sm:text-left italic">
              * Estimates only. Your free site assessment gives exact numbers.
            </p>
          </div>
        </div>
      </div>

      {/* High-Converting CTA Box (No <form> tags, onClick handlers) */}
      <div className="bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 rounded-3xl border-2 border-amber-300/80 p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
              <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              Complimentary Solar Site Visit
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Want the exact answer — free?
            </h2>
            <p className="text-sm text-slate-600">
              A quick, free visit from our team confirms your exact system size, layout, and price.
            </p>
          </div>

          {/* 3 Checkmark Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-800 font-semibold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Exact system size & panel layout</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-800 font-semibold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your real monthly savings</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-800 font-semibold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No-pressure, no-obligation visit</span>
            </div>
          </div>

          {/* Form Fields (Divs & Inputs, strictly NO <form> tag) */}
          <div className="space-y-4">
            <div>
              <label htmlFor="lead-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lead-name"
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-amber-400/40'
                }`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lead-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-amber-400/40'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                      : 'border-slate-300 focus:border-amber-500 focus:ring-amber-400/40'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            {/* Contact consent */}
            <p className="text-[11px] text-slate-500 leading-snug">
              By tapping the button below, you agree that [ Your Business Name Here ] may call, text, or email you about your solar assessment at the number and email you entered. Message and data rates may apply. Reply STOP to opt out. Consent is not a condition of purchase.
            </p>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBookClick}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-white font-bold text-base sm:text-lg py-4 px-8 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Book My Free Site Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero obligation · Instant priority scheduling · Direct calendar sync
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
