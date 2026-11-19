import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  GripVertical,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  BIN_PROTOCOLS,
  BinId,
  EXAM_SPECIMENS,
  SegregationItem,
} from '../data/bmwmData';
import { BinReceptacleGraphic, SpecimenIllustration } from './ClinicalIcons';
import { AppScreen } from './TopBar';

export interface ExamResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  timeTakenSeconds: number;
}

interface CertificationExamViewProps {
  examResult: ExamResult | null;
  onCompleteExam: (result: ExamResult) => void;
  onNavigate: (screen: AppScreen) => void;
}

const TOTAL_EXAM_SECONDS = 15 * 60;
const PASS_PERCENTAGE = 99;
const BIN_ORDER: BinId[] = ['yellow', 'red', 'white', 'blue', 'general'];

const BIN_DROP_STYLES: Record<
  BinId,
  {
    topBar: string;
    base: string;
    draggingReady: string;
    dragOver: string;
    assigned: string;
    label: string;
    code: string;
  }
> = {
  yellow: {
    topBar: 'bg-[#EAB308]',
    base: 'border-2 border-dashed border-[#CA8A04]/55 bg-[#FEFCE8]/70 hover:border-[#CA8A04]',
    draggingReady: 'border-2 border-dashed border-[#CA8A04] bg-[#FEFCE8]',
    dragOver: 'border-2 border-solid border-[#CA8A04] bg-[#FEF08A]/75 scale-[1.02] clinical-shadow-lg',
    assigned: 'border-2 border-solid border-[#CA8A04] bg-[#FEF08A]/60 ring-2 ring-[#CA8A04]/25',
    label: 'text-[#451A03]',
    code: 'text-[#854D0E]',
  },
  red: {
    topBar: 'bg-[#DC2626]',
    base: 'border-2 border-dashed border-[#DC2626]/50 bg-[#FEF2F2]/70 hover:border-[#DC2626]',
    draggingReady: 'border-2 border-dashed border-[#DC2626] bg-[#FEF2F2]',
    dragOver: 'border-2 border-solid border-[#DC2626] bg-[#FECACA]/65 scale-[1.02] clinical-shadow-lg',
    assigned: 'border-2 border-solid border-[#DC2626] bg-[#FECACA]/55 ring-2 ring-[#DC2626]/25',
    label: 'text-[#7F1D1D]',
    code: 'text-[#991B1B]',
  },
  white: {
    topBar: 'bg-[#0891B2]',
    base: 'border-2 border-dashed border-[#0891B2]/60 sharps-frosted hover:border-[#0891B2]',
    draggingReady: 'border-2 border-dashed border-[#0891B2] sharps-frosted',
    dragOver: 'border-2 border-solid border-[#0891B2] bg-[#ECFEFF]/95 scale-[1.02] clinical-shadow-lg',
    assigned: 'border-2 border-solid border-[#0891B2] bg-[#ECFEFF]/90 ring-2 ring-[#0891B2]/25',
    label: 'text-[#0F172A]',
    code: 'text-[#0E7490]',
  },
  blue: {
    topBar: 'bg-[#2563EB]',
    base: 'border-2 border-dashed border-[#2563EB]/50 bg-[#EFF6FF]/70 hover:border-[#2563EB]',
    draggingReady: 'border-2 border-dashed border-[#2563EB] bg-[#EFF6FF]',
    dragOver: 'border-2 border-solid border-[#2563EB] bg-[#DBEAFE]/75 scale-[1.02] clinical-shadow-lg',
    assigned: 'border-2 border-solid border-[#2563EB] bg-[#DBEAFE]/65 ring-2 ring-[#2563EB]/25',
    label: 'text-[#1E3A8A]',
    code: 'text-[#1E40AF]',
  },
  general: {
    topBar: 'bg-gradient-to-r from-[#1E293B] via-[#1E293B] to-[#16A34A]',
    base: 'border-2 border-dashed border-[#334155]/50 bg-[#F8FAFC] hover:border-[#15803D]',
    draggingReady: 'border-2 border-dashed border-[#15803D] bg-[#F0FDF4]',
    dragOver: 'border-2 border-solid border-[#15803D] bg-[#DCFCE7]/85 scale-[1.02] clinical-shadow-lg',
    assigned: 'border-2 border-solid border-[#15803D] bg-[#DCFCE7]/75 ring-2 ring-[#15803D]/25',
    label: 'text-[#0F172A]',
    code: 'text-[#15803D]',
  },
};

