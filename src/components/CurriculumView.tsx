import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import {
  BIN_PROTOCOLS,
  BinId,
  TRAINING_MODULES,
} from '../data/bmwmData';
import { BinReceptacleGraphic } from './ClinicalIcons';
import { AppScreen } from './TopBar';

interface CurriculumViewProps {
  practitionerName: string;
  completedModules: string[];
  onToggleModuleComplete: (moduleId: string) => void;
  onNavigate: (screen: AppScreen) => void;
}

const BIN_ORDER: BinId[] = ['yellow', 'red', 'white', 'blue', 'general'];

const BIN_CARD_STYLES: Record<
  BinId,
  {
    topBar: string;
    idle: string;
    active: string;
    codeColor: string;
    titleColor: string;
    fillBar: string;
  }
> = {
  yellow: {
    topBar: 'bg-[#EAB308]',
    idle: 'border border-[#CA8A04]/40 bg-[#FEFCE8]/55 hover:border-[#CA8A04] hover:bg-[#FEFCE8]/90',
    active: 'border-2 border-[#CA8A04] bg-[#FEFCE8] clinical-shadow-lg',
    codeColor: 'text-[#854D0E]',
    titleColor: 'text-[#451A03]',
    fillBar: 'bg-[#CA8A04]',
  },
  red: {
    topBar: 'bg-[#DC2626]',
    idle: 'border border-[#DC2626]/35 bg-[#FEF2F2]/55 hover:border-[#DC2626] hover:bg-[#FEF2F2]/90',
    active: 'border-2 border-[#DC2626] bg-[#FEF2F2] clinical-shadow-lg',
    codeColor: 'text-[#991B1B]',
    titleColor: 'text-[#7F1D1D]',
    fillBar: 'bg-[#DC2626]',
  },
  white: {
    topBar: 'bg-[#0891B2]',
    idle: 'border border-[#0891B2]/45 sharps-frosted hover:border-[#0891B2]',
    active: 'border-2 border-[#0891B2] sharps-frosted clinical-shadow-lg ring-2 ring-[#0891B2]/15',
    codeColor: 'text-[#0E7490]',
    titleColor: 'text-[#0F172A]',
    fillBar: 'bg-[#0891B2]',
  },
  blue: {
    topBar: 'bg-[#2563EB]',
    idle: 'border border-[#2563EB]/35 bg-[#EFF6FF]/55 hover:border-[#2563EB] hover:bg-[#EFF6FF]/90',
    active: 'border-2 border-[#2563EB] bg-[#EFF6FF] clinical-shadow-lg',
    codeColor: 'text-[#1E40AF]',
    titleColor: 'text-[#1E3A8A]',
    fillBar: 'bg-[#2563EB]',
  },
  general: {
    topBar: 'bg-gradient-to-r from-[#1E293B] via-[#1E293B] to-[#16A34A]',
    idle: 'border border-[#334155]/40 bg-[#F8FAFC] hover:border-[#15803D] hover:bg-[#F0FDF4]/60',
    active: 'border-2 border-[#15803D] bg-[#F0FDF4] clinical-shadow-lg',
    codeColor: 'text-[#15803D]',
    titleColor: 'text-[#0F172A]',
    fillBar: 'bg-[#16A34A]',
  },
};

