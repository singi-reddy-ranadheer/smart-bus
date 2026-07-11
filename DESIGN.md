---
version: alpha
name: Smart Bus AI — Passenger
description: A calm, reliable, mobile-first transit design system for the Smart Bus AI passenger application.
colors:
  primary: "#0B5FFF"
  primary-hover: "#0848C4"
  primary-soft: "#E8F0FF"
  secondary: "#123152"
  accent: "#F5A524"
  success: "#168A5B"
  warning: "#B54708"
  error: "#D92D20"
  background: "#F7F9FC"
  surface: "#FFFFFF"
  surface-subtle: "#F0F4F8"
  on-surface: "#102A43"
  on-surface-muted: "#627D98"
  outline: "#D9E2EC"
  map-water: "#DCEEFF"
  route-campus: "#E4572E"
  route-city: "#7C3AED"
typography:
  display-lg:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  headline-md:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label-lg:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.2
  label-md:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  data-md:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  full: "9999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  page-mobile: "20px"
  page-desktop: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "14px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "14px 20px"
    height: "48px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "8px 12px"
  chip-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

# Smart Bus AI — Passenger Design System

## Overview

Smart Bus AI helps passengers confidently choose and track public transport. The experience should feel calm, dependable, and human—not like a dense operations dashboard or a generic ride-hailing clone. Prioritize location awareness, live movement, and the next useful action.

Design mobile-first for a passenger checking a bus while walking or waiting outdoors. Use generous touch targets, immediately understandable icons, concise copy, and a clear hierarchy. On desktop, preserve the same visual language while giving the map and route information more room.

## Colors

- **Primary blue (`#0B5FFF`):** trust, navigation, primary actions, selected states, and live tracking indicators.
- **Deep navy (`#123152`):** headings and high-emphasis navigation. Use it sparingly to keep the interface light.
- **Warm amber (`#F5A524`):** attention states such as a service notice; never use it as a second primary CTA.
- **Success green (`#168A5B`), warning (`#B54708`), and error (`#D92D20`):** status only. Always pair status color with an icon and text.
- **Neutral surfaces:** use `background`, `surface`, and `surface-subtle` to create calm layers around a map. Body text uses `on-surface`; supporting text uses `on-surface-muted`.
- **Route colors:** route-specific colours communicate identity only. They must remain readable against the map and be accompanied by a route name/number.

## Typography

Use **Plus Jakarta Sans** (fall back to Inter/system sans) for the entire product. It should feel friendly and crisp on small screens. Use bold headlines for a single decision per screen, normal-weight body copy for explanation, and data labels for ETAs, time, speed, or route identifiers.

Avoid all-caps paragraphs and avoid more than three type sizes in one compact card. Numbers such as `12 min` should be highly scannable but not visually louder than the primary action.

## Layout

Use a 4px/8px spacing rhythm. The mobile content column has 20px horizontal page padding, except for full-bleed maps. Minimum interactive size is 44 × 44px.

- **Mobile:** optimize for 360–430px width. Make the map the dominant surface; use bottom sheets for contextual information.
- **Tablet/Desktop:** use a 12-column, maximum 1200px layout. Keep a persistent map or route map beside a 360–420px detail panel rather than stretching text cards across the page.
- Respect device safe areas. Persistent bottom navigation sits above the safe area and never obscures map controls or a sheet handle.

## Elevation & Depth

The map is the base layer. Use a soft shadow (`0 8px 24px rgba(16, 42, 67, 0.14)`) plus a subtle outline to lift bottom sheets, floating controls, and route cards. Do not stack many heavy shadows. Use tonal contrast and spacing before adding elevation.

## Shapes

Use 12px corners for controls and inputs, 16px for cards, and 24px top corners for mobile bottom sheets. Map buttons and compact status chips may be fully rounded. Keep icons simple, stroke-based, and visually balanced with text.

## Components

- **Primary button:** solid blue, white label, one primary action per view. Use action verbs such as “Track this bus”.
- **Secondary button:** pale blue fill for an alternate action. Use tertiary text buttons for low-priority navigation.
- **Bus marker:** a compact bus icon in the route color, with a small directional indicator. Selected markers gain a white halo; never rely on colour alone.
- **Route chip:** route number/name, route colour dot, selected/unselected state. Keep labels short and horizontally scrollable on mobile.
- **Bus card / bottom sheet:** bus number, route name, live status, ETA, next stop, speed only when useful, and a clear tracking action. Use a visible drag handle on mobile sheets.
- **Stop timeline:** accessible ordered list with numbered/line-connected stops. Clearly show “Current” and “Next” states using text and iconography.
- **Form controls:** persistent field labels, useful helper/error text, password visibility control, and 16px minimum input text to prevent mobile zoom.
- **Status:** use a text label such as “Live now”, “No active buses”, or “Location unavailable” alongside any colour/icon.
- **Bottom navigation:** Map, Routes, Profile. Use labels as well as icons; active tab uses blue.

## Do's and Don'ts

- Do make the map and the nearest useful bus the visual centre of the home view.
- Do show realistic transit information: bus number, route, next stop, ETA, and live status.
- Do meet WCAG AA contrast, retain visible keyboard focus, and support screen-reader labels for maps and controls.
- Do provide useful loading, empty, location-permission, and offline states.
- Don't invent payment, occupancy, favourite-route, social-login, or demand-prediction UI for the v0.1 Passenger experience.
- Don't make a map-only experience; always provide a text alternative for route and stop information.
- Don't use decorative gradients, glass effects, excessive badges, or a different colour for every card.
- Don't use an arbitrary user avatar, a map provider logo, or a fake claim that example data is live.