const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const CertificationExamView: React.FC<CertificationExamViewProps> = ({
  examResult,
  onCompleteExam,
  onNavigate,
}) => {
  const [phase, setPhase] = useState<'briefing' | 'active' | 'review'>(
    examResult ? 'review' : 'briefing'
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, BinId>>({});
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_EXAM_SECONDS);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const [dragOverBin, setDragOverBin] = useState<BinId | null>(null);

  const totalSpecimens = EXAM_SPECIMENS.length;
  const activeItem: SegregationItem = EXAM_SPECIMENS[currentIdx];

  const handleSubmitExam = useCallback(
    (finalAssignments?: Record<string, BinId>) => {
      const mapToScore = finalAssignments ?? assignments;
      let correctCount = 0;
      EXAM_SPECIMENS.forEach((item) => {
        if (mapToScore[item.id] === item.correctBin) {
          correctCount += 1;
        }
      });
      const percentage = Math.round((correctCount / totalSpecimens) * 100);
      const result: ExamResult = {
        score: correctCount,
        total: totalSpecimens,
        percentage,
        passed: percentage >= PASS_PERCENTAGE,
        submittedAt: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        timeTakenSeconds: TOTAL_EXAM_SECONDS - secondsLeft,
      };
      onCompleteExam(result);
      setPhase('review');
    },
    [assignments, onCompleteExam, secondsLeft, totalSpecimens]
  );

  useEffect(() => {
    if (phase !== 'active') return;
    if (secondsLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft, handleSubmitExam]);

  const handleStartExam = () => {
    setAssignments({});
    setCurrentIdx(0);
    setSecondsLeft(TOTAL_EXAM_SECONDS);
    setIsDraggingItem(false);
    setDragOverBin(null);
    setPhase('active');
  };

  const handleDropIntoBin = useCallback(
    (chosenBin: BinId) => {
      if (!activeItem) return;
      const updated = { ...assignments, [activeItem.id]: chosenBin };
      setAssignments(updated);
      setIsDraggingItem(false);
      setDragOverBin(null);

      // Move smoothly to next specimen if not on the last item
      if (currentIdx + 1 < totalSpecimens) {
        setTimeout(() => {
          setCurrentIdx((prev) => Math.min(totalSpecimens - 1, prev + 1));
        }, 120);
      }
    },
    [activeItem, assignments, currentIdx, totalSpecimens]
  );

  const assignedCount = Object.keys(assignments).length;

  const binBreakdown = useMemo(() => {
    return BIN_ORDER.map((binId) => {
      const itemsInBin = EXAM_SPECIMENS.filter((i) => i.correctBin === binId);
      const correctInBin = itemsInBin.filter(
        (i) => assignments[i.id] === i.correctBin
      ).length;
      return {
        binId,
        label: BIN_PROTOCOLS[binId].shortLabel,
        correct: correctInBin,
        total: itemsInBin.length,
      };
    });
  }, [assignments]);

  if (phase === 'briefing') {
    return (
      <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 clinical-shadow-sm space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-xs font-medium text-[#5B21B6] tracking-wide">
              BMWM & SWM Certification Assessment · Dr. Akshaya N Shetti
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Drag & Drop Certification Exam
            </h1>
            <p className="text-base text-[#475569] leading-relaxed max-w-[65ch]">
              Practical segregation assessment using drag-and-drop only. Sort all 20 hospital waste specimens across the five inline bins (Yellow, Red, White Puncture-Proof, Blue, and Black/Green General Waste).
            </p>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-slate-200">
            <div>
              <dt className="text-xs text-[#475569]">Exam Technique</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-[#0F172A] tabular-nums">
                20 Drag & Drop Items
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#475569]">Time Allocation</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-[#0F172A] tabular-nums">
                15:00 Minutes
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#475569]">Passing Benchmark</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-[#5B21B6] tabular-nums">
                Minimum 99% (20 / 20)
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate('lab')}
              className="px-4 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F172A] transition-colors"
            >
              Return to Practice Lab
            </button>
            <button
              type="button"
              onClick={handleStartExam}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors"
            >
              Begin Drag & Drop Exam
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (phase === 'review' && examResult) {
    return (
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* Diagnostic Outcome Summary */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 clinical-shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                {examResult.passed ? (
                  <span className="text-[#059669]">PASSED · MINIMUM 99% ACHIEVED</span>
                ) : (
                  <span className="text-[#E11D48]">FAILED · RETAKE REQUIRED (BELOW 99%)</span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {examResult.passed
                  ? 'Certification Exam Passed'
                  : 'Exam Not Passed — Retake Required'}
              </h1>
              <p className="text-sm text-[#475569]">
                {examResult.passed
                  ? 'You achieved at least 99% accuracy across all five waste streams. Your official E-certificate is unlocked.'
                  : 'Minimum 99% score (20 out of 20 correct) is mandatory for getting the E-certificate. Review your sorting mismatches below and retake the exam.'}
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="block text-xs text-[#475569]">Final Exam Score</span>
              <span
                className={`font-mono text-4xl font-bold tabular-nums ${
                  examResult.passed ? 'text-[#059669]' : 'text-[#E11D48]'
                }`}
              >
                {examResult.percentage}%
              </span>
              <span className="block font-mono text-xs text-[#475569] tabular-nums">
                {examResult.score} of {examResult.total} Correct · {formatTimer(examResult.timeTakenSeconds)}
              </span>
            </div>
          </div>

          {!examResult.passed && (
            <div className="p-4 rounded-xl bg-[#FFF1F2] border border-[#E11D48]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 text-[#9F1239]">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-semibold">Retake Required Before E-Certificate</p>
                  <p>
                    You scored {examResult.percentage}%. Please retake the Drag & Drop Exam — minimum 99% score is mandatory for getting the E-certificate.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStartExam}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Retake Exam Now
              </button>
            </div>
          )}

          {/* Per-Bin Mastery Breakdown */}
          {Object.keys(assignments).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {binBreakdown.map((stat) => {
                const pct = Math.round((stat.correct / stat.total) * 100);
                return (
                  <div key={stat.binId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0F172A]">{stat.label}</span>
                      <span className="font-mono text-[#475569] tabular-nums">
                        {stat.correct}/{stat.total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${pct === 100 ? 'bg-[#059669]' : 'bg-[#0284C7]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleStartExam}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#475569] hover:text-[#0F172A] border border-slate-300 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Retake Exam
            </button>

            {examResult.passed ? (
              <button
                type="button"
                onClick={() => onNavigate('credential')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Proceed to Certification Page
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('lab')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#5B21B6] bg-[#F5F3FF] border border-[#6D28D9] hover:bg-[#EDE9FE] rounded-lg transition-colors"
              >
                Review in Practice Lab First
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        {/* Specimen-by-Specimen Audit Review */}
        {Object.keys(assignments).length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 clinical-shadow-sm">
            <div className="px-6 py-4">
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Specimen Segregation Audit
              </h2>
            </div>
            {EXAM_SPECIMENS.map((item, idx) => {
              const userBin = assignments[item.id];
              const isCorrect = userBin === item.correctBin;
              return (
                <div key={item.id} className="p-5 sm:p-6 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[#475569]">
                      {idx + 1}. {item.specimenCode} · {item.unit}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isCorrect ? 'text-[#059669]' : 'text-[#E11D48]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          Correct ({BIN_PROTOCOLS[item.correctBin].shortLabel})
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" aria-hidden="true" />
                          Dropped in {userBin ? BIN_PROTOCOLS[userBin].shortLabel : 'Unassigned'} · Required: {BIN_PROTOCOLS[item.correctBin].shortLabel}
                        </>
                      )}
                    </span>
                  </div>
                  <p className="font-display text-base font-semibold text-[#0F172A]">
                    {item.name}
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">{item.advisory}</p>
                </div>
              );
            })}
          </section>
        )}
      </div>
    );
  }

  const currentAssignedBin = assignments[activeItem.id];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-6">
      {/* Top Exam Status Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 clinical-shadow-sm">
        <div className="space-y-0.5">
          <p className="font-mono text-xs font-semibold text-[#5B21B6]">
            CERTIFICATION EXAM · DRAG & DROP ONLY (MINIMUM 99% REQUIRED)
          </p>
          <p className="font-mono text-sm text-[#475569] tabular-nums">
            Specimen {currentIdx + 1} of {totalSpecimens} · {assignedCount}/{totalSpecimens} Assigned
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-mono text-base font-semibold text-[#0F172A] tabular-nums">
            <Clock className="w-4 h-4 text-[#5B21B6]" aria-hidden="true" />
            {formatTimer(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={() => handleSubmitExam()}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Submit Exam ({assignedCount}/{totalSpecimens})
          </button>
        </div>
      </div>

      {/* Draggable Exam Specimen Workbench */}
      <div className="rounded-2xl p-5 sm:p-6 bg-[#ECEEF0]/60 border border-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px]">
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', activeItem.id);
            e.dataTransfer.effectAllowed = 'move';
            setIsDraggingItem(true);
          }}
          onDragEnd={() => {
            setIsDraggingItem(false);
            setDragOverBin(null);
          }}
          className={`max-w-3xl mx-auto bg-white border rounded-2xl p-6 transition-all clinical-shadow-lg ${
            isDraggingItem
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
              {currentAssignedBin && (
                <>
                  <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                  <span className="font-semibold text-[#5B21B6]">
                    Assigned: {BIN_PROTOCOLS[currentAssignedBin].shortLabel}
                  </span>
                </>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B21B6]">
              <GripVertical className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
              Drag onto target bin below
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Previous Specimen
            </button>

            <button
              type="button"
              disabled={currentIdx + 1 >= totalSpecimens}
              onClick={() => setCurrentIdx((prev) => Math.min(totalSpecimens - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B21B6] hover:text-[#4C1D95] disabled:opacity-40"
            >
              Next Specimen
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Inline Bins Drop Line */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#475569]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F172A]">
            <ArrowDown className="w-3.5 h-3.5 text-[#6D28D9]" aria-hidden="true" />
            Drop Specimen Into One of the Five Bins In Line
          </span>
          <span className="font-mono hidden sm:inline">
            Yellow · Red · White · Blue · Black/Green
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {BIN_ORDER.map((binId) => {
            const protocol = BIN_PROTOCOLS[binId];
            const styles = BIN_DROP_STYLES[binId];
            const isDragOver = dragOverBin === binId;
            const isAssignedHere = currentAssignedBin === binId;

            return (
              <div
                key={binId}
                role="button"
                tabIndex={0}
                onClick={() => handleDropIntoBin(binId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDropIntoBin(binId);
                  }
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOverBin(binId);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverBin !== binId) setDragOverBin(binId);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverBin((prev) => (prev === binId ? null : prev));
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropIntoBin(binId);
                }}
                className={`text-left rounded-2xl overflow-hidden flex flex-col justify-between transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] ${
                  isDragOver
                    ? styles.dragOver
                    : isAssignedHere
                    ? styles.assigned
                    : isDraggingItem
                    ? styles.draggingReady
                    : styles.base
                }`}
              >
                <div className={`h-2.5 w-full ${styles.topBar}`} />
                <div className="p-4 flex-1 flex flex-col justify-between min-h-[175px]">
                  <div className="flex items-start justify-between gap-2 w-full">
                    <BinReceptacleGraphic bin={binId} className="w-11 h-13 shrink-0" />
                    <span className={`font-mono text-[11px] font-semibold ${styles.code}`}>
                      {protocol.regulatoryCode}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h3 className={`font-display text-base font-bold ${styles.label}`}>
                      {protocol.shortLabel}
                    </h3>
                    <p className="text-[11px] text-[#475569] leading-snug">
                      {isDragOver
                        ? 'Release to assign this bin'
                        : isAssignedHere
                        ? 'Currently assigned'
                        : 'Drop specimen here'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 20-Item Progress Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 clinical-shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#475569]">
          <span className="font-semibold text-[#0F172A]">Specimen Navigator</span>
          <span className="font-mono tabular-nums">
            {assignedCount} of {totalSpecimens} Sorted
          </span>
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
          {EXAM_SPECIMENS.map((item, idx) => {
            const isCurrent = idx === currentIdx;
            const isAssigned = !!assignments[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-8 rounded font-mono text-xs font-semibold border transition-colors tabular-nums ${
                  isCurrent
                    ? 'border-[#6D28D9] bg-[#6D28D9] text-white'
                    : isAssigned
                    ? 'border-[#6D28D9]/40 bg-[#F5F3FF] text-[#5B21B6]'
                    : 'border-slate-200 bg-[#F8FAFC] text-[#475569] hover:border-slate-300'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
