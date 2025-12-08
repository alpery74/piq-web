# Repository Guidelines

## Project Structure & Modules
- Source lives under `src/`: `components/` for shared UI, `pages/` for routed views, `services/` for API calls, and `utils/` for helpers. Dashboard is broken into subcomponents under `components/dashboard/` (Health/Insights/Holdings plus shared ExpandableSection/InfoTooltip). `App.jsx` wires the router; `index.css` pulls Tailwind and global styles.
- Entry is `main.jsx`; static HTML shells are `index.html`, `legal.html`, and `privacy.html` for deployments. Assets bundled by Vite; adjust via `vite.config.js` and Tailwind settings in `tailwind.config.js`.
- Branding/logos: header/anchor bar use `/public/images/logo.svg`; sticky nav includes Coach/Analyst/Quant anchor pills with active states.

## Build, Test, and Development Commands
- `npm run dev` — start Vite dev server with hot reload.
- `npm run build` — production bundle output to `dist/`.
- `npm run preview` — serve the built bundle to verify before deploy.
- `npm run lint` — run ESLint across `js`/`jsx` files; fix findings before pushing.

## Coding Style & Naming
- JavaScript/React with ES modules; prefer functional components and hooks.
- Two-space indentation, semicolons, single quotes, trailing commas where sensible (match existing files).
- Components/Pages: `PascalCase` filenames; hooks: `useCamelCase`; utilities: `camelCase`. Keep one component per file when possible.
- Favor Tailwind utility classes for styling (see `index.css`), and colocate component-specific styles near their files.
- Run `npm run lint` locally; address warnings rather than suppressing unless justified.

## Testing Guidelines
- No automated test suite is present yet; add tests alongside features when feasible.
- For new React components, prefer lightweight render or interaction tests (e.g., Vitest + Testing Library) in `__tests__` folders or `ComponentName.test.jsx`. Keep names aligned with the component under test.
- When adding tests, ensure they run via `npm test` (or add a script) and document any new steps in this file or `README.md`.

## Commit & Pull Request Practices
- Follow the existing history: short, imperative summaries (e.g., “Add privacy policy page”). Keep under ~72 chars.
- Reference related issues in the description, and note UI changes with screenshots or short clips when relevant.
- Before opening a PR: run `npm run lint` and, if added, tests; confirm `npm run preview` renders expected content for pages touched.
- PR descriptions should state the problem, the approach, and any risks or follow-ups. Link to design specs when touching UX flows.

- Routing is client-side via `react-router-dom`; update routes in `App.jsx` and navigation components together. After login, users land directly on the dashboard; run selection now happens via the in-app run selector dialog (no separate `/select` route).
- API calls should stay in `services/` with clear error handling and typed responses where possible (via JSDoc or TS migration readiness).
- Shared charting uses `recharts`; keep chart configuration reusable and data-shape helpers in `utils/`.
- Sticky UI model: Coach/Analyst/Quant anchors live in `src/pages/Dashboard.jsx` sticky header; section bands are tinted (Health amber, Insights blue, Holdings neutral) for scannability on mobile/desktop.
