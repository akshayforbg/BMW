---
name: Clinical BioClean
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#545c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c748b'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.35'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Source Sans 3
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.45'
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: 0.02em
  label-md:
    fontFamily: Manrope
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.03em
  code-clinical:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers an authoritative, clinical, and tactile educational platform for Biomedical Waste Management Training and Certification, authored by Dr. Akshaya N Shetti. The interface must communicate surgical precision, regulatory compliance, and immediate cognitive clarity under high-pressure healthcare scenarios. 

The aesthetic is **Clinical Precision with Tactile Realism**:
- **Pristine Medical Atmosphere:** Crisp hospital-grade clarity built upon an aseptic white foundation, evoking hygiene, composure, and institutional rigor.
- **Regulatory Fidelity:** Direct, uncompromised representation of statutory waste segregation standards (Yellow, Red, White Puncture-Proof, Blue) calibrated strictly to official Indian Biomedical Waste Management (BMWM) protocols.
- **Cognitive Ergonomics:** High-legibility typography, clear spatial delineation, and unambiguous interactive feedback tailored for busy healthcare workers, residents, nursing staff, and laboratory technicians navigating modules on desktop stations or ward mobile devices.

## Colors

The palette is engineered to balance surgical calm with strict operational compliance:

- **Clinical Base:**
  - Pristine Canvas: `#F8FAFC` (Slate 50) serves as the primary ground, preventing visual fatigue compared to pure harsh white while preserving an aseptic environment.
  - Surface Raised: `#FFFFFF` for primary cards, modules, and diagnostic test elements.
  - Text Primary: `#0F172A` (Slate 900) ensures AAA contrast across all instructive copy.
  - Text Secondary: `#475569` (Slate 600) for metadata, module durations, and helper notes.

- **Primary & Interactive Accents:**
  - Clinical Teal (`#0D9488`): Primary action items, interactive progress meters, module navigation, and verified credentials.
  - Clinical Blue (`#0284C7`): Secondary interactive states, hyperlinked references, protocol guidance callouts, and clinical annotations.

- **Standard Indian BMWM Regulatory Palette:**
  - **Yellow Waste Category (`#EAB308` / `#CA8A04`):** Anatomical waste, soiled dressings, expired medicine, chemical waste. Always paired with dark text (`#451A03` or `#0F172A`) for absolute legibility.
  - **Red Waste Category (`#DC2626` / `#EF4444`):** Contaminated recyclable plastics (catheters, IV bottles, tubing, syringes without needles).
  - **White Puncture-Proof Category (`#F1F5F9` / `#94A3B8` with sharp cyan edge `#0891B2`):** Sharps, scalpels, needles, blades. Visualized with crisp translucent borders to convey hardened polypropylene puncture resistance.
  - **Blue Waste Category (`#2563EB` / `#3B82F6`):** Glassware, ampoules, metallic body implants.

- **Diagnostic Feedback:**
  - Correct / Certified: Emerald (`#059669` / `#10B981`)
  - Critical Bio-Hazard / Incorrect Sort: Crimson (`#E11D48` / `#BE123C`)

## Typography

The typographic hierarchy blends structured medical legibility with high-speed recognition:

- **Headlines (Manrope):** Geometric yet friendly, with balanced proportions that give clinical certifications, module titles, and protocol steps stature without visual fatigue.
- **Body & Training Modules (Source Sans 3):** Chosen for its exceptional open counters, tall x-height, and neutral character, ensuring sustained reading comfort during long certification study sessions and rapid comprehension on mobile devices.
- **Regulatory Codes, Bin Identifiers & Timers (JetBrains Mono):** Monospaced precision for statutory waste treatment codes (e.g., `BMWM-SCH-I`, `CBMWTF-AUTOCLAVE`), incubation times, test timers, and certification serial IDs.

## Layout & Spacing

The layout is structured around an 8-point spatial system embedded within a responsive fluid grid:

