import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Copy, Lock, Printer, ShieldCheck } from 'lucide-react';
import { HOSPITAL_INSTITUTIONS } from '../data/bmwmData';
import { CertifiedSeal } from './ClinicalIcons';
import { ExamResult } from './CertificationExamView';
import { AppScreen } from './TopBar';

export interface PractitionerProfile {
  fullName: string;
  designation: string;
  institution: string;
  employeeId: string;
  email: string;
  whatsappNumber: string;
}

interface CredentialViewProps {
  profile: PractitionerProfile;
  onUpdateProfile: (profile: PractitionerProfile) => void;
  examResult: ExamResult | null;
  labStats: { accuracyPct: number; totalSorted: number };
  onNavigate: (screen: AppScreen) => void;
}

const DESIGNATIONS = ['Doctor', 'Nurse', 'Servant'];

const VerificationBarcode: React.FC<{ seed: string }> = ({ seed }) => {
  const bars = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < 28; i += 1) {
      const charCode = seed.charCodeAt(i % seed.length) || 65;
      out.push(((charCode + i * 7) % 3) + 1);
    }
    return out;
  }, [seed]);

  return (
    <div className="flex items-center gap-[2px] h-7" aria-hidden="true">
      {bars.map((width, idx) => (
        <span
          key={idx}
          className="h-full bg-[#0F172A]/80"
          style={{ width: `${width}px` }}
        />
      ))}
    </div>
  );
};

