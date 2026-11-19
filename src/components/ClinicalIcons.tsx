import React from 'react';
import { BinId, SpecimenType } from '../data/bmwmData';

export const BinReceptacleGraphic: React.FC<{ bin: BinId; className?: string }> = ({
  bin,
  className = 'w-14 h-16',
}) => {
  if (bin === 'yellow') {
    return (
      <svg viewBox="0 0 64 72" fill="none" className={className} aria-hidden="true">
        <rect x="12" y="14" width="40" height="50" rx="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
        <path d="M9 14C9 11.7909 10.7909 10 13 10H51C53.2091 10 55 11.7909 55 14V18H9V14Z" fill="#EAB308" stroke="#A16207" strokeWidth="2" />
        <rect x="25" y="6" width="14" height="4" rx="2" fill="#CA8A04" />
        <line x1="15" y1="28" x2="49" y2="28" stroke="#A16207" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="32" cy="44" r="7" stroke="#451A03" strokeWidth="2" />
        <circle cx="32" cy="39.5" r="2.5" fill="#451A03" />
        <circle cx="28" cy="46.5" r="2.5" fill="#451A03" />
        <circle cx="36" cy="46.5" r="2.5" fill="#451A03" />
      </svg>
    );
  }

  if (bin === 'red') {
    return (
      <svg viewBox="0 0 64 72" fill="none" className={className} aria-hidden="true">
        <rect x="12" y="14" width="40" height="50" rx="5" fill="#FECACA" stroke="#DC2626" strokeWidth="2.5" />
        <path d="M9 14C9 11.7909 10.7909 10 13 10H51C53.2091 10 55 11.7909 55 14V18H9V14Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <rect x="25" y="6" width="14" height="4" rx="2" fill="#DC2626" />
        <line x1="15" y1="28" x2="49" y2="28" stroke="#991B1B" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M32 36L38 44H26L32 36Z" stroke="#7F1D1D" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 47H40" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (bin === 'white') {
    return (
      <svg viewBox="0 0 64 72" fill="none" className={className} aria-hidden="true">
        <rect x="13" y="16" width="38" height="48" rx="6" fill="#F1F5F9" fillOpacity="0.88" stroke="#0891B2" strokeWidth="2.5" />
        <path d="M10 15C10 12.2386 12.2386 10 15 10H49C51.7614 10 54 12.2386 54 15V20H10V15Z" fill="#E2E8F0" stroke="#0891B2" strokeWidth="2" />
        <rect x="22" y="13.5" width="20" height="3.5" rx="1.75" fill="#0F172A" />
        <line x1="16" y1="30" x2="48" y2="30" stroke="#0891B2" strokeWidth="1.75" strokeDasharray="4 2" />
        <path d="M38 38L26 50M38 38L41 35M26 50L23 53" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 40L36 44" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (bin === 'blue') {
    return (
      <svg viewBox="0 0 64 72" fill="none" className={className} aria-hidden="true">
        <rect x="12" y="14" width="40" height="50" rx="5" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
        <path d="M9 14C9 11.7909 10.7909 10 13 10H51C53.2091 10 55 11.7909 55 14V18H9V14Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
        <rect x="25" y="6" width="14" height="4" rx="2" fill="#2563EB" />
        <line x1="15" y1="28" x2="49" y2="28" stroke="#1E40AF" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="27" y="39" width="10" height="14" rx="2" stroke="#1E3A8A" strokeWidth="2" fill="#EFF6FF" />
        <rect x="29" y="35" width="6" height="4" rx="1" fill="#1E3A8A" />
      </svg>
    );
  }

  // General Waste: Dual Black / Green Municipal Bin
  return (
    <svg viewBox="0 0 64 72" fill="none" className={className} aria-hidden="true">
      {/* Left half Black, Right half Green */}
      <path d="M12 18H32V64H17C14.2386 64 12 61.7614 12 59V18Z" fill="#334155" />
      <path d="M32 18H52V59C52 61.7614 49.7614 64 47 64H32V18Z" fill="#16A34A" />
      <rect x="12" y="14" width="40" height="50" rx="5" stroke="#0F172A" strokeWidth="2.5" />
      <path d="M9 14C9 11.7909 10.7909 10 13 10H32V18H9V14Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <path d="M32 10H51C53.2091 10 55 11.7909 55 14V18H32V10Z" fill="#15803D" stroke="#0F172A" strokeWidth="2" />
      <rect x="25" y="6" width="14" height="4" rx="2" fill="#0F172A" />
      {/* Leaf / Recycle emblem */}
      <circle cx="32" cy="42" r="8" fill="#FFFFFF" fillOpacity="0.92" />
      <path d="M28 45C28 40 31.5 37 36 37C36 41.5 33 45 28 45Z" fill="#15803D" />
    </svg>
  );
};

export const SpecimenIllustration: React.FC<{
  type: SpecimenType;
  className?: string;
}> = ({ type, className = 'w-20 h-20' }) => {
  switch (type) {
    case 'gauze':
    case 'anatomical':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="14" y="18" width="52" height="44" rx="8" fill="#FFFBEB" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M20 28H60M20 40H60M20 52H60M28 22V58M40 22V58M52 22V58" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M30 31C35 27 45 29 48 36C51 43 44 51 35 49C27 47 25 35 30 31Z" fill="#DC2626" fillOpacity="0.82" />
          <circle cx="48" cy="48" r="5" fill="#991B1B" fillOpacity="0.7" />
        </svg>
      );
    case 'iv-tubing':
    case 'catheter':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="18" y="12" width="24" height="34" rx="6" fill="#EFF6FF" stroke="#0284C7" strokeWidth="2" />
          <path d="M18 24H42" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M30 46V56C30 62 38 66 46 66H56C61 66 64 62 64 56V32" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <rect x="59" y="24" width="10" height="10" rx="2" fill="#DC2626" fillOpacity="0.85" />
        </svg>
      );
    case 'needle-syringe':
    case 'scalpel':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M52 14L66 28" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 26L54 40L32 62L18 48L40 26Z" fill="#F1F5F9" stroke="#0F172A" strokeWidth="2" />
          <path d="M59 21L47 33" stroke="#0891B2" strokeWidth="2.5" />
          <path d="M25 55L13 67" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="34" y1="36" x2="39" y2="41" stroke="#64748B" strokeWidth="1.75" />
          <line x1="29" y1="41" x2="34" y2="46" stroke="#64748B" strokeWidth="1.75" />
        </svg>
      );
    case 'glass-vial':
    case 'broken-ampoule':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="27" y="26" width="26" height="38" rx="4" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.2" />
          <path d="M32 26V18H48V26" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" />
          <rect x="30" y="13" width="20" height="5" rx="1.5" fill="#1D4ED8" />
          <path d="M31 44L41 38L49 48" stroke="#1E40AF" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="32" y="34" width="16" height="18" rx="1" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1" />
        </svg>
      );
    case 'cytotoxic-vial':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="26" y="26" width="28" height="38" rx="4" fill="#FEFCE8" stroke="#CA8A04" strokeWidth="2.2" />
          <rect x="30" y="14" width="20" height="6" rx="1.5" fill="#A16207" />
          <path d="M32 26V20H48V26" stroke="#CA8A04" strokeWidth="2" fill="#FEF08A" />
          <polygon points="40,34 48,48 32,48" fill="#EAB308" stroke="#451A03" strokeWidth="1.75" />
          <line x1="40" y1="39" x2="40" y2="44" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'culture-plate':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="24" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" />
          <circle cx="40" cy="40" r="20" fill="#FDE68A" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="33" cy="34" r="3" fill="#B45309" />
          <circle cx="46" cy="37" r="2.5" fill="#B45309" />
          <circle cx="38" cy="47" r="3.5" fill="#92400E" />
          <path d="M28 43C33 41 37 42 42 40" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'gloves':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M26 62V36C26 33 29 33 30 36V22C30 19 34 19 34 22V34M34 20C34 17 39 17 39 20V34M39 22C39 19 44 19 44 22V36M44 27C44 24 49 24 49 27V44L53 40C56 38 59 41 56 44L47 58V62H26Z"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="46" r="3" fill="#DC2626" fillOpacity="0.7" />
        </svg>
      );
    case 'paper-packaging':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="16" y="20" width="48" height="40" rx="4" fill="#F8FAFC" stroke="#475569" strokeWidth="2" />
          <path d="M16 32H64" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="24" y="38" width="24" height="4" rx="2" fill="#94A3B8" />
          <rect x="24" y="46" width="16" height="4" rx="2" fill="#CBD5E1" />
        </svg>
      );
    case 'food-waste':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="42" r="22" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
          <path d="M30 48C30 37 38 30 49 30C49 41 42 48 30 48Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.75" />
          <path d="M28 50L38 40" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'water-bottle':
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="29" y="24" width="22" height="40" rx="5" fill="#F1F5F9" stroke="#334155" strokeWidth="2" />
          <rect x="33" y="15" width="14" height="9" rx="2" fill="#E2E8F0" stroke="#334155" strokeWidth="2" />
          <rect x="35" y="11" width="10" height="4" rx="1" fill="#16A34A" />
          <line x1="29" y1="38" x2="51" y2="38" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="29" y1="48" x2="51" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      );
    case 'implant':
    default:
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="33" y="14" width="14" height="52" rx="7" fill="#E2E8F0" stroke="#334155" strokeWidth="2.2" />
          <circle cx="40" cy="24" r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.75" />
          <circle cx="40" cy="35" r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.75" />
          <circle cx="40" cy="46" r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.75" />
          <circle cx="40" cy="57" r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.75" />
        </svg>
      );
  }
};

export const CertifiedSeal: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <circle cx="48" cy="48" r="42" fill="#F5F3FF" stroke="#6D28D9" strokeWidth="2.5" />
    <circle cx="48" cy="48" r="35" stroke="#6D28D9" strokeWidth="1.25" strokeDasharray="3 3" />
    <path d="M48 22L54 35L68 37L58 47L60 61L48 54L36 61L38 47L28 37L42 35L48 22Z" fill="#6D28D9" fillOpacity="0.14" stroke="#4C1D95" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M39 48L45 54L58 41" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
