/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AppScreen, TopBar } from './components/TopBar';
import { LoginView } from './components/LoginView';
import { CurriculumView } from './components/CurriculumView';
import { SegregationLabView } from './components/SegregationLabView';
import {
  CertificationExamView,
  ExamResult,
} from './components/CertificationExamView';
import {
  CredentialView,
  PractitionerProfile,
} from './components/CredentialView';

const STORAGE_KEY = 'bmw_training_state_v3';

interface PersistedState {
  isAuthenticated: boolean;
  completedModules: string[];
  examResult: ExamResult | null;
  labStats: { accuracyPct: number; totalSorted: number };
  profile: PractitionerProfile;
}

const DEFAULT_STATE: PersistedState = {
  isAuthenticated: false,
  completedModules: [],
  examResult: null,
  labStats: { accuracyPct: 0, totalSorted: 0 },
  profile: {
    fullName: '',
    designation: 'Doctor',
    institution: 'SNMC and HSK Hospital Bagalkot, Karnataka',
    employeeId: '',
    email: '',
    whatsappNumber: '',
  },
};

function loadState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState> & {
      profile?: Partial<PractitionerProfile> & { registrationId?: string };
    };
    const rawProfile: Partial<PractitionerProfile> & { registrationId?: string } =
      parsed.profile ?? {};
    return {
      isAuthenticated: Boolean(parsed.isAuthenticated),
      completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
      examResult:
        parsed.examResult && parsed.examResult.total === 20
          ? { ...parsed.examResult, passed: parsed.examResult.percentage >= 99 }
          : null,
      labStats: parsed.labStats ?? DEFAULT_STATE.labStats,
      profile: {
        ...DEFAULT_STATE.profile,
        ...rawProfile,
        employeeId: rawProfile.employeeId ?? rawProfile.registrationId ?? '',
        email: rawProfile.email ?? '',
        whatsappNumber: rawProfile.whatsappNumber ?? '',
      },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('curriculum');
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const handleLoginSuccess = useCallback((profile: PractitionerProfile) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      profile,
    }));
    setActiveScreen('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSignOut = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
    setActiveScreen('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((screen: AppScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleModuleComplete = useCallback((moduleId: string) => {
    setState((prev) => {
      const exists = prev.completedModules.includes(moduleId);
      const nextModules = exists
        ? prev.completedModules.filter((id) => id !== moduleId)
        : [...prev.completedModules, moduleId];
      return { ...prev, completedModules: nextModules };
    });
  }, []);

  const handleUpdateLabAccuracy = useCallback((accuracyPct: number, totalSorted: number) => {
    setState((prev) => ({
      ...prev,
      labStats: { accuracyPct, totalSorted },
    }));
  }, []);

  const handleCompleteExam = useCallback((result: ExamResult) => {
    setState((prev) => ({
      ...prev,
      examResult: result,
    }));
  }, []);

  const handleUpdateProfile = useCallback((profile: PractitionerProfile) => {
    setState((prev) => ({
      ...prev,
      profile,
    }));
  }, []);

  if (!state.isAuthenticated) {
    return (
      <LoginView
        initialProfile={state.profile}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <TopBar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        hasPassedExam={!!state.examResult?.passed}
        practitionerName={state.profile.fullName}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {activeScreen === 'curriculum' && (
          <CurriculumView
            practitionerName={state.profile.fullName}
            completedModules={state.completedModules}
            onToggleModuleComplete={handleToggleModuleComplete}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'lab' && (
          <SegregationLabView
            onNavigate={handleNavigate}
            onUpdateLabAccuracy={handleUpdateLabAccuracy}
          />
        )}

        {activeScreen === 'exam' && (
          <CertificationExamView
            examResult={state.examResult}
            onCompleteExam={handleCompleteExam}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'credential' && (
          <CredentialView
            profile={state.profile}
            onUpdateProfile={handleUpdateProfile}
            examResult={state.examResult}
            labStats={state.labStats}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <footer className="no-print border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>
            BMW · Biomedical Waste Management Training & Certification · Developed by Dr. Akshaya N Shetti
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('curriculum')}
              className="hover:text-[#0F172A] transition-colors"
            >
              Schedule I Reference
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('lab')}
              className="hover:text-[#0F172A] transition-colors"
            >
              Segregation Lab
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('exam')}
              className="hover:text-[#0F172A] transition-colors"
            >
              Certification Exam
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
