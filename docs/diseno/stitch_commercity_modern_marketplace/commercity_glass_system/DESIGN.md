---
name: Commercity Glass System
colors:
  surface: '#fff8f5'
  surface-dim: '#ecd6c9'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ea'
  surface-container: '#ffeade'
  surface-container-high: '#fbe4d7'
  surface-container-highest: '#f5ded2'
  on-surface: '#251912'
  on-surface-variant: '#574235'
  inverse-surface: '#3b2e25'
  inverse-on-surface: '#ffede4'
  outline: '#8b7263'
  outline-variant: '#dfc1af'
  surface-tint: '#964900'
  primary: '#964900'
  on-primary: '#ffffff'
  primary-container: '#ff8000'
  on-primary-container: '#5e2b00'
  inverse-primary: '#ffb787'
  secondary: '#0059bb'
  on-secondary: '#ffffff'
  secondary-container: '#0070ea'
  on-secondary-container: '#fefcff'
  tertiary: '#006495'
  on-tertiary: '#ffffff'
  tertiary-container: '#00acfd'
  on-tertiary-container: '#003d5d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc7'
  primary-fixed-dim: '#ffb787'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#723600'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc7ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#cbe6ff'
  tertiary-fixed-dim: '#90cdff'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#004b72'
  background: '#fff8f5'
  on-background: '#251912'
  surface-variant: '#f5ded2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 24px
  gutter-grid: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system establishes a high-performance, modern marketplace aesthetic that balances the urgency of commerce with the clarity of a professional fintech tool. The brand personality is efficient, transparent, and trustworthy.

The visual direction utilizes a **Glassmorphic** approach, characterized by layered transparency, frosted surfaces, and vibrant accent blurs. This choice creates a sense of depth and lightness, making complex dashboard data and dense product listings feel manageable and airy. The overall style is minimalist, stripping away unnecessary borders in favor of structural alignment and tonal separation.

## Colors

The palette is driven by the high-contrast duo of Primary Orange and Secondary Blue. To maintain a professional atmosphere, these vibrant hues are used surgically for interactive elements and brand identifiers, while the rest of the interface relies on a clean, neutral scale.

- **Primary Orange (#FF8000):** Used for primary calls to action (CTAs), progress indicators, and "Buy" functions.
- **Secondary Blue (#007BFF):** Reserved for navigation, informational links, and secondary interactive states.
- **Surface Strategy:** The background uses a soft off-white to allow the glassmorphic cards and containers to pop. Surfaces utilize semi-transparent white fills with backdrop-blur filters.
- **Status Colors:** Semantic colors are derived from the marketplace's reputation system (Platinum, Gold, Regular) and transactional states (Success, Warning, Danger).

## Typography

The system employs a sophisticated font pairing to balance authority with approachability. **Inter** is used for headlines to provide a clean, industrial precision, while **Poppins** is used for body text and labels to introduce a friendly, geometric warmth.

- **Headlines (Inter):** High-weight (600-700) with tight letter spacing for a confident, institutional feel. Perfect for large display titles and numerical data clarity.
- **Body (Poppins):** Standard weight (400) with generous line heights. The geometric nature of Poppins ensures high readability for long-form content and chat interfaces.
- **Labels (Poppins):** Medium weights (500-600) used for secondary metadata, system statuses, and navigational elements.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to maintain structural integrity in data-heavy admin views, while transitioning to a **Fluid Grid** for the mobile experience.

- **Grid:** A 12-column grid is used for desktop (1140px max width), shifting to a 4-column layout for mobile.
- **Rhythm:** An 8px base spacing unit governs all component dimensions and gaps.
- **Responsive Behavior:** 
  - **Desktop:** Sidebar is fixed at 280px; main content area expands.
  - **Tablet:** Sidebar collapses into a drawer; margins reduce to 16px.
  - **Mobile:** Search bar is pinned to the top; product cards stack into a 2-column infinite scroll.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layering** and **Glassmorphism**.

1.  **Base Layer:** Solid light neutral background (#F8F9FA).
2.  **Mid Layer (Glass):** White fill at 70-85% opacity with a 16px backdrop-blur. This layer is used for cards, sidebars, and navigation bars.
3.  **Accent Layer:** Soft, low-opacity color blurs (Orange or Blue) positioned behind glass layers to indicate active states or brand presence without cluttering the foreground.
4.  **Borders:** Fine, 1px semi-transparent white borders are applied to glass elements to define edges against light backgrounds.

## Shapes

The shape language is consistently "Rounded" to soften the professional aesthetic and make the marketplace feel accessible.

- **Components:** Standard cards and containers use a 0.5rem (8px) radius.
- **Interactive Elements:** Buttons and input fields follow the "Rounded-LG" (16px) or "Pill" (999px) style, especially for primary actions and notification badges.
- **Icons:** Use a 1.5px or 2px stroke weight with rounded caps and joins to match the component curvature.

## Components

### Search Bar
A primary focal point. It should be a pill-shaped glass element with a persistent 1px border. The search icon uses the Secondary Blue, and the input field features a clear button on the right.

### Product Cards
Utilize the glassmorphic style with a subtle white-to-transparent gradient fill. Images should have a 12px corner radius. Prices are featured in bold **Inter** using the Primary Orange.

### Sidebars (Seller/Admin)
The sidebar utilizes a full-height glass panel with a 20px backdrop blur. Active states are indicated by a pill-shaped background in Secondary Blue (low opacity) with a vertical 4px orange indicator line.

### Buttons
- **Primary:** Solid Primary Orange with white text. Fully rounded (pill-shaped).
- **Secondary:** Transparent glass with a 1px Blue border and Blue text.
- **Action Icons (Chat/Notification):** Circular glass containers. The notification bell features a "Primary Orange" dot for unread states.

### Chat Widgets
Messages from the user appear in solid Secondary Blue (rounded bubbles); messages from others appear in a semi-transparent grey glass bubble. Status indicators (Online/Offline) use small circular dots.