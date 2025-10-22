# Repository guidelines

## Project overview
- This is a Nuxt 4 application written in TypeScript with the `<script setup>` syntax and the Composition API.
- Tailwind CSS (with the custom `brand` palette and the `shadow-soft` preset) provides all styling. Prefer utility classes over scoped CSS whenever possible.
- Aliases such as `~/` resolve to the `app/` directory; use them instead of long relative paths.

## Vue components
- Author new Vue files with `<script setup lang="ts">` and Composition API primitives (`ref`, `computed`, `watch`, etc.). Avoid the Options API.
- Declare props and emits with TypeScript types (`defineProps`, `defineEmits`). Keep helper interfaces/types close to their usage.
- Follow the existing formatting conventions: no semicolons, single quotes, trailing commas in multi-line structures, and blank lines between logical blocks.
- Keep component templates declarative. Prefer computed state and small helpers over inline logic in the template.
- Reuse existing UI atoms from `app/components/ui` when possible before creating new ones.

## Styling and accessibility
- Compose styles with Tailwind classes. Keep related classes grouped (layout → spacing → typography → colors → effects) similar to existing components.
- Respect the light/dark theme pairing by providing `dark:` variants whenever you introduce new background or text colors.
- Ensure interactive elements have accessible labels (`aria-*`, keyboard handlers) consistent with current patterns.

## Server, composables, and utilities
- Place API handlers inside `app/server/api` and export them via `defineEventHandler`. Prefer plain objects/arrays for mock data and TypeScript types for shared shapes (see `app/server/types`).
- Keep composables in `app/composables`, returning plain objects with stable references (`readonly`, `computed`) when exposing reactive state.
- Store reusable helpers in `app/utils` with named exports. Maintain pure functions unless Nuxt runtime APIs are required.

## Testing and verification
- Run `npm test` (Vitest) after non-trivial changes.
- If you add new functionality that can be unit-tested, include corresponding Vitest specs under `tests/`.
- Always show a preview of the completed task on both mobile and desktop screens.

## Miscellaneous
- Maintain Russian copywriting and tone in user-facing strings unless instructed otherwise.
- Update meta information with `useHead` when adding new pages or significant sections.