const CUSTODY_FLOW = [
  { step: '01', label: 'Point-of-Care Sort' },
  { step: '02', label: '3/4 Seal & Barcode' },
  { step: '03', label: 'Transfer Within 48h' },
  { step: '04', label: 'CBMWTF / SWM Treatment' },
];

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  practitionerName,
  completedModules,
  onToggleModuleComplete,
  onNavigate,
}) => {
  const [selectedBin, setSelectedBin] = useState<BinId>('yellow');
  const [expandedModuleId, setExpandedModuleId] = useState<string>('mod-01');
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [trayImgFailed, setTrayImgFailed] = useState(false);

  const activeProtocol = BIN_PROTOCOLS[selectedBin];
  const completionPct = Math.round((completedModules.length / TRAINING_MODULES.length) * 100);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-12">
      {/* Editorial Split Hero */}
      <section className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden clinical-shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Content Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <p className="text-xs sm:text-sm font-medium text-[#475569] tracking-wide">
                <span>Welcome, {practitionerName || 'Clinician'}</span>
                <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                <span>Indian BMWM & General SWM Rules</span>
                <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                <span>Dr. Akshaya N Shetti</span>
              </p>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#0F172A] leading-[1.1] tracking-[-0.025em] [text-wrap:balance]">
                Biomedical Waste Management Training & Certification
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-[62ch]">
                Study the five hospital waste receptacles—Yellow, Red, White Puncture-Proof, Blue, and Black/Green General Waste—practice in the drag-and-drop bench, and take the exam (minimum 99% score is mandatory for getting the E-certificate).
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('lab')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6D28D9]"
                >
                  Open Drag & Drop Practice
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('exam')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#5B21B6] bg-white border-[1.5px] border-[#6D28D9] hover:bg-[#F5F3FF] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6D28D9]"
                >
                  Take Exam (Min 99% for E-Certificate)
                </button>
              </div>
            </div>

            {/* Curriculum Progress Meter */}
            <div className="pt-6 border-t border-slate-200 space-y-2.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-semibold text-[#0F172A]">Training Module Progress</span>
                <span className="font-mono font-semibold text-[#5B21B6] tabular-nums">
                  {completedModules.length} of {TRAINING_MODULES.length} Modules ({completionPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6D28D9] transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Clinical Photography Column */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-gradient-to-br from-[#312E81] to-[#1E1B4B] overflow-hidden">
            {!heroImgFailed && (
              <img
                src="/src/assets/images/hero_bmwm_facility_1795054578038.jpg"
                alt="Modern hospital aseptic supply and biomedical preparation station"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/25 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white space-y-1.5">
              <p className="font-mono text-xs text-[#C4B5FD] tracking-wide">
                CBMWTF & GENERAL SWM · 5-BIN STANDARD
              </p>
              <p className="font-display text-lg font-bold leading-snug">
                Zero-Recapping & Source Segregation Standard
              </p>
              <p className="text-xs text-slate-200">
                Calibrated for Ward, ICU, Operation Theatre & Microbiology Units
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Clinical KPI Strip */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6 clinical-shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#5B21B6] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[#475569]">Hospital Waste Streams</p>
              <p className="font-mono text-lg font-bold text-[#0F172A] tabular-nums">5 Color Bins</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#0284C7] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[#475569]">Untreated Storage Ceiling</p>
              <p className="font-mono text-lg font-bold text-[#0F172A] tabular-nums">48 Hours Max</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEFCE8] text-[#A16207] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[#475569]">Container Seal Limit</p>
              <p className="font-mono text-lg font-bold text-[#0F172A] tabular-nums">75% (3/4 Full)</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[#475569]">E-Certificate Benchmark</p>
              <p className="font-mono text-lg font-bold text-[#5B21B6] tabular-nums">99% Min (20 / 20)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 5-Bin Reference Explorer (Arranged In Line) */}
      <section aria-labelledby="schedule-explorer-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-xs font-medium text-[#5B21B6] tracking-wide">
              BMWM-SCH-I + GENERAL SWM · Five-Bin Standards
            </p>
            <h2
              id="schedule-explorer-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight"
            >
              Five-Category Segregation Reference
            </h2>
          </div>
          <p className="text-sm text-[#475569]">
            Select any bin in the line below to inspect accepted waste, exclusions, and treatment pathway.
          </p>
        </div>

        {/* 5 Tactile Bin Selection Cards Arranged In Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BIN_ORDER.map((binId) => {
            const bin = BIN_PROTOCOLS[binId];
            const isSelected = selectedBin === binId;
            const styles = BIN_CARD_STYLES[binId];

            return (
              <button
                key={binId}
                type="button"
                onClick={() => setSelectedBin(binId)}
                aria-pressed={isSelected}
                className={`text-left rounded-2xl overflow-hidden transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] ${
                  isSelected ? styles.active : styles.idle
                }`}
              >
                <div className={`h-2 w-full ${styles.topBar}`} />
                <div className="p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <BinReceptacleGraphic bin={binId} className="w-11 h-13 shrink-0" />
                    <div className="text-right space-y-0.5">
                      <span className={`block font-mono text-[11px] font-semibold ${styles.codeColor}`}>
                        {bin.regulatoryCode}
                      </span>
                      <span className="block font-mono text-[10px] text-[#64748B]">
                        Seal @ 75%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-display text-base font-bold ${styles.titleColor}`}>
                      {bin.shortLabel}
                    </h3>
                    <p className="mt-1 text-xs text-[#475569] line-clamp-2 leading-snug">
                      {bin.containerSpec}
                    </p>
                  </div>

                  <div className="h-1.5 w-full bg-white/80 border border-slate-200/80 rounded-full overflow-hidden">
                    <div className={`h-full w-3/4 ${styles.fillBar}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Bin Protocol Inspector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 clinical-shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#475569]">
                <span className="font-semibold text-[#0F172A]">{activeProtocol.regulatoryCode}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProtocol.treatmentCode}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProtocol.fillLimit}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F172A]">
                {activeProtocol.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('lab')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#5B21B6] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#6D28D9]/30 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
            >
              Practice Drag & Drop
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h4 className="font-display text-sm font-bold text-[#0F172A] mb-1.5">
                  Statutory Scope
                </h4>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  {activeProtocol.summary}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-display text-sm font-bold text-[#0F172A] mb-1.5">
                  Treatment & Disposal Pathway
                </h4>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {activeProtocol.treatmentMethod}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-display text-sm font-bold text-[#5B21B6] mb-1.5">
                  Clinical Advisory — Dr. Akshaya N Shetti
                </h4>
                <p className="text-sm text-[#0F172A] leading-relaxed">
                  {activeProtocol.clinicalNote}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:border-l lg:border-slate-200 lg:pl-8">
              <div>
                <h4 className="flex items-center gap-2 font-display text-sm font-bold text-[#059669] mb-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Accepted Waste Items
                </h4>
                <ul className="space-y-2.5 text-sm text-[#334155]">
                  {activeProtocol.acceptedItems.map((item) => (
                    <li
                      key={item}
                      className="leading-relaxed pb-2.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 font-display text-sm font-bold text-[#BE123C] mb-3">
                  <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Do Not Discard Here
                </h4>
                <ul className="space-y-2.5 text-sm text-[#334155]">
                  {activeProtocol.prohibitedItems.map((item) => (
                    <li
                      key={item}
                      className="leading-relaxed pb-2.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4-Stage Chain of Custody Flow Strip */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CUSTODY_FLOW.map((stage, index) => (
              <div key={stage.step} className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#5B21B6] w-7 h-7 rounded-lg bg-[#F5F3FF] border border-[#6D28D9]/25 flex items-center justify-center shrink-0">
                  {stage.step}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#0F172A] leading-tight">
                  {stage.label}
                </span>
                {index < CUSTODY_FLOW.length - 1 && (
                  <ArrowRight
                    className="hidden sm:block w-4 h-4 text-slate-300 ml-auto shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Tray Spotlight + 4-Module Syllabus (Zero MCQ) */}
      <section aria-labelledby="curriculum-modules-heading" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Editorial Clinical Photography Card */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-[#0F172A] min-h-[240px] clinical-shadow-sm">
            {!trayImgFailed && (
              <img
                src="/src/assets/images/module_sharps_safety_1795054577646.jpg"
                alt="Sterile stainless steel clinical tray with glass ampoules, syringe, and surgical gauze"
                referrerPolicy="no-referrer"
                onError={() => setTrayImgFailed(true)}
                className="w-full h-full object-cover"
              />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/35 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1.5">
              <p className="font-mono text-xs text-[#C4B5FD]">MODULE SYLLABUS</p>
              <h2
                id="curriculum-modules-heading"
                className="font-display text-2xl font-bold leading-tight"
              >
                Core Training Modules
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed">
                Review all four clinical modules, practice sorting in the 5-bin drag-and-drop bench, then take the exam (minimum 99% score mandatory for E-certificate).
              </p>
            </div>
          </div>

          {/* 4 Expandable Modules */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 clinical-shadow-sm">
            {TRAINING_MODULES.map((mod) => {
              const isExpanded = expandedModuleId === mod.id;
              const isCompleted = completedModules.includes(mod.id);

              return (
                <div key={mod.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setExpandedModuleId(isExpanded ? '' : mod.id)}
                      aria-expanded={isExpanded}
                      className="text-left flex-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] mb-1">
                        <span className="font-mono font-semibold text-[#5B21B6]">
                          Module {mod.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{mod.regulatoryRef}</span>
                        <span aria-hidden="true">·</span>
                        <span>{mod.duration}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#5B21B6] transition-colors">
                        {mod.title}
                      </h3>
                    </button>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleModuleComplete(mod.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                          isCompleted
                            ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669]'
                            : 'bg-white border-slate-300 text-[#475569] hover:border-[#6D28D9] hover:text-[#5B21B6]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        {isCompleted ? 'Completed' : 'Mark Complete'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedModuleId(isExpanded ? '' : mod.id)}
                        aria-label={isExpanded ? `Collapse ${mod.title}` : `Expand ${mod.title}`}
                        className="p-2 text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-5 h-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-slate-100 space-y-6">
                      <p className="text-sm sm:text-base text-[#334155] leading-relaxed max-w-[70ch]">
                        {mod.summary}
                      </p>

                      {/* Key Protocol Rules */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {mod.keyProtocols.map((protocol) => (
                          <div key={protocol.code} className="space-y-1">
                            <span className="font-mono text-xs font-semibold text-[#0284C7]">
                              {protocol.code}
                            </span>
                            <h4 className="font-display text-sm font-bold text-[#0F172A]">
                              {protocol.heading}
                            </h4>
                            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                              {protocol.detail}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-[#475569]">
                          Apply these protocols directly in the interactive 5-bin drag-and-drop simulator.
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isCompleted) onToggleModuleComplete(mod.id);
                            onNavigate('lab');
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors"
                        >
                          Practice Drag & Drop
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
