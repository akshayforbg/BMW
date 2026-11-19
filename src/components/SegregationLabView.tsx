import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  GripVertical,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import {
  BIN_PROTOCOLS,
  BinId,
  ClinicalUnit,
  SEGREGATION_ITEMS,
  SegregationItem,
} from '../data/bmwmData';
import { BinReceptacleGraphic, SpecimenIllustration } from './ClinicalIcons';
import { AppScreen } from './TopBar';

interface SegregationLabViewProps {
  onNavigate: (screen: AppScreen) => void;
  onUpdateLabAccuracy: (accuracyPct: number, totalSorted: number) => void;
}

interface SortLogEntry {
  specimenCode: string;
  itemName: string;
  chosenBin: BinId;
  correctBin: BinId;
  firstAttemptCorrect: boolean;
}

const UNITS: ClinicalUnit[] = ['All Units', 'ICU & Ward', 'Operation Theatre', 'Microbiology Lab'];
const BIN_ORDER: BinId[] = ['yellow', 'red', 'white', 'blue', 'general'];

const BIN_DROP_STYLES: Record<
  BinId,
  {
    topBar: string;
    base: string;
    draggingReady: string;
    dragOver: string;
    label: string;
    code: string;
    keyHint: string;
  }
> = {
  yellow: {
    topBar: 'bg-[#EAB308]',
    base: 'border-2 border-dashed border-[#CA8A04]/55 bg-[#FEFCE8]/70 hover:border-[#CA8A04]',
    draggingReady: 'border-2 border-dashed border-[#CA8A04] bg-[#FEFCE8]',
    dragOver: 'border-2 border-solid border-[#CA8A04] bg-[#FEF08A]/75 scale-[1.02] clinical-shadow-lg',
    label: 'text-[#451A03]',
    code: 'text-[#854D0E]',
    keyHint: '1',
  },
  red: {
    topBar: 'bg-[#DC2626]',
    base: 'border-2 border-dashed border-[#DC2626]/50 bg-[#FEF2F2]/70 hover:border-[#DC2626]',
    draggingReady: 'border-2 border-dashed border-[#DC2626] bg-[#FEF2F2]',
    dragOver: 'border-2 border-solid border-[#DC2626] bg-[#FECACA]/65 scale-[1.02] clinical-shadow-lg',
    label: 'text-[#7F1D1D]',
    code: 'text-[#991B1B]',
    keyHint: '2',
  },
  white: {
    topBar: 'bg-[#0891B2]',
    base: 'border-2 border-dashed border-[#0891B2]/60 sharps-frosted hover:border-[#0891B2]',
    draggingReady: 'border-2 border-dashed border-[#0891B2] sharps-frosted',
    dragOver: 'border-2 border-solid border-[#0891B2] bg-[#ECFEFF]/95 scale-[1.02] clinical-shadow-lg',
    label: 'text-[#0F172A]',
    code: 'text-[#0E7490]',
    keyHint: '3',
  },
  blue: {
    topBar: 'bg-[#2563EB]',
    base: 'border-2 border-dashed border-[#2563EB]/50 bg-[#EFF6FF]/70 hover:border-[#2563EB]',
    draggingReady: 'border-2 border-dashed border-[#2563EB] bg-[#EFF6FF]',
    dragOver: 'border-2 border-solid border-[#2563EB] bg-[#DBEAFE]/75 scale-[1.02] clinical-shadow-lg',
    label: 'text-[#1E3A8A]',
    code: 'text-[#1E40AF]',
    keyHint: '4',
  },
  general: {
    topBar: 'bg-gradient-to-r from-[#1E293B] via-[#1E293B] to-[#16A34A]',
    base: 'border-2 border-dashed border-[#334155]/50 bg-[#F8FAFC] hover:border-[#15803D]',
    draggingReady: 'border-2 border-dashed border-[#15803D] bg-[#F0FDF4]',
    dragOver: 'border-2 border-solid border-[#15803D] bg-[#DCFCE7]/85 scale-[1.02] clinical-shadow-lg',
    label: 'text-[#0F172A]',
    code: 'text-[#15803D]',
    keyHint: '5',
  },
};

