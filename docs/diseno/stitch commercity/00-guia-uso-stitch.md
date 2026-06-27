---
name: Solid Commerce
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#574235'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#8b7263'
  outline-variant: '#dec1af'
  surface-tint: '#954a00'
  primary: '#954a00'
  on-primary: '#ffffff'
  primary-container: '#fa8000'
  on-primary-container: '#5b2b00'
  inverse-primary: '#ffb785'
  secondary: '#0055c6'
  on-secondary: '#ffffff'
  secondary-container: '#096df6'
  on-secondary-container: '#fefcff'
  tertiary: '#006688'
  on-tertiary: '#ffffff'
  tertiary-container: '#00aee5'
  on-tertiary-container: '#003d53'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc6'
  primary-fixed-dim: '#ffb785'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#713700'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b0c6ff'
  on-secondary-fixed: '#001945'
  on-secondary-fixed-variant: '#00429c'
  tertiary-fixed: '#c2e8ff'
  tertiary-fixed-dim: '#75d1ff'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d67'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is built for a robust, high-trust marketplace environment. The brand personality is professional, industrious, and dependable. It avoids ephemeral trends like glassmorphism or excessive transparency in favor of a **Corporate Modern** aesthetic that emphasizes structural integrity and clarity.

The visual direction uses solid blocks of color and high-contrast boundaries to define hierarchy. By removing all opacity and blur effects, the interface achieves a "high-definition" solid look that communicates stability and speed. The experience is designed to feel architectural—anchored by the vibrant orange and blue palette derived from the brand's identity—ensuring that the user feels they are interacting with a secure and established platform.

## Colors

The palette is strictly solid. No RGBA or alpha-channel colors are permitted. 

- **Primary (#FA8000):** Used for primary actions, cart indicators, and brand emphasis.
- **Secondary (#2276FF):** Used for navigation, links, and secondary interactive elements.
- **Tertiary (#00C2FF):** Pulled from the logo's sky-blue highlights, used for informational badges and accent strokes.
- **Neutral (#1A1C1E):** A deep, solid charcoal used for maximum legibility in text and heavy borders.
- **Surface Strategy:** We use a "Solid Layering" approach. Instead of overlays, we use distinct hex codes (e.g., #F4F7FA for backgrounds and #FFFFFF for cards) to create separation.

## Typography

This system utilizes a dual-font strategy. **Poppins** is reserved for headlines and branding to provide a modern, clean, and slightly geometric professional feel. **Inter** is used for all body text, inputs, and labels due to its exceptional legibility in data-heavy marketplace environments.

All type must be rendered in solid colors (Neutral #1A1C1E or White #FFFFFF). Avoid grey scales that rely on opacity; use specific solid hex values for "muted" text (e.g., #64748B).

## Layout & Spacing

The design system employs a **Fixed Grid** philosophy for desktop to maintain a sense of structured "city" blocks, transitioning to a fluid model for mobile devices.

- **Desktop (1280px+):** 12-column grid, 24px gutters, 80px side margins.
- **Tablet (768px - 1279px):** 8-column grid, 24px gutters, 40px side margins.
- **Mobile (0px - 767px):** 4-column fluid grid, 16px gutters, 16px side margins.

All spacing follows an 8px base unit. Component internal padding should strictly use the spacing variables to ensure a mathematical rhythm across the marketplace.

## Elevation & Depth

To adhere to the "no transparency" and "no blur" constraints, depth is communicated through **Tonal Layering** and **Hard Shadows**.

1.  **Level 0 (Base):** #F4F7FA (The "Ground" of the city).
2.  **Level 1 (Cards/Surface):** #FFFFFF (Pure solid white).
3.  **Level 2 (Raised):** #FFFFFF with a solid, low-offset shadow. Shadows must be hex-defined (e.g., #D1D9E6) with 0% transparency.
4.  **Stroke Definition:** Use 1px or 2px solid borders (#E2E8F0) instead of soft shadows to define boundaries. This creates a "clean-cut" look consistent with professional engineering.

## Shapes

The shape language is **Soft** but disciplined. We use a 4px (0.25rem) base radius for standard components to maintain a professional, sharp-edged feel while avoiding the clinical coldness of 0px corners.

- **Buttons/Inputs:** 4px radius.
- **Cards/Modals:** 8px (0.5rem) radius.
- **Icon Containers:** 4px radius.

Pill shapes are used exclusively for status chips (e.g., "In Stock") to provide a visual contrast against the otherwise rectangular structure of the site.

## Components

### Buttons
- **Primary:** Solid #FA8000 background, White text. No gradients. 4px border-radius.
- **Secondary:** Solid #2276FF background, White text.
- **Outline:** 2px solid #2276FF border, #2276FF text, White background.

### Input Fields
- **Default:** White background, 1px solid #CBD5E1 border.
- **Focus:** 2px solid #2276FF border.
- **Labels:** Inter Bold, 14px, #1A1C1E.

### Cards
- Always use #FFFFFF background.
- 1px solid #E2E8F0 border.
- For hover states, increase border thickness to 2px solid #FA8000 or apply a solid #D1D9E6 shadow.

### Chips & Badges
- **Price Tag:** Solid #1A1C1E background with White Inter Bold text.
- **Category:** Solid #F4F7FA background with #2276FF text.

### Navigation
- Main Header: #FFFFFF background with a 2px solid #FA8000 bottom border to ground the brand.
- Active Links: #2276FF text color with a solid 3px underline of the same color.