export const CredentialView: React.FC<CredentialViewProps> = ({
  profile,
  onUpdateProfile,
  examResult,
  labStats,
  onNavigate,
}) => {
  const [copiedId, setCopiedId] = useState(false);

  const isCertified = !!examResult?.passed && profile.fullName.trim().length > 1;

  const serialId = useMemo(() => {
    const cleanName = (profile.fullName || 'CLINICIAN').replace(/[^A-Za-z]/g, '').toUpperCase();
    const prefix = cleanName.slice(0, 3).padEnd(3, 'X');
    const scorePart = examResult ? String(examResult.percentage).padStart(3, '0') : '000';
    return `CBC-BMWM-2026-${prefix}-${scorePart}`;
  }, [profile.fullName, examResult]);

  const handleCopySerial = async () => {
    try {
      await navigator.clipboard.writeText(serialId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // Clipboard API fallback ignored if restricted
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
      {/* Screen Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs font-medium text-[#5B21B6] tracking-wide">
            Schedule I Compliance Credential · Dr. Akshaya N Shetti
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Practitioner Certification Credential
          </h1>
        </div>

        {isCertified && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopySerial}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0F172A] bg-white border border-slate-300 hover:border-[#6D28D9] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {copiedId ? (
                <>
                  <Check className="w-4 h-4 text-[#059669]" aria-hidden="true" />
                  Serial Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#475569]" aria-hidden="true" />
                  Copy Serial ID
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              Print Certificate
            </button>
          </div>
        )}
      </div>

      {/* Prerequisite Banner when Exam Not Passed */}
      {!examResult?.passed && (
        <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 clinical-shadow-sm">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h2 className="font-display text-base font-bold text-[#0F172A]">
                Exam Verification Required (Minimum 99% Benchmark) to Unlock E-Certificate
              </h2>
              <p className="text-sm text-[#475569]">
                Minimum 99% score (20 out of 20) on the Drag & Drop Certification Exam is mandatory for getting the official E-certificate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('exam')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            Take Certification Exam
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Practitioner Registration Form */}
        <section className="no-print lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 clinical-shadow-sm space-y-5">
          <div className="space-y-1 pb-3 border-b border-slate-100">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              Practitioner Details
            </h2>
            <p className="text-xs text-[#475569]">
              Fields update your verified credential card in real time.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="practitioner-name"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Full Name (as printed on certificate)
              </label>
              <input
                id="practitioner-name"
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, fullName: e.target.value })
                }
                placeholder="e.g., Dr. Ananya Kulkarni"
                className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="practitioner-role"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Clinical Designation
              </label>
              <select
                id="practitioner-role"
                value={profile.designation}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, designation: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 transition-shadow"
              >
                {DESIGNATIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="practitioner-institution"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Hospital / Institution
              </label>
              <select
                id="practitioner-institution"
                value={
                  HOSPITAL_INSTITUTIONS.includes(
                    profile.institution as (typeof HOSPITAL_INSTITUTIONS)[number]
                  )
                    ? profile.institution
                    : '__other__'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateProfile({
                    ...profile,
                    institution: val === '__other__' ? '' : val,
                  });
                }}
                className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 transition-shadow"
              >
                {HOSPITAL_INSTITUTIONS.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
                <option value="__other__">Other Hospital / Institution</option>
              </select>
              {!HOSPITAL_INSTITUTIONS.includes(
                profile.institution as (typeof HOSPITAL_INSTITUTIONS)[number]
              ) && (
                <input
                  type="text"
                  value={profile.institution}
                  onChange={(e) =>
                    onUpdateProfile({ ...profile, institution: e.target.value })
                  }
                  placeholder="Enter Hospital / Institution Name"
                  className="mt-2 w-full px-3.5 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 transition-shadow"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="practitioner-empid"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Employee ID
              </label>
              <input
                id="practitioner-empid"
                type="text"
                value={profile.employeeId}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, employeeId: e.target.value })
                }
                placeholder="e.g., EMP-2026-4812"
                className="w-full px-3.5 py-2.5 font-mono text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="practitioner-email"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Email ID
              </label>
              <input
                id="practitioner-email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, email: e.target.value })
                }
                placeholder="e.g., clinician@hospital.org"
                className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="practitioner-whatsapp"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                WhatsApp Number
              </label>
              <input
                id="practitioner-whatsapp"
                type="tel"
                value={profile.whatsappNumber}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, whatsappNumber: e.target.value })
                }
                placeholder="e.g., +91 98765 43210"
                className="w-full px-3.5 py-2.5 font-mono text-sm text-[#0F172A] bg-white border-[1.5px] border-[#CBD5E1] rounded-lg outline-none focus:border-[#6D28D9] focus:ring-[3px] focus:ring-[#6D28D9]/15 transition-shadow"
              />
            </div>
          </div>
        </section>

        {/* Right: High-Tier Certification Credential Card */}
        <section className="lg:col-span-8">
          <div className="print-only-certificate bg-white border-2 border-[#6D28D9]/30 rounded-2xl overflow-hidden clinical-shadow-lg p-2">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Micro-Hologram Gradient Header Accent */}
              <div className="certificate-hologram h-3 w-full border-b border-[#6D28D9]/20" />

              <div className="p-6 sm:p-10 space-y-8">
                {/* Top Certificate Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
                  <div className="space-y-1.5">
                    <p className="font-mono text-xs font-semibold text-[#5B21B6] tracking-wide">
                      BMW · INDIAN BMWM SCHEDULE I CERTIFICATION
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                      Certificate of Clinical Compliance
                    </h2>
                    <p className="text-sm text-[#475569]">
                      Biomedical Waste Segregation, Sharps Containment & CBMWTF Protocol
                    </p>
                  </div>

                  <CertifiedSeal className="w-20 h-20 shrink-0" />
                </div>

                {/* Recipient & Attainment Body */}
                <div className="space-y-4">
                  <p className="text-sm text-[#475569]">This clinical credential certifies that</p>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A]">
                      {profile.fullName.trim() || 'Practitioner Name Required'}
                    </p>
                    <p className="mt-1 text-base text-[#334155]">
                      {profile.designation}
                      {profile.institution.trim() ? ` · ${profile.institution.trim()}` : ''}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-[65ch]">
                    has completed the structured Biomedical Waste Management curriculum and demonstrated at least 99% proficiency across five-stream segregation (Yellow, Red, White Puncture-Proof, Blue, and Black/Green General Waste), sharps safety, and chain-of-custody standards.
                  </p>
                </div>

                {/* Verified Metadata Grid in JetBrains Mono */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-5 py-5 border-y border-slate-200">
                  <div>
                    <dt className="text-xs text-[#64748B]">Credential Serial</dt>
                    <dd className="mt-1 font-mono text-xs sm:text-sm font-semibold text-[#0F172A] break-all">
                      {serialId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#64748B]">Assessment Score</dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-[#5B21B6] tabular-nums">
                      {examResult ? `${examResult.percentage}% (${examResult.score}/${examResult.total})` : 'Pending Exam'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#64748B]">Lab Triage Record</dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-[#0F172A] tabular-nums">
                      {labStats.totalSorted > 0 ? `${labStats.accuracyPct}% (${labStats.totalSorted} items)` : 'Not Recorded'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#64748B]">Verification Status</dt>
                    <dd
                      className={`mt-1 inline-flex items-center gap-1 font-mono text-sm font-semibold ${
                        isCertified ? 'text-[#059669]' : 'text-[#64748B]'
                      }`}
                    >
                      {isCertified ? (
                        <>
                          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                          VERIFIED
                        </>
                      ) : (
                        'PROVISIONAL'
                      )}
                    </dd>
                  </div>
                </dl>

                {/* Authorship, Barcode & Signature Footer */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2">
                  <div className="space-y-2.5">
                    <VerificationBarcode seed={serialId} />
                    <div className="space-y-0.5">
                      <p className="font-mono text-xs text-[#64748B]">
                        Employee ID: {profile.employeeId.trim() || 'UNASSIGNED'}
                      </p>
                      {profile.email.trim() && (
                        <p className="font-mono text-xs text-[#64748B]">
                          Email: {profile.email.trim()}
                        </p>
                      )}
                      {profile.whatsappNumber.trim() && (
                        <p className="font-mono text-xs text-[#64748B]">
                          WhatsApp: {profile.whatsappNumber.trim()}
                        </p>
                      )}
                      <p className="font-mono text-xs text-[#64748B]">
                        Issue Date: {examResult?.submittedAt || 'Pending Assessment'}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1">
                    <p className="font-display text-xl font-bold italic text-[#5B21B6]">
                      Dr. Akshaya N Shetti
                    </p>
                    <div className="h-px w-48 bg-slate-300 sm:ml-auto" />
                    <p className="text-xs font-semibold text-[#0F172A]">
                      Developed by · Clinical Safety Lead
                    </p>
                    <p className="text-xs text-[#64748B]">
                      Biomedical Waste Management Protocols
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
