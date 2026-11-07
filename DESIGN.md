---
version: alpha
name: Gre
description: |
  The University of Greenwich design system embodies institutional authority
  tempered with modern accessibility. Built on a foundation of deep navy
  foundations (#000033) paired with a vibrant primary blue (#0058AA), the system
  evokes academic gravitas while maintaining contemporary clarity. The
  typography balances two distinct typeface families—CooperHewitt for display
  moments and Public Sans for body text—creating a hierarchy that progresses
  from bold, tight-spaced headlines to readable, generous body composition. The
  palette is notably restrained: neutrals dominate the canvas, with colour
  deployed strategically for navigation, calls-to-action, and section
  differentiation. Whitespace is generous and disciplined, reflecting
  institutional confidence. The overall effect is serious yet inviting—a system
  designed for diverse audiences navigating complex educational content.
source:
  url: "https://www.gre.ac.uk/"
  pagesAnalyzed: 6
  extractedAt: 2026-11-07
  tokensMeasured: true
colors:
  primary: "#0058AA"
  link: "#00033D"
  canvas: "#FFFFFF"
  surface-alt: "#2E2E2E"
  on-primary: "#FFFFFF"
  ink: "#000000"
  body: "#0A0A0A"
  muted: "#2E2E2E"
  hairline: "#DDDBDD"
  accent-1: "#89E9D7"
  neutral-1: "#E5E5E5"
  neutral-2: "#808080"
  neutral-3: "#CBC9CC"
typography:
  display-xl:
    fontFamily: CooperHewitt
    fontSize: 80px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  display-lg:
    fontFamily: CooperHewitt
    fontSize: 76.8px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.8px
  display-md:
    fontFamily: CooperHewitt
    fontSize: 54.4px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.8px
  display-sm:
    fontFamily: CooperHewitt
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0px
  display-xs:
    fontFamily: CooperHewitt
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  heading-xxl:
    fontFamily: "Public Sans"
    fontSize: 33px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  heading-xl:
    fontFamily: "Public Sans"
    fontSize: 28.8px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  heading-lg:
    fontFamily: "Public Sans"
    fontSize: 25px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  heading-md:
    fontFamily: "Public Sans"
    fontSize: 20.96px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  heading-sm:
    fontFamily: "Public Sans"
    fontSize: 20.8px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  heading-xs:
    fontFamily: "Public Sans"
    fontSize: 17.6px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  body-lg:
    fontFamily: "Public Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-lg-tight:
    fontFamily: "Public Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0px
  body-lg-strong:
    fontFamily: "Public Sans"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: 0px
  body-md:
    fontFamily: "Public Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-sm:
    fontFamily: "Public Sans"
    fontSize: 12.96px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  body-xs:
    fontFamily: "Public Sans"
    fontSize: 12.8px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  button-xl:
    fontFamily: "Public Sans"
    fontSize: 21.28px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0px
  button-lg:
    fontFamily: CooperHewitt
    fontSize: 17.6px
    fontWeight: 400
    lineHeight: 2.55
    letterSpacing: 0px
  label-md:
    fontFamily: "Public Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 2.8
    letterSpacing: 0px
  label-sm:
    fontFamily: "Public Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0px
  caption:
    fontFamily: "Public Sans"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0px
rounded:
  none: 0px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 28px
  xxxl: 32px
  section: 36px
  band: 64px
borderWidths:
  thin: 1px
shadows:
  sm: "rgba(0, 0, 0, 0.15) 0px 9px 9px 0px, rgba(0, 0, 0, 0.1) 0px 4.5px 4.5px 0px"
elevationStrategy: single-tier
themes:
  derived: dark   # the other theme is the site's measured palette
  light:
    bg: "#FFFFFF"
    surface: "#2E2E2E"
    surfaceRaised: "#2C2C2C"
    text: "#000000"
    textMuted: "#0A0A0A"
    border: "#DDDBDD"
    accent: "#0058AA"
    accentFg: "#FFFFFF"
    focusRing: "#0058AA"
    elevation: shadow
  dark:
    bg: "#0A1015"
    surface: "#191E23"
    surfaceRaised: "#252A2F"
    text: "#F5F8FC"
    textMuted: "#9CA0A4"
    border: "#31363A"
    accent: "#0082FC"
    accentFg: "#0B0B0C"
    focusRing: "#0063BE"
    elevation: "border+surface"
  contrastFailures:
    - "light: text on surface = 1.55:1 (needs 4.5:1)"
components:
  button-primary:
    typography: "{typography.button-lg}"
    textColor: "{colors.on-primary}"
    border: "1px solid {colors.primary}"
    height: 48px
    padding: "0px 8px 0px 8px"
    backgroundColor: "{colors.primary}"
  button-primary-sm:
    textColor: "{colors.on-primary}"
    border: "1px solid {colors.canvas}"
    height: 40px
    padding: "0px 15px 0px 15px"
    fontSize: 17.6px
    fontFamily: CooperHewitt
    fontWeight: 400
    lineHeight: 2.27
    rounded: 48px
    backgroundColor: "{colors.primary}"
  button-filled:
    typography: "{typography.caption}"
    textColor: "{colors.on-primary}"
    height: 34.375px
    padding: "11.2px 16px 11.2px 16px"
    backgroundColor: "rgb(37, 127, 160)"
  button-icon:
    textColor: "{colors.on-primary}"
    height: 48px
    padding: "0px 7.5px 0px 7.5px"
    fontSize: 30.4px
    fontFamily: "Public Sans"
    fontWeight: 400
    lineHeight: 1.58
  navigation:
    textColor: "{colors.ink}"
    height: 34.375px
    fontSize: 12px
    fontFamily: "Public Sans"
    fontWeight: 400
    lineHeight: 1.5
    backgroundColor: "{colors.neutral-3}"
  footer:
    textColor: "{colors.on-primary}"
    padding: "0px 0px 140px 0px"
    fontSize: 16px
    fontFamily: "Public Sans"
    fontWeight: 400
    lineHeight: 1.5
    backgroundColor: "{colors.surface-alt}"
  link:
    textColor: "{colors.ink}"
    padding: "15px 15px 15px 15px"
    fontSize: 19.2px
    fontFamily: "Public Sans"
    fontWeight: 400
    lineHeight: 1.5
    rounded: "8px 8px 0px 0px"
    backgroundColor: "rgb(238, 237, 238)"
  link-lg:
    textColor: "{colors.muted}"
    fontSize: 16px
    fontFamily: "Public Sans"
    fontWeight: 400
    lineHeight: 1.5
    backgroundColor: "{colors.canvas}"
states:
  other-focus:
    target: other
    state: focus
    outline: none
  input-focus:
    target: input
    state: focus
    outline: none
    boxShadow: "{colors.primary} 0px 0px 5px"
    borderColor: "{colors.primary}"
    borderWidth: 1px
    backgroundColor: "rgb(254, 254, 254)"
  input-disabled:
    target: input
    state: disabled
    backgroundColor: "{colors.hairline}"
  link-hover:
    target: link
    state: hover
    textColor: "rgb(0, 117, 227)"
  button-hover:
    target: button
    state: hover
    textColor: "rgb(254, 254, 254)"
    backgroundColor: "rgb(23, 121, 186)"
  other-hover:
    target: other
    state: hover
    backgroundColor: "rgb(20, 103, 158)"
  link-focus:
    target: link
    state: focus
    textColor: "rgb(23, 121, 186)"
    backgroundColor: "{colors.canvas}"
  nav-hover:
    target: nav
    state: hover
    boxShadow: "{colors.neutral-3} 0px 7px 0px, {colors.neutral-3} 0px 14px 0px"
    backgroundColor: "{colors.neutral-3}"
  card-hover:
    target: card
    state: hover
    borderColor: currentcolor
  other-disabled:
    target: other
    state: disabled
    opacity: 0.8
  button-active:
    target: button
    state: active
    textColor: "{colors.on-primary}"
    borderColor: "rgba(162, 192, 169, 0.5)"
    borderWidth: 1px
    backgroundColor: "rgb(44, 100, 21)"
  link-focus-visible:
    target: link
    state: focus-visible
    outline: "{colors.ink} solid 2px"
    outlineColor: "{colors.ink}"
    outlineWidth: 2px
  button-focus:
    target: button
    state: focus
    outline: "{colors.ink} solid 2px"
    outlineColor: "{colors.ink}"
    outlineWidth: 2px
breakpoints:
  - width: 375
    containerWidth: 355
    gridColumns: 3
    navLinksVisible: 3
    menuToggleVisible: true
    headingPx: 36
    bodyPx: 16
    sectionPaddingX: 15
  - width: 768
    containerWidth: 738
    gridColumns: 3
    navLinksVisible: 3
    menuToggleVisible: true
    headingPx: 48
    bodyPx: 16
    sectionPaddingX: 15
  - width: 1024
    containerWidth: 994
    gridColumns: 7
    navLinksVisible: 10
    menuToggleVisible: true
    headingPx: 80
    bodyPx: 16
    sectionPaddingX: 15
  - width: 1280
    containerWidth: 1250
    gridColumns: 7
    navLinksVisible: 10
    menuToggleVisible: true
    headingPx: 80
    bodyPx: 16
    sectionPaddingX: 15
  - width: 1440
    containerWidth: 1410
    gridColumns: 7
    navLinksVisible: 10
    menuToggleVisible: true
    headingPx: 80
    bodyPx: 16
    sectionPaddingX: 15
coverage:
  statesFound: 81
  gradientsFound: 0
  rolesUnassigned: 4
  archetypesUnnamed: 0
  archetypesDetected: 0
  responsiveMeasured: true
  stylesheetsBlocked: false
  semanticRampDeclared: false
---

# Design System Inspired by University of Greenwich

## 1. Visual Theme & Atmosphere

The University of Greenwich design system embodies institutional authority tempered with modern accessibility. Built on a foundation of deep navy foundations (`#000033`) paired with a vibrant primary blue (`#0058AA`), the system evokes academic gravitas while maintaining contemporary clarity. The typography balances two distinct typeface families—CooperHewitt for display moments and Public Sans for body text—creating a hierarchy that progresses from bold, tight-spaced headlines to readable, generous body composition. The palette is notably restrained: neutrals dominate the canvas, with colour deployed strategically for navigation, calls-to-action, and section differentiation. Whitespace is generous and disciplined, reflecting institutional confidence. The overall effect is serious yet inviting—a system designed for diverse audiences navigating complex educational content.

**Key Characteristics**

- Two-typeface system: distinctive serif-like display (CooperHewitt) for headlines; humanist sans-serif (Public Sans) for body and UI
- Primary blue accent (`{colors.primary}` — `#0058AA`) used consistently for CTAs and interactive states
- Neutral-forward palette with minimal semantic colour (no error/success ramps)
- Sharp corners on components paired with pill-shaped buttons in primary contexts
- Generous spacing and whitespace, with section padding consistent across breakpoints
- Link colour (`#00033D`) is notably dark, ensuring hierarchy over accent blue
- Single-shadow elevation system for subtle depth on dropdowns only
- Restrained use of mid-tone neutrals (`{colors.surface-alt}` — `#2E2E2E`) for alternating bands and captions

## 2. Color Palette & Roles

### Primary

- **Primary** (`{colors.primary}` — `#0058AA`): Primary CTAs, brand accent, active link states, and hero bands. Primary button fills and focus ring colour. Core interaction signal across all surfaces.

### Interactive

- **Link** (`{colors.link}` — `#00033D`): Inline hyperlinks and link text. Much darker than primary, establishing clear hierarchy.

### Neutral Scale

- **Canvas** (`{colors.canvas}` — `#FFFFFF`): Default page background and card surfaces. Label and text colour on dark brand surfaces.
- **Ink** (`{colors.ink}` — `#000000`): Primary heading and text colour; highest contrast.
- **Body** (`{colors.body}` — `#0A0A0A`): Body copy text; near-black for readability.
- **Surface Alt** (`{colors.surface-alt}` — `#2E2E2E`): Alternating section backgrounds; secondary text and captions. Mid-tone neutral for visual rhythm.
- **Hairline** (`{colors.hairline}` — `#DDDBDD`): 1px borders and dividers; subtle, non-intrusive.
- **Neutral 1** (`{colors.neutral-1}` — `#E5E5E5`): Neutral surface (role unassigned by extraction; treat as secondary surface).
- **Neutral 2** (`{colors.neutral-2}` — `#808080`): Neutral mid-tone (role unassigned; decorative or disabled text).
- **Neutral 3** (`{colors.neutral-3}` — `#CBC9CC`): Neutral light tone (role unassigned; decorative).

### Accent / Decorative

- **Accent 1** (`{colors.accent-1}` — `#89E9D7`): Decorative accent; no measured semantic role. Use sparingly for visual flourish or secondary highlights.

## 3. Typography Rules

### Font Family

**Primary (Display & Headings):** CooperHewitt, Georgia, serif  
**Secondary (Body & UI):** Public Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display XL | CooperHewitt | 80px | 700 | 1.4 | -0.8px | Hero / page title; tight tracking |
| Display LG | CooperHewitt | 76.8px | 700 | 1.1 | -0.8px | Large hero headline; condensed line height |
| Display MD | CooperHewitt | 54.4px | 700 | 1.1 | -0.8px | Mid-sized display; tight spacing |
| Display SM | CooperHewitt | 48px | 700 | 1.2 | 0px | Secondary display; standard tracking |
| Display XS | CooperHewitt | 40px | 700 | 1.4 | 0px | Tertiary display heading |
| Heading XXL | Public Sans | 33px | 700 | 1.4 | 0px | Extra-large section heading |
| Heading XL | Public Sans | 28.8px | 400 | 1.6 | 0px | Large heading; lighter weight |
| Heading LG | Public Sans | 25px | 700 | 1.4 | 0px | Large section heading |
| Heading MD | Public Sans | 20.96px | 700 | 1.4 | 0px | Medium heading |
| Heading SM | Public Sans | 20.8px | 700 | 1.4 | 0px | Small heading |
| Heading XS | Public Sans | 17.6px | 700 | 1.4 | 0px | Extra-small heading |
| Button XL | CooperHewitt | 21.28px | 700 | 1.4 | 0px | Large button text (primary, pill-shaped) |
| Button LG | CooperHewitt | 17.6px | 400 | 2.55 | 0px | Large button; lighter weight, generous line |
| Body LG | Public Sans | 16px | 400 | 1.6 | 0px | Large body text (lists, rich text) |
| Body LG Strong | Public Sans | 16px | 700 | 1.6 | 0px | Large body bold emphasis |
| Body LG Tight | Public Sans | 16px | 400 | 1 | 0px | Compact line height for links |
| Body MD | Public Sans | 14px | 400 | 1.6 | 0px | Standard body text |
| Body SM | Public Sans | 12.96px | 400 | 1.6 | 0px | Small body text |
| Body XS | Public Sans | 12.8px | 400 | 1.6 | 0px | Extra-small body |
| Label MD | Public Sans | 16px | 400 | 2.8 | 0px | Form labels; tall line height |
| Label SM | Public Sans | 14px | 400 | 1.8 | 0px | Small form label |
| Caption | Public Sans | 12px | 400 | 1 | 0px | Figure captions, fine print |

### Principles

- **Display hierarchy via typeface:** CooperHewitt headlines command attention; Public Sans serves accessible body and UI text.
- **Negative tracking on display:** Letter-spacing of -0.8px on the largest display sizes (80px, 76.8px, 54.4px) creates visual compression and branded presence.
- **Generous body line height:** 1.6 on body sizes ensures readability; tight 1.0 on captions and links where space is constrained.
- **Weight variation:** Heavier (700) for all headings; lighter (400) on display XL/LG and some button text for elegance.
- **Button text is display-weight:** Buttons use CooperHewitt at 17.6–21.28px to reinforce CTAs as key moments.

## 4. Component Stylings

### Buttons

**Primary Button (Pill-shaped, Large)**
- Font: CooperHewitt, 21.28px, weight 700, line-height 1.4
- Background: `{colors.primary}` (`#0058AA`)
- Text color: `{colors.canvas}` (`#FFFFFF`)
- Padding: 0px 8px
- Border: `1px solid {colors.primary}` (`#0058AA`)
- Border radius: `{rounded.full}` (9999px)
- Height: 48px
- Width: 73px
- Box shadow: none
- Hover state: Background `#1779BA`, text `#FEFEFE`

**Primary Button (Pill-shaped, Small)**
- Font: CooperHewitt, 17.6px, weight 400, line-height 2.55
- Background: `{colors.primary}` (`#0058AA`)
- Text color: `{colors.canvas}` (`#FFFFFF`)
- Padding: 0px 15px
- Border: `1px solid {colors.canvas}` (`#FFFFFF`)
- Border radius: `{rounded.full}` (9999px)
- Height: 40px
- Width: 262px
- Box shadow: none
- Hover state: Background `#177ABA`, text `#FEFEFE`

**Filled Button (Icon/Compact)**
- Font: Public Sans, 12px, weight 400, line-height 1
- Background: `#257FA0`
- Text color: `{colors.canvas}` (`#FFFFFF`)
- Padding: 11.2px 16px
- Border: none
- Border radius: `{rounded.none}` (0px)
- Height: 34.375px
- Width: 68px
- Box shadow: none
- Hover state: Background `#257FA0` (inherit)

**Icon Button (Ghost)**
- Font: Public Sans, 30.4px, weight 400, line-height 1
- Background: transparent
- Text color: `{colors.canvas}` (`#FFFFFF`)
- Padding: 0px 7.5px
- Border: none
- Border radius: `{rounded.none}` (0px)
- Height: 48px
- Width: 48px
- Box shadow: none

### Cards & Containers

**Link Card (Default)**
- Font: Public Sans, 19.2px, weight 400, line-height 1.5
- Background: `#EEEDED`
- Text color: `{colors.body}` (`#0A0A0A`)
- Padding: 15px
- Border: none
- Border radius: `8px 8px 0px 0px` (top corners only)
- Height: 103.672px
- Width: 1170px
- Box shadow: none
- Hover state: Border colour inherit

**Link Card (Large)**
- Font: Public Sans, 16px, weight 400, line-height 1.5
- Background: `{colors.canvas}` (`#FFFFFF`)
- Text color: `#2E2E2E`
- Padding: none (0px)
- Border: none
- Border radius: `{rounded.none}` (0px)
- Height: 381.562px
- Width: 387.328px

### Navigation

**Navigation Bar (Default)**
- Font: Public Sans, 12px, weight 400, line-height 1.5
- Background: `#CBC9CC`
- Text color: `{colors.ink}` (`#000000`)
- Padding: 0px
- Border: none
- Border radius: `{rounded.none}` (0px)
- Height: 34.375px
- Width: 1440px (full)
- Box shadow: none
- Hover state: Background `#CBC9CC`, box shadow `rgba(203, 201, 204) 0px 7px 0px, rgba(203, 201, 204) 0px 14px 0px`

### Inputs & Forms

**Input Field (Focus State)**
- Font: Public Sans, 16px, weight 400, line-height 2.8
- Background: `#FEFEFE`
- Text color: `{colors.body}` (`#0A0A0A`)
- Border: `1px solid {colors.primary}` (`#0058AA`)
- Border radius: `{rounded.none}` (0px)
- Box shadow: `rgb(0, 88, 170) 0px 0px 5px`
- Outline: none

**Input Field (Disabled State)**
- Background: `#DDDBDD`
- Text color: `{colors.body}` (inherited)
- Opacity: 0.5
- Border: none

## 5. Layout Principles

### Spacing System

Base unit: `{spacing.md}` (16px). Scale progresses by 4px intervals for fine control, then larger steps for section spacing.

- `{spacing.xxs}` = 4px — micro padding (icon spacing)
- `{spacing.xs}` = 8px — compact padding (button internal)
- `{spacing.sm}` = 12px — small gap (list items)
- `{spacing.md}` = 16px — standard padding, body text leading
- `{spacing.lg}` = 20px — comfortable margin
- `{spacing.xl}` = 24px — card padding
- `{spacing.xxl}` = 28px — large section gap
- `{spacing.xxxl}` = 32px — extra-large gap
- `{spacing.section}` = 36px — section internal padding
- `{spacing.band}` = 64px — hero band vertical padding

**Usage Context**

- Micro (4–8px): Icon-to-text, button internal
- Comfortable (16–24px): Card padding, list gaps, heading margins
- Section (36–64px): Between major content blocks; `{spacing.band}` reserves hero areas

### Grid & Container

| Viewport | Content Width | Section Padding X | Grid Columns |
|---|---|---|---|
| 375px | 355px | 15px | 3 |
| 768px | 738px | 15px | 3 |
| 1024px | 994px | 15px | 7 |
| 1280px | 1250px | 15px | 7 |
| 1440px | 1410px | 15px | 7 |

- Max content width: 1410px (at 1440px viewport)
- Section padding consistent at 15px on all breakpoints
- Grid is flexible: 3 columns on mobile/tablet, 7 on desktop

### Whitespace Philosophy

Whitespace is a primary structural tool. Major sections are separated by `{spacing.band}` (64px) vertical padding, creating breathing room between content zones. Card and heading margins use `{spacing.section}` (36px) or `{spacing.xxxl}` (32px) to establish visual rhythm. Paragraph line height of 1.6 in body text provides internal breathing; list items are gapped by `{spacing.sm}` (12px). This discipline creates a calm, authoritative reading experience.

### Border Radius Scale

- `{rounded.none}` = 0px — buttons (filled, icon), inputs, primary cards, navigation, footer
- `{rounded.full}` = 9999px — primary pill-shaped buttons, icon buttons when circular

The system is predominantly sharp-cornered, with radius used only for emphasis on primary CTAs and cards with top-rounded corners (8px bespoke, not in token scale).

### Border Widths

- Thin: `1px` — used on button borders (primary), input focus borders, dividers (`{colors.hairline}`)

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow; colour-blocking via background | Default cards, buttons, surfaces |
| Dropdown | `rgba(0, 0, 0, 0.15) 0px 9px 9px 0px, rgba(0, 0, 0, 0.1) 0px 4.5px 4.5px 0px` | Dropdown menus, popovers, overlays |

**Shadow Philosophy**

The system employs a single-tier elevation strategy: most components are flat, with depth conveyed through colour changes (light neutrals on dark backgrounds and vice versa). A single shadow is reserved for true floating elements (dropdowns, popovers) to maintain visual hierarchy without visual noise. The shadow uses two layers—a soft outer (0.15 opacity at 9px) and tighter inner (0.1 opacity at 4.5px)—for subtle, readable depth.

### Opacity Levels

- Disabled: 0.5 opacity (input fields, disabled state)
- Disabled (other): 0.8 opacity (general disabled interactive elements)
- Overlay: rgba(50, 50, 50, 0.5) — semi-transparent overlay
- Transparent: rgba(0, 0, 0, 0) — ghost buttons, invisible backgrounds

### Z-index / Layering

- Base: 1 — default stacking
- Dropdown: 10 — floating menu panels
- Sticky: 200, 201, 202 — sticky navigation or headers
- Sticky (high): 998, 999 — high-priority sticky elements
- Modal: 1000 — modal dialogs, highest stacking

## 7. Do's and Don'ts

### Do

- Use `{colors.primary}` (`#0058AA`) for all primary calls-to-action and interactive states; it is the brand's trust signal.
- Maintain link text in `{colors.link}` (`#00033D`) to preserve hierarchy over accent blue.
- Apply `{spacing.band}` (64px) between major content sections; it is the defining rhythm of the layout.
- Pair CooperHewitt display headlines with generous negative letter-spacing (-0.8px) at 54.4px and above for branded presence.
- Use Public Sans for all body text and form labels; it ensures readability and accessibility.
- Keep button borders sharp (`{rounded.none}` = 0px) except on primary pill-shaped buttons where `{rounded.full}` applies.
- Employ `{colors.hairline}` (`#DDDBDD`) for 1px dividers and subtle borders; reserve heavier strokes for interactive elements.
- Layer surfaces with colour, not shadow; the single dropdown shadow is the exception.

### Don't

- Don't invent secondary colours; the system lacks a semantic error/success/warning ramp by design.
- Don't apply negative tracking (-0.8px) to body text; reserve tight letter-spacing for display sizes.
- Don't use rounded corners on form inputs or secondary cards; the system is predominantly sharp.
- Don't exceed the single dropdown shadow; flat design is the default.
- Don't place text below 12px (`{typography.caption}`) for body copy; maintain `{typography.body-sm}` at 12.96px minimum for readability.
- Don't override link colour to match primary; keep links dark (`#00033D`) for visual separation.
- Don't apply opacity to text for visual emphasis; use weight or colour instead.

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Content Width | Grid Columns | Key Changes |
|---|---|---|---|---|
| Mobile | 375px | 355px | 3 | Full-width sections; navigation menu toggle; heading size 36px |
| Tablet | 768px | 738px | 3 | Same 3-column layout; heading size 48px |
| Desktop (Small) | 1024px | 994px | 7 | Expand to 7-column grid; heading size 80px; all nav links visible |
| Desktop (Medium) | 1280px | 1250px | 7 | Larger content width; layout unchanged |
| Desktop (Large) | 1440px | 1410px | 7 | Max width reached; section padding consistent at 15px |

**Key Collapse Points**

- Navigation links collapse to menu toggle at tablet (no explicit toggle point measured; toggle present at 375px and persists across all breakpoints).
- Heading size jumps: 36px (mobile) → 48px (tablet) → 80px (desktop).
- Section padding X remains 15px across all breakpoints (no responsive padding adjustment).

### Touch Targets

- Minimum interactive size: 48px (buttons, icon buttons).
- Link text line height: 2.8 on labels for generous touch padding.
- Padding on touch-adjacent elements: `{spacing.md}` (16px) minimum for comfortable spacing.

### Collapsing Strategy

- **Mobile (375px–767px):** 3-column layout; full-width content; menu toggle replaces horizontal nav links; heading sizes reduce to 36px.
- **Tablet (768px–1023px):** 3-column layout maintained; slightly larger content width (738px); heading size increases to 48px.
- **Desktop (1024px+):** Expand to 7-column grid; content width grows to 994px+; all navigation links visible; heading max size 80px.
- **Section padding:** Consistent 15px horizontal padding across all viewports; no responsive adjustment.

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Primary (`#0058AA`) — Use for buttons, active states, brand accents.
- **Page Background:** Canvas (`#FFFFFF`) — Default surface for all page content.
- **Heading Text:** Ink (`#000000`) — Primary colour for all headings and high-contrast labels.
- **Body Text:** Body (`#0A0A0A`) — Near-black for body copy and secondary content.
- **Link Text:** Link (`#00033D`) — Dark navy for inline hyperlinks; darker than primary to establish hierarchy.
- **Alternate Section:** Surface Alt (`#2E2E2E`) — Mid-tone neutral for alternating band backgrounds and secondary text.
- **Dividers:** Hairline (`#DDDBDD`) — 1px borders and subtle separators.
- **Decorative Accent:** Accent 1 (`#89E9D7`) — Teal; minimal use for visual flourish only.

### Iteration Guide

1. **Typography Foundation:** All display headlines use CooperHewitt; body text and UI labels use Public Sans. Apply -0.8px letter-spacing to display sizes 54.4px and above.
2. **Button System:** Primary CTAs are pill-shaped (`{rounded.full}`) with `{colors.primary}` background. Filled buttons are sharp-cornered (`{rounded.none}`). All button text uses CooperHewitt except LG variant (weight 400).
3. **Spacing Rhythm:** Use `{spacing.band}` (64px) between major sections. Card and heading margins use `{spacing.section}` (36px). Body text line height is always 1.6.
4. **Color Hierarchy:** Ink (`#000000`) > Body (`#0A0A0A`) > Surface Alt (`#2E2E2E`) > Neutral tones. Link colour stays dark (`#00033D`) regardless of primary blue.
5. **Elevation:** Flat surfaces by default. Single shadow reserved for floating dropdowns: `rgba(0, 0, 0, 0.15) 0px 9px 0px, rgba(0, 0, 0, 0.1) 0px 4.5px 0px`.
6. **Responsive Breakpoints:** Mobile 375px (36px headings), Tablet 768px (48px headings), Desktop 1024px+ (80px headings). Section padding X fixed at 15px across all viewports.
7. **Focus & Hover:** Input focus adds 1px primary border and shadow. Link hover adds underline and colour shift to lighter primary. Button hover shifts to darker primary shade.
8. **Accessibility:** Maintain 12px minimum for caption sizes. All text uses full opacity; disabled states use 0.5–0.8 opacity. Focus states include 2px solid black outline on links and buttons.

## 10. Known Gaps

- **No semantic colour ramp:** The extracted site does not expose error, success, warning, or info states. A designer using this system will need to establish those roles if required.
- **Interaction states (limited):** The extraction captured button hover, link hover, input focus, and disabled states. The absence of other states (e.g., `active`, `visited`, `aria-pressed`) means they are not defined in this system.
- **No gradient or decorative effects:** The site uses solid colours only; no gradients, meshes, or animated effects were captured.
- **Four unassigned colours:** Neutral 1 (`#E5E5E5`), Neutral 2 (`#808080`), Neutral 3 (`#CBC9CC`), and Accent 1 (`#89E9D7`) had no measurable semantic role in the extracted pages. They are described as decorative; their intended use should be determined by the design team.
- **Dark mode not measured:** The extraction represents the light theme only. Any dark-mode variant is not present in this document.
- **Surfaces behind authentication not visited:** The extraction covered 6 public-facing pages. Authenticated areas (student portals, admin dashboards) were not analysed.
- **Component pattern coverage:** Only buttons, navigation, footer, and link cards were measured. Other components (modals, tabs, tooltips, pagination) may exist on the site but were not extracted.
- **No animation or transition data:** Timing, easing, and animation curves were not captured. Hover transitions use instantaneous colour changes as measured.
- **No microinteraction details:** Loading states, skeleton screens, or error messaging animations are not defined.