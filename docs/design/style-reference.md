# Kontrilab Style Reference

Source preview: `docs/design/kontrilab-app-preview.png`  
Student home reference: `docs/design/home-kontrilab-reference.png`

## Visual Direction

Kontrilab uses a soft mobile-first interface with rounded cards, calm green primary actions, light app surfaces, subtle borders, and compact information hierarchy. Screens should feel friendly, academic, and task-focused rather than decorative or marketing-heavy.

## Typography

- Use Nunito Sans for all interface text.
- Do not write interface copy in all uppercase.
- Use Title Case for labels, page titles, navigation, and section names when capitalization is needed.
- Use sentence case for helper text, descriptions, activity messages, and form guidance.
- Keep letter spacing subtle: neutral for headings and controls, slightly open for longer body copy and small labels.
- Keep line height generous enough for mobile readability: tighter for headings, normal or relaxed for descriptions.`r`n- Use font weights no heavier than semibold for interface text.

## Layout And Components

- Target mobile app proportions first.
- Use rounded white cards over a very light green app background.
- Keep borders quiet and low contrast. Use stroke-only surfaces with `--ktr-border-light`; do not use shadows for cards, sheets, nav, or other app surfaces.
- Primary actions use Kontrilab green with rounded pill-like buttons.
- Status chips use soft background colors with small icons and compact text.
- Bottom navigation uses the provided Streamline Solar SVG icons plus labels, with the active item in primary green.
- Use bottom sheets for mobile detail, join project, and confirmation patterns instead of centered modals.
- Use toast feedback for completed actions across student and teacher surfaces.
- Apply subtle pressed states to clickable elements so actions feel responsive without becoming playful or noisy.
- Do not include decorative device status bars in implemented screens; those are preview-only.
- Use clear spacing between grouped content, but keep information dense enough for repeated student workflows.

## Future Implementation Notes

When screen-specific designs are provided, follow those designs directly. Treat this file as the baseline style memory for Kontrilab until the detailed Figma/screen specs arrive.