export const SegregationLabView: React.FC<SegregationLabViewProps> = ({
  onNavigate,
  onUpdateLabAccuracy,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<ClinicalUnit>('All Units');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const [dragOverBin, setDragOverBin] = useState<BinId | null>(null);
  const [shakingBin, setShakingBin] = useState<BinId | null>(null);
  const [successBin, setSuccessBin] = useState<BinId | null>(null);
  const [hadErrorOnCurrent, setHadErrorOnCurrent] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'error';
    chosenBin: BinId;
    message: string;
  } | null>(null);
  const [logs, setLogs] = useState<SortLogEntry[]>([]);
  const [streak, setStreak] = useState(0);

  const deck = useMemo(() => {
    if (selectedUnit === 'All Units') return SEGREGATION_ITEMS;
    return SEGREGATION_ITEMS.filter((item) => item.unit === selectedUnit);
  }, [selectedUnit]);

  const isSessionComplete = currentIndex >= deck.length;
  const activeItem: SegregationItem | undefined = deck[currentIndex];

  const firstTryCorrectCount = useMemo(
    () => logs.filter((entry) => entry.firstAttemptCorrect).length,
    [logs]
  );

  const accuracyPct =
    logs.length > 0 ? Math.round((firstTryCorrectCount / logs.length) * 100) : 100;

  useEffect(() => {
    if (logs.length > 0) {
      onUpdateLabAccuracy(accuracyPct, logs.length);
    }
  }, [accuracyPct, logs.length, onUpdateLabAccuracy]);

  const handleUnitChange = (unit: ClinicalUnit) => {
    setSelectedUnit(unit);
    setCurrentIndex(0);
    setShowHint(false);
    setFeedback(null);
    setHadErrorOnCurrent(false);
    setSuccessBin(null);
    setShakingBin(null);
    setIsDraggingItem(false);
    setDragOverBin(null);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowHint(false);
    setFeedback(null);
    setHadErrorOnCurrent(false);
    setSuccessBin(null);
    setShakingBin(null);
    setIsDraggingItem(false);
    setDragOverBin(null);
    setLogs([]);
    setStreak(0);
  };

  const advanceToNext = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    setShowHint(false);
    setFeedback(null);
    setHadErrorOnCurrent(false);
    setSuccessBin(null);
    setIsDraggingItem(false);
    setDragOverBin(null);
  }, []);

  const handleSortAttempt = useCallback(
    (chosenBin: BinId) => {
      if (!activeItem || successBin !== null) return;

      if (chosenBin === activeItem.correctBin) {
        const isFirstTry = !hadErrorOnCurrent;
        setSuccessBin(chosenBin);
        setStreak((prev) => (isFirstTry ? prev + 1 : 0));
        setFeedback({
          status: 'correct',
          chosenBin,
          message: activeItem.advisory,
        });
        setLogs((prev) => [
          {
            specimenCode: activeItem.specimenCode,
            itemName: activeItem.name,
            chosenBin,
            correctBin: activeItem.correctBin,
            firstAttemptCorrect: isFirstTry,
          },
          ...prev,
        ]);
      } else {
        setHadErrorOnCurrent(true);
        setStreak(0);
        setShakingBin(chosenBin);
        setTimeout(() => setShakingBin(null), 400);
        setFeedback({
          status: 'error',
          chosenBin,
          message: activeItem.wrongBinHazards[chosenBin],
        });
      }
    },
    [activeItem, hadErrorOnCurrent, successBin]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '1') handleSortAttempt('yellow');
      if (e.key === '2') handleSortAttempt('red');
      if (e.key === '3') handleSortAttempt('white');
      if (e.key === '4') handleSortAttempt('blue');
      if (e.key === '5') handleSortAttempt('general');
      if (e.key === 'Enter' && successBin !== null) advanceToNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advanceToNext, handleSortAttempt, successBin]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-8">
      {/* Lab Header & Unit Segmented Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="space-y-1.5">
          <p className="font-mono text-xs font-medium text-[#5B21B6] tracking-wide">
            Training Practice Bench · Drag & Drop Into Five Inline Bins
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Drag & Drop Segregation Practice Lab
          </h1>
        </div>

        <div
          role="group"
          aria-label="Clinical Department Filter"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#ECEEF0] rounded-lg self-start lg:self-auto"
        >
          {UNITS.map((unit) => {
            const active = selectedUnit === unit;
            return (
              <button
                key={unit}
                type="button"
                onClick={() => handleUnitChange(unit)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {unit}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabular Session Metrics Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 clinical-shadow-sm">
        <div>
          <span className="block text-xs text-[#475569]">Bench Progress</span>
          <span className="font-mono text-lg font-semibold text-[#0F172A] tabular-nums">
            {Math.min(currentIndex + (successBin ? 1 : 0), deck.length)} / {deck.length}
          </span>
        </div>
        <div>
          <span className="block text-xs text-[#475569]">First-Try Accuracy</span>
          <span className="font-mono text-lg font-semibold text-[#5B21B6] tabular-nums">
            {logs.length === 0 ? '—' : `${accuracyPct}%`}
          </span>
        </div>
        <div>
          <span className="block text-xs text-[#475569]">Clean Streak</span>
          <span className="font-mono text-lg font-semibold text-[#0F172A] tabular-nums">
            {streak}
          </span>
        </div>
        <div className="flex items-center sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] border border-slate-200 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset Bench
          </button>
        </div>
      </div>

      {/* Stacked Drag-and-Drop Segregation Stage: Specimen Above, 5 Inline Bins Below */}
      {isSessionComplete ? (
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center space-y-5 clinical-shadow-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ECFDF5] text-[#059669]">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">
              {selectedUnit} Practice Bench Complete
            </h2>
            <p className="text-base text-[#475569]">
              You sorted {deck.length} waste specimens across all 5 bins with{' '}
              <span className="font-mono font-semibold text-[#5B21B6] tabular-nums">
                {accuracyPct}%
              </span>{' '}
              first-try accuracy. Take Exam (Minimum 99% score is mandatory for getting the E-certificate).
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-sm font-semibold text-[#5B21B6] bg-white border-[1.5px] border-[#6D28D9] hover:bg-[#F5F3FF] rounded-lg transition-colors"
            >
              Repeat Practice
            </button>
            <button
              type="button"
              onClick={() => onNavigate('exam')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors"
            >
              Take Exam (Minimum 99% for E-Certificate)
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : (
        activeItem && (
          <div className="space-y-6">
            {/* Top Stage: Draggable Specimen Workbench & Diagnostic Feedback */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#ECEEF0]/60 border border-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px] space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Draggable Active Specimen Card */}
                <div
                  draggable={successBin === null}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', activeItem.id);
                    e.dataTransfer.effectAllowed = 'move';
                    setIsDraggingItem(true);
                  }}
                  onDragEnd={() => {
                    setIsDraggingItem(false);
                    setDragOverBin(null);
                  }}
                  className={`${
                    feedback ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl mx-auto w-full'
                  } bg-white border rounded-2xl p-6 transition-all clinical-shadow-lg ${
                    successBin !== null
                      ? 'border-[#10B981] bg-[#ECFDF5]/70'
                      : isDraggingItem
                      ? 'border-[#6D28D9] opacity-75 scale-[0.99] cursor-grabbing'
                      : 'border-slate-200 hover:border-[#6D28D9]/70 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="text-xs text-[#475569]">
                      <span className="font-mono font-semibold text-[#0F172A]">
                        {activeItem.specimenCode}
                      </span>
                      <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                      <span>{activeItem.unit}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B21B6]">
                      <GripVertical className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
                      {successBin === null ? 'Drag onto bin below' : 'Sorted'}
                    </span>
                  </div>

                  <div className="py-5 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-24 h-24 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center shrink-0">
                      <SpecimenIllustration type={activeItem.specimenType} className="w-20 h-20" />
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                        {activeItem.name}
                      </h2>
                      <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-[58ch]">
                        {activeItem.context}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setShowHint((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:text-[#00476E] transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" aria-hidden="true" />
                      {showHint ? 'Hide Clinical Clue' : 'Show Clinical Clue'}
                    </button>

                    <span className="font-mono text-xs text-[#64748B]">
                      Drag & Drop onto 5 Bins Below
                    </span>
                  </div>

                  {showHint && (
                    <p className="mt-3 pt-3 border-t border-slate-100 text-sm text-[#00476E]">
                      {activeItem.hint}
                    </p>
                  )}
                </div>

                {/* Diagnostic Feedback Card */}
                {feedback && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`lg:col-span-5 rounded-2xl p-6 border flex flex-col justify-between gap-4 clinical-shadow-sm ${
                      feedback.status === 'correct'
                        ? 'bg-[#ECFDF5] border-[#10B981]/50 text-[#065F46]'
                        : 'bg-[#FFF1F2] border-[#E11D48]/50 text-[#9F1239]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {feedback.status === 'correct' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      <div className="space-y-2">
                        <p className="font-display text-base font-bold">
                          {feedback.status === 'correct'
                            ? `Verified: ${BIN_PROTOCOLS[feedback.chosenBin].regulatoryCode}`
                            : `Hazard Alert — Incorrect Bin (${BIN_PROTOCOLS[feedback.chosenBin].shortLabel})`}
                        </p>
                        <p className="text-sm leading-relaxed">{feedback.message}</p>
                        {feedback.status === 'error' && (
                          <p className="text-xs font-medium pt-1">
                            Advisory by Dr. Akshaya N Shetti · Drag specimen to the compliant bin below.
                          </p>
                        )}
                      </div>
                    </div>

                    {feedback.status === 'correct' && (
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={advanceToNext}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors"
                        >
                          {currentIndex + 1 >= deck.length ? 'Finish Bench' : 'Next Specimen'}
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Stage: All Five Bins Arranged Strictly In Line */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#475569]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F172A]">
                  <ArrowDown className="w-3.5 h-3.5 text-[#6D28D9]" aria-hidden="true" />
                  Five Waste Segregation Bins (Drag & Drop Target Line)
                </span>
                <span className="font-mono hidden sm:inline">
                  {isDraggingItem ? 'Release over target bin to dispose' : 'Yellow · Red · White · Blue · Black/Green'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {BIN_ORDER.map((binId) => {
                  const protocol = BIN_PROTOCOLS[binId];
                  const styles = BIN_DROP_STYLES[binId];
                  const isDragOver = dragOverBin === binId;
                  const isShaking = shakingBin === binId;
                  const isConfirmed = successBin === binId;
                  const isDisabled = successBin !== null && !isConfirmed;

                  return (
                    <div
                      key={binId}
                      role="button"
                      tabIndex={isDisabled ? -1 : 0}
                      aria-disabled={isDisabled}
                      onClick={() => !isDisabled && handleSortAttempt(binId)}
                      onKeyDown={(e) => {
                        if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          handleSortAttempt(binId);
                        }
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        if (!isDisabled) setDragOverBin(binId);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (!isDisabled && dragOverBin !== binId) setDragOverBin(binId);
                      }}
                      onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                          setDragOverBin((prev) => (prev === binId ? null : prev));
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverBin(null);
                        setIsDraggingItem(false);
                        if (!isDisabled) {
                          handleSortAttempt(binId);
                        }
                      }}
                      className={`text-left rounded-2xl overflow-hidden flex flex-col justify-between transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] ${
                        isDragOver
                          ? styles.dragOver
                          : isDraggingItem && !isDisabled
                          ? styles.draggingReady
                          : styles.base
                      } ${isShaking ? 'animate-clinical-shake' : ''} ${
                        isConfirmed ? 'ring-2 ring-[#059669] bg-[#ECFDF5]' : ''
                      } ${isDisabled ? 'opacity-55 cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className={`h-2.5 w-full ${styles.topBar}`} />
                      <div className="p-4 flex-1 flex flex-col justify-between min-h-[190px]">
                        <div className="flex items-start justify-between gap-2 w-full">
                          <BinReceptacleGraphic bin={binId} className="w-11 h-13 shrink-0" />
                          <div className="text-right space-y-0.5">
                            <span className={`block font-mono text-[11px] font-semibold ${styles.code}`}>
                              {protocol.regulatoryCode}
                            </span>
                            <span className="block font-mono text-[10px] text-[#64748B]">
                              Key {styles.keyHint}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1">
                          <h3 className={`font-display text-base font-bold ${styles.label}`}>
                            {protocol.shortLabel}
                          </h3>
                          <p className="text-[11px] text-[#475569] leading-snug line-clamp-3">
                            {isDragOver
                              ? 'Release specimen to deposit here'
                              : protocol.treatmentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}

      {/* Segregation Audit Log Table */}
      {logs.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden clinical-shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#0F172A]">
              Session Audit Trail
            </h2>
            <span className="font-mono text-xs text-[#475569] tabular-nums">
              {logs.length} Recorded
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-[#475569]">
                  <th className="py-3 px-6">Specimen ID</th>
                  <th className="py-3 px-4">Clinical Item</th>
                  <th className="py-3 px-4">Assigned Bin</th>
                  <th className="py-3 px-6 text-right">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((entry, idx) => (
                  <tr key={`${entry.specimenCode}-${idx}`}>
                    <td className="py-3 px-6 font-mono text-xs text-[#0F172A] whitespace-nowrap">
                      {entry.specimenCode}
                    </td>
                    <td className="py-3 px-4 text-[#334155]">{entry.itemName}</td>
                    <td className="py-3 px-4 font-medium text-[#0F172A] whitespace-nowrap">
                      {BIN_PROTOCOLS[entry.correctBin].shortLabel}
                    </td>
                    <td
                      className={`py-3 px-6 text-right font-medium whitespace-nowrap ${
                        entry.firstAttemptCorrect ? 'text-[#059669]' : 'text-[#B45309]'
                      }`}
                    >
                      {entry.firstAttemptCorrect ? 'First-Try Verified' : 'Corrected on Retry'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