- **Grid Architecture:**
  - **Desktop (1024px+):** 12-column layout with `2.5rem` margins and `1.5rem` gutters. Maximum content reading containers capped at `72ch` to maintain medical text comprehension.
  - **Tablet (768px - 1023px):** 8-column layout with `1.5rem` margins and `1rem` gutters.
  - **Mobile (<768px):** 4-column layout with `1rem` margins and `0.75rem` gutters. Interactive sorting targets maintain a minimum vertical touch height of `48px` with at least `0.5rem` separation.

- **Educational Dashboards & Quizzes:** Dual-pane layout on desktop (module content / active segregation drag-and-drop workspace) collapsing into a stacked linear workflow with bottom-sheet verification controls on mobile.

## Elevation & Depth

Visual hierarchy reflects the sterile, layered feel of a pristine healthcare facility:

- **Surface Stratification:**
  - Level 0 (Canvas): Background `#F8FAFC`.
  - Level 1 (Static Panels): `#FFFFFF` bounded by an ultra-fine border (`1px solid #E2E8F0`).
  - Level 2 (Interactive Cards / Segregation Bins): `#FFFFFF` elevated with an ambient clinical shadow (`0 4px 12px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)`) and tinted borders reflecting bin categories.
  - Level 3 (Active Modals, Draggable Items, Certification Badges): `#FFFFFF` elevated with distinct depth (`0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)`).

- **Sharps & Puncture-Proof Translucency:** White puncture-proof sharps containers utilize a frosted acrylic treatment (`backdrop-filter: blur(8px)`, `background: rgba(255, 255, 255, 0.85)`, border: `1.5px solid #0891B2`) to realistically simulate dense translucent plastics.

## Shapes

This design system employs an intentional **Rounded (Level 2)** geometry:
- Standard interactive elements (buttons, inputs, regular cards) utilize an `8px` (`0.5rem`) radius, balancing precision with approachable tactility.
- Interactive waste bins and segregation modules feature `16px` (`1rem`) radii on outer bounds, paired with sculpted receptacles mimicking real-world autoclaving and puncture-proof disposal units.
- Badges, status pills, and regulatory code tags use fully rounded caps (`9999px`) to distinguish categorical indicators from actionable buttons.

## Components

- **Buttons:**
  - *Primary Button:* Solid clinical teal (`#0D9488`), crisp white text, bold weight (`600`), 8px border radius, subtle hover elevation.
  - *Secondary Button:* Outlined teal (`1.5px solid #0D9488`) on white or transparent background.
  - *Safety Action (Emergency Stop / Hazardous Override):* Solid crimson (`#DC2626`).

- **Waste Bin Selection Cards (Interactive Core):**
  - Tactile physical cards designed to train muscle memory for segregation.
  - *Yellow Card:* Gold-accented border (`2px solid #CA8A04`), subtle soft amber wash (`#FEFCE8`), dark icon/symbol.
  - *Red Card:* Red-accented border (`2px solid #DC2626`), soft rose wash (`#FEF2F2`).
  - *White Puncture-Proof Card:* Rigid slate-cyan border (`2px solid #0891B2`), frosted translucent body with needle/sharp containment glyph.
  - *Blue Card:* Cobalt border (`2px solid #2563EB`), soft sky wash (`#EFF6FF`).

- **Quiz & Simulation Drag-and-Drop Slots:**
  - Dotted guide targets with bin-color matched outlines.
  - Success drop triggers an immediate emerald ripple (`#10B981`) and haptic confirmation; mismatch triggers a firm crimson shake with immediate explanatory regulatory citation authored by Dr. Shetti.

- **Input Fields:**
  - Background `#FFFFFF`, border `1.5px solid #CBD5E1`, text `#0F172A`.
  - Focus state: Clinical teal ring (`#0D9488`) with 3px soft focus spread (`rgba(13, 148, 136, 0.15)`).

- **Certification Credential Badge:**
  - High-tier certificate card with an engraved teal seal, verified practitioner metadata in `JetBrains Mono`, and Dr. Akshaya N Shetti signature line with micro-hologram graphic gradient.