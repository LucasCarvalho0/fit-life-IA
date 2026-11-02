---
name: FitLife AI
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#06bb56'
  on-tertiary-container: '#00431a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Lexend
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-display:
    fontFamily: Lexend
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system delivers a high-performance, athletic dark mode aesthetic tailored for serious strength training, precision metabolic tracking, and real-time biometric intelligence. Rooted in modern performance athletic platforms (such as Whoop and Apple Fitness+), the visual presentation strikes a balance between surgical data precision and kinetic motivational drive.

### Brand Personality & Emotional Impact
- **Hyper-Focused & Athletic:** Deep charcoal surfaces eliminate visual fatigue and peripheral distractions, directing maximum focus toward workout execution, reps, and biometric pacing.
- **Empowered by Intelligence:** Dynamic visual cues clearly demarcate AI-driven adaptive recommendations from raw workout logging.
- **Precision Engineering:** Clean metric callouts, legible data matrices, and responsive interactive feedback evoke a premium diagnostic experience.

### Visual Aesthetic
The interface pairs a deep, multi-tiered dark slate architecture with high-visibility athletic accents. Tactile cards utilize subtle micro-borders, deep ambient shadows, and selective luminance shifts rather than heavy solid strokes, providing an elevated sense of dimensional depth and tactile response on mobile OLED screens.

## Colors

The palette operates in strict dark mode, built for maximum contrast and high visibility in low-light gym floors and outdoor training conditions.

### Palette Architecture
- **Primary (`#10B981` - Emerald Energy):** The core kinetic signal. Used for primary CTAs, completion markers, active set highlights, and vital biometric thresholds.
- **Secondary (`#6366F1` - Electric AI Indigo):** Reserved for adaptive algorithmic features, auto-regulation adjustments, recovery calculations, and smart coach dialogs.
- **Tertiary (`#22C55E` - Kinetic Green):** Supporting performance hue used for positive progression deltas, streak markers, and macro targets.
- **Neutral Core (`#0B0F17` to `#1E293B`):**
  - `Canvas Base`: `#0B0F17` (True deep slate ground)
  - `Surface Level 1`: `#111827` (Card containers, grouped workout cards)
  - `Surface Level 2`: `#1E293B` (Elevated modules, inputs, active sheets)
  - `Surface Level 3`: `#334155` (Hover states, segmented control tracks)

### Functional Feedback
- **Text & Foreground:** `#F8FAFC` (100% primary data), `#94A3B8` (secondary metadata and labels), `#64748B` (disabled/tertiary hints).
- **Critical / Failure Alert:** `#EF4444` (failed sets, strain over-index, macro overflow).
- **Warning:** `#F59E0B` (approaching failure, hydration reminders).

## Typography

The typographic hierarchy combines the athletic geometry of **Lexend** with the neutral, clean legibility of **Inter**.

- **Lexend (Headlines, Displays, Numerical Readouts):** Provides rapid legibility during physical exertion. Its open counters and geometric structure make metrics (heart rate, RPE, load, reps) legible at arm's length or while moving.
- **Inter (Body, Micro-copy, Form Labels):** Delivers neutral, unadorned structural clarity across dense workout logs, macronutrient breakdowns, and conversational AI coaching insights.
- **Tabular Numerals (`tnum`):** Enforce monospace numeric alignment across all weight, rep, rest timer, and caloric counters to prevent visual jitter when values update in real-time.

## Layout & Spacing

This design system uses a 4px/8px incremental rhythm structured around a fluid mobile-first column paradigm.

### Layout Rules
- **Mobile Grid (320px - 599px):** 4 fluid columns with `margin-mobile` (16px) and `gutter-mobile` (12px). Interactive targets maintain a strict minimum bounding box of 44x44px.
- **Tablet / Split View (600px - 1023px):** 8 fluid columns with 24px outer margins and 16px gutters, allowing parallel views of the active set logger and real-time cardiac or nutritional telemetry.
- **Desktop Dashboard (1024px+):** 12 columns constrained to a max reading container of 1280px, centered with automatic margins.

### Vertical Rhythm
- **Micro-grouping (`space-xs` to `space-sm`):** Links metric values to units (`120` + `kg`, `180` + `bpm`).
- **Component internal padding (`space-md` to `space-lg`):** Governs workout card interiors, input rows, and bottom-sheet controls.
- **Section boundaries (`space-xl` to `space-2xl`):** Separates distinct workout segments (Warm-up vs. Main Lifts vs. Post-Workout Cooldown).

## Elevation & Depth

To preserve an immersive athletic dark aesthetic, this design system avoids harsh dropshadows. Depth is articulated through **tonal layering**, **selective ambient glows**, and **low-contrast micro-outlines**.

