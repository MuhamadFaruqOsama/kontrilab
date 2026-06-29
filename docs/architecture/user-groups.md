# User Group Separation

Kontrilab currently separates the product surface into two route areas:

- `/teacher` is the desktop-first teacher website. It is reserved for assignment setup, class management, project group oversight, and contribution review workflows.
- `/student` is the mobile-first student app. It is reserved for project participation, contribution updates, activity, and profile workflows.

This is only setup scaffolding. Detailed screens and flows should be implemented later from the provided designs.

## Style Guardrails

- Student screens should stay mobile-first and use the saved preview in `docs/design/kontrilab-app-preview.png` as the baseline mood.
- Teacher screens may use wider desktop layouts, side navigation, denser tables, and review-focused tools.
- Keep all user-facing copy out of all-uppercase styling.
- Use Nunito Sans and the `--ktr-*` color and typography tokens from `app/globals.css`.
