import React, { useEffect, useRef, useState } from 'react';
import { Award, ChevronDown, LogOut, ShieldCheck } from 'lucide-react';

export type AppScreen = 'curriculum' | 'lab' | 'exam' | 'credential';

interface TopBarProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  hasPassedExam: boolean;
  practitionerName: string;
  onSignOut: () => void;
}

const NAV_ITEMS: { id: AppScreen; label: string }[] = [
  { id: 'curriculum', label: '01. Training' },
  { id: 'lab', label: '02. Practice Lab' },
  { id: 'exam', label: '03. Exam (99%)' },
  { id: 'credential', label: '04. Certification' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onNavigate,
  hasPassedExam,
  practitionerName,
  onSignOut,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const displayShortName =
    practitionerName.trim().split(/\s+/).slice(0, 2).join(' ') || 'Clinician';

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('curriculum')}
          className="font-display text-lg font-extrabold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded"
        >
          BMW
        </button>

        {/* Zone 2: 4 Sequential Workflow Nav Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded-sm ${
                  isActive
                    ? 'text-[#5B21B6] font-semibold'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#6D28D9]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action / Account Menu */}
        <div ref={menuRef} className="relative flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6D28D9]"
          >
            <span className="max-w-[130px] truncate">{displayShortName}</span>
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl py-1.5 clinical-shadow-lg z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-[#0F172A] truncate">
                  {practitionerName || 'Clinician Session'}
                </p>
                <p className="font-mono text-[11px] text-[#5B21B6]">
                  {hasPassedExam ? 'Certified (>=99%)' : 'Training Active'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate(hasPassedExam ? 'credential' : 'exam');
                }}
                className="w-full text-left px-4 py-2 text-sm text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] flex items-center gap-2.5"
              >
                {hasPassedExam ? (
                  <>
                    <Award className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
                    View Certification
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
                    Take Drag & Drop Exam
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut();
                }}
                className="w-full text-left px-4 py-2 text-sm text-[#BE123C] hover:bg-[#FFF1F2] flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden border-t border-slate-100 px-4 flex items-center gap-5 overflow-x-auto"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isActive ? 'text-[#5B21B6]' : 'text-[#475569]'
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-[#6D28D9]"
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
