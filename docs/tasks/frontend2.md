# Frontend V2 refactor (UI/UX upgrade)

You are refactoring the frontend of the project "barbearia-agendamento" from V1 (functional but basic UI) to V2 (production-grade, modern UI/UX).

## Context

- Tech stack:
  - Frontend: Vite + React + TypeScript (in the `frontend/` folder).
- The current frontend already implements all flows:
  - client booking flow (choose barber → choose service → choose date → choose slot → confirm),
  - barber daily agenda (list appointments, mark as completed, no-show, cancel),
  - basic admin screens (services, barbers, clients).
- The goal of this refactor is to IMPROVE UI/UX and styling, NOT to change business logic.

Assumptions:
- React Router is used for routing.
- There is a shared HTTP client (e.g. `frontend/src/services/api.ts`) using `VITE_API_URL` as the backend base URL.
- All backend endpoints and request/response shapes are already correct and must NOT be changed.

---

## High-level goal

Transform the existing "basic" frontend into a **modern, responsive, production-ready UI**, while:

- keeping all existing features and flows working,
- preserving all routes, components’ public APIs, and backend integrations,
- improving layout, styling, visual hierarchy, loading and error states.

---

## Hard constraints (do NOT break these)

1. **Do NOT change backend contracts**
   - Do not change any URLs, HTTP methods, or payload shapes used to talk to the backend.
   - Do not rename or remove API calls.

2. **Do NOT change business logic**
   - Do not change how state is managed (React hooks) beyond what is strictly necessary for UI.
   - Do not change validation/business rules (lead time, availability, status transitions, etc.).
   - Do not change the booking flow steps or agenda behavior.

3. **Preserve component contracts**
   - Keep component names and exported symbols the same.
   - Keep props shapes stable where components are reused.
   - If you need to change a prop, refactor all its usages consistently.

4. **Do NOT remove features**
   - Every action that exists in V1 (create appointment, cancel, mark as completed, mark no-show, unlock client, etc.) must continue to exist and work in V2.

---

## UI/UX goals for V2

Apply the following across the entire frontend:

1. **Layout & navigation**
   - Create a shared layout component (e.g. `src/components/layout/AppLayout.tsx`) with:
     - a top navbar containing the app name and simple navigation,
     - a main content area with a centered container on desktop and full width on mobile,
     - consistent padding and spacing.
   - Wrap all main pages in this layout.

2. **Styling technology**
   - Prefer TailwindCSS for styling. If Tailwind is not configured yet:
     - add Tailwind to the Vite + React + TS app (tailwind.config, postcss config, import in `main.tsx` or `index.css`),
     - use Tailwind classes instead of inline styles whenever possible.
   - If Tailwind is already present, use it consistently.

3. **Design language**
   - Modern, clean, and minimal:
     - generous spacing (padding/margins),
     - rounded corners,
     - subtle shadows for cards,
     - clear typographic hierarchy (titles, subtitles, body).
   - Make all screens responsive (mobile-first layout that scales to desktop).

4. **Shared UI components**
   - Create reusable components in `src/components/ui`, e.g.:
     - `Button`, `Input`, `Select`, `Card`, `Badge`, `Modal`, `Spinner`.
   - Use these shared components across all pages instead of ad-hoc HTML.

5. **Pages & flows to improve**

   a. **Client booking flow (`/agendar`)**
   - Provide a step-based experience (wizard-like) for:
     1. choose barber,
     2. choose service,
     3. choose date,
     4. choose time slot,
     5. confirm booking (client name + phone).
   - Use cards for barbers and services.
   - Use a calendar or date picker (or a nice date input) with clear state for selected day.
   - Show time slots as buttons/badges with selected state and disabled state.
   - Show loading and error states for all API calls.

   b. **Barber agenda view (`/agenda`)**
   - Layout:
     - date selector at the top,
     - list or table of appointments for the selected day below.
   - For each appointment, show:
     - time,
     - client name,
     - service name/duration,
     - current status with a colored badge.
   - Action buttons:
     - "Complete", "No-show", "Cancel" with clear visual distinction (primary / warning / danger).
   - After any action, refresh the agenda and show a small toast/snackbar confirming success or showing an error.

   c. **Admin screens (`/admin`)**
   - Create an admin home with navigation cards to:
     - manage services,
     - manage barbers and working hours,
     - manage clients.
   - For each admin section:
     - display data in a table/card list,
     - provide clear forms to create/update records,
     - use confirmation modals for destructive actions (e.g., delete, deactivate).

6. **UX details**
   - Add visual feedback for:
     - loading states (spinners, skeletons),
     - errors (error messages or banners),
     - empty states (“No appointments for this day yet”, “No services found”, etc.).
   - Validate user inputs in forms and show inline error messages.
   - Ensure all interactive elements (buttons, inputs) have hover and focus styles.

---

## Refactor strategy

When refactoring, follow this approach:

1. **Inspect current structure**
   - Understand the existing routing setup, pages, and shared components (if any).
   - Identify the main pages:
     - booking flow,
     - barber agenda,
     - admin pages.

2. **Introduce base layout & UI components**
   - Implement the shared layout (`AppLayout`) and UI components (`Button`, `Input`, `Card`, etc.).
   - Update each page to use the layout and UI components instead of raw HTML.

3. **Refine each page**
   - For each main page, refactor JSX structure and styling ONLY:
     - keep hooks, state, and API calls intact,
     - improve layout, responsiveness, and visual hierarchy,
     - improve loading/error/empty states.

4. **Keep changes scoped**
   - Whenever you touch a file, focus on UI/UX refactors inside that file.
   - Avoid cascading logic changes across many files.
   - Run TypeScript type checks to ensure no type is broken.

5. **Testing after refactor**
   - Ensure all pages compile and render.
   - Ensure all flows still work:
     - booking an appointment,
     - viewing the agenda,
     - updating appointment status,
     - managing services/barbers/clients.

---

## Output format

When you output changes:

- For new files: show the full file content.
- For updated files: show the full updated file content (not a diff).
- If you need to add Tailwind or other config files (tailwind.config, postcss.config, etc.), output their full contents.

Start by:
1. Confirming the frontend root directory (assume `frontend/`).
2. Adding/configuring TailwindCSS if needed.
3. Creating shared layout and UI components.
4. Refactoring pages in this order:
   - client booking,
   - barber agenda,
   - admin screens.

Remember: you are upgrading UI/UX while preserving behavior and business logic.
