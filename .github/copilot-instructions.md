# Copilot Instructions: Modernizing Sky Dark (React 19.2 / Tailwind 4 / Vite 7)

Modernize incrementally, after validating every change. Preserve the user-facing experience (UX, caching, PWA behavior) and only evolve implementation details when the new approach is demonstrably safer, faster, or easier to maintain. Keep revisions reversible and scoped to small commits.

## Priorities
- Lean into React 19.2 features that improve responsiveness (resources consumed via `use`, selective Server Components/Actions, `Suspense`, `useTransition`), but do not force them where the UI is already light-weight and client-only.
- Upgrade styling to Tailwind CSS 4.x: centralize shared pills/badges in `@layer components` (e.g., `src/styles/components.css`), move theme tokens into `tailwind.config.mjs`, and prefer inline utility classes over nested CSS rules.
- Keep the Vite 7.x toolchain slim: explicit code-splitting for heavy modules (maps, modals, radar), `import.meta.env` guards for verbose/logging differences, and metadata-driven build flags for future SSR experimentation.
- Maintain PWA/offline behavior and service worker wiring (extract registration into `src/pwa/register-sw.ts`, keep `SKYDARK_REFRESH` messaging, avoid forced reloads unless safety dictates one).

## Data + Resource Layer
- Build reusable resources under `src/lib/api/` (e.g., `weather.ts`, `airQuality.ts`, `radar.ts`) that fetch `/api/apple-weather` or related endpoints, normalize the shape, and implement the cache TTL rules from `src/modules/local-storage.js`.
- Consume those resources via `use()` from client components wrapped in appropriate `<Suspense>` boundaries (current conditions, hourly block, radar). Keep the legacy fetch path behind a feature flag until parity is verified.
- Use `useTransition` for low-priority actions (condition pills in `Hourly`, radar play/pause, day expansion toggles) so transitions stay smooth.

## Theme & Styling
- Remove obsolete `@reference` directives and adopt Tailwind layers (`@layer base/components/utilities`) inside `src/styles/components.css`.
- Relocate theme tokens (colors, gradients, semantic names) from CSS variables into `theme.extend` in `tailwind.config.mjs`, then reference them via Tailwind class names.
- Implement a `useTheme()` hook under `src/lib/theme/` that resolves system/light/dark/sunrise-sunset preferences, adds/removes `class="dark"` on `<html>`, exposes `setTheme`, and feeds resolved state to map tiles/radar styling so they stay in sync without reloads.

## Dayjs & Time
- Centralize Day.js plugin initialization in `src/lib/time/dayjs.ts` and import that module wherever date formatting is required. Avoid duplicate plugin calls across components.

## Accessibility & UX
- Remove `href="#"` on button elements and give icon-only controls (`map`, `settings`, `radar`, modals) descriptive `aria-label`s.
- Replace decorative `&nbsp;` with Tailwind spacing utilities (`ml`, `space-x`, `gap`).
- Keep SweetAlert for now but wrap it to smooth future migration to accessible portals/Headless UI; emphasize `aria` roles, focus management, and keyboard navigation.

## Testing & Validation
- Add Vitest + React Testing Library specs for `formatCondition`, `formatSummary`, and `isCacheExpired`.
- Provide resource contract tests that mock `/api/apple-weather` and assert the normalized shape (presence of `currentWeather`, hourly list, daily count, radar data, alerts, AQI).
- Add interaction tests for pill selection updates (ensuring sibling hours do not remount), radar loop controls, and daily detail expansion/collapse.
- Ensure CI runs lint/biome, stylelint, type checks (as TS surfaces emerge), and unit tests before merging. Flag manual verification steps when automation cannot cover certain UI states.

## Documentation & Tooling
- Use Context7 docs (`mcp_context7_resolve-library-id` + `mcp_context7_get-library-docs`) for reliable, up-to-date guidance on React 19.2, Tailwind 4, Vite 7, and other frameworks. Cite assumptions when referencing external sources.
- When needed, use workspace search or general web searches to support new patterns, noting the source in comments or PR descriptions.

## Migration Guidance
1. Centralize Day.js config in `src/lib/time/dayjs.ts`.
2. Implement the reactive `useTheme()` hook and remove forced page reloads for theme changes.
3. Introduce the resource layer plus `use()` consumption inside Suspense boundaries, keeping the legacy fetch path toggled by a feature flag until parity is verified.
4. Apply `useTransition` for low-priority UI updates (pills, radar controls, daily `<details>` toggles).
5. Replace legacy CSS with Tailwind utilities and component layers; keep custom CSS scoped and minimal.
6. Refine accessibility (aria-labels, button semantics, focus management) and remove redundant DOM workarounds.
7. Optimize performance (deduplicate icon registration, memoize shared slices, remove `useMemo` anti-patterns).
8. Keep tests, documentation, and changelog entries updated for every incremental step.

## General Principles
- Avoid silent behavior changes; document any user-visible regression risks or manual verification steps.
- Prefer readability and explicit intent over clever tricks or dense abstractions.
- Keep changes small, reversible, and well-validated; plan multi-step refactors across several commits when necessary.
- Suggest logical next steps or verification commands when your scope spans multiple files or systems.

End.