### Elevation Scale
- **Ground (`#0B0F17`):** The foundational viewport substrate. Contains zero elevation effects.
- **Level 1 (Card & Section Containers - `#111827`):** Raised with a 1px inner stroke `rgba(255, 255, 255, 0.05)` and subtle bottom-weighted ambient shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`.
- **Level 2 (Active Exercise Blocks, Sheets & Modals - `#1E293B`):** Uses an outer glow tinted to the component context:
  - Standard Action: `0 8px 30px rgba(0, 0, 0, 0.7)` with stroke `rgba(255, 255, 255, 0.08)`.
  - Active Record / AI Insight: `0 8px 24px -4px rgba(99, 102, 241, 0.2)` with a 1px border of `rgba(99, 102, 241, 0.3)`.
- **Level 3 (Floating HUD, Quick-Add Floating Bar):** High-blur glassmorphism backdrop (`backdrop-filter: blur(16px)`), background `rgba(17, 24, 39, 0.85)`, and border `rgba(255, 255, 255, 0.12)`.

## Shapes

The shape system leverages balanced, ergonomic curvature (level `2`) that provides an intentional balance between tactical performance and athletic fluidity.

### Corner Radius Mapping
- **Default Shape Radius (`rounded-md`, 0.5rem / 8px):** Standard table rows, dense exercise log cells, chips, and micro-badges.
- **Card & Surface Containers (`rounded-lg`, 1rem / 16px):** Exercise module cards, macro ring cards, and nutritional summary banners.
- **Overlays & Elevated Surfaces (`rounded-xl`, 1.5rem / 24px):** Bottom sheets, modal dialogues, workout finish summaries, and primary hero cards.
- **Full Pill (`rounded-full`, 9999px):** Active state indicators, play/pause timers, floating pills, and primary thumb controls.

## Components

### Buttons
- **Primary Athletic Button:** High-contrast solid fill with `#10B981`, text `#0B0F17` (Lexend, SemiBold). Subtle gradient overlay (`rgba(255, 255, 255, 0.15)` top-to-bottom). Includes an active-state scale bounce down to `0.98` for tactile feedback under thumb touch.
- **AI Recommendation Button:** Electric Indigo fill (`#6366F1`) with text `#FFFFFF` and a subtle 2px blurred ambient back-glow. Used exclusively for smart suggestions (e.g., "Auto-Adjust Set Weight", "Regenerate Meal Plan").
- **Secondary Ghost Action:** Background `rgba(30, 41, 59, 0.6)`, text `#F8FAFC`, border 1px `rgba(255, 255, 255, 0.08)`. Focus states elevate the border to `#10B981`.

### Data Badges & Chips
- **Status & Rest Badges:** Compact pills with semi-translucent fills (`rgba(16, 185, 129, 0.12)`) and contrasting primary foreground text (`#10B981`).
- **AI Telemetry Pill:** Bordered in `rgba(99, 102, 241, 0.4)` with an inline sparkle icon, micro-gradient background blending from `#1E293B` to `rgba(99, 102, 241, 0.15)`.

### Cards & Workout Modules
- **Exercise Set Logger:** Encased in `#111827` with 16px corner radius. Completed sets dim slightly with green check badges; active sets elevate with a `#1E293B` surface and a left-accent rail colored in `#10B981`.
- **Macro Target Cards:** Segmented circular progress rings or linear track gauges displaying target vs. consumed amounts. Track background is `#1E293B`; progress stroke is driven by `#10B981` (Proteins), `#6366F1` (Carbs), and `#F59E0B` (Fats).

### Form Inputs & Set Number Pickers
- **Tactile Stepper & Keypads:** Dark surface `#1E293B` with 8px radius. Inputs feature oversized numerical readouts in Lexend with clear visual tap targets for increment/decrement icons.
- **Text Inputs:** Neutral dark slate background `#111827`, border `rgba(255, 255, 255, 0.08)`, transitioning on focus to an active border of `#10B981` with an inner 2px shadow ring.

### Lists & Activity Feeds
- **Rep & Set Rows:** Borderless separated items utilizing alternating slight opacity shifts or hair-thin dividers `rgba(255, 255, 255, 0.04)`.
- **Swipeable Quick-Actions:** Left-swipe reveals set duplication (indigo) or set deletion (crimson red), paired with native haptic pulses.

### AI Floating Coach Hub
- **Adaptive HUD:** Floats at the bottom boundary of the safe area. Houses real-time rest timers, heart rate zone monitoring, and adaptive weight-adjustment prompts. Encapsulated in high-blur translucent glass (`rgba(17, 24, 39, 0.88)`).