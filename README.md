# Vacation Rental Hotline — Admin Panel

Web admin panel for Vacation Rental Hotline: app users and their properties, payments, contact-form messages and admin access.

## Tech stack

- React 19 and TypeScript (strict), built with Vite 8
- Ant Design 6 for all UI, with `@ant-design/icons` and `@ant-design/plots` for charts
- React Router 8 (data router; every page is lazy-loaded)
- TanStack Query 5 for server data, axios for HTTP, dayjs for dates
- ESLint 10 with typescript-eslint, and Prettier

## Requirements

- Node.js 22.22 or later (required by React Router 8)
- npm 10 or later

## Getting started

```bash
npm ci
npm run dev
```

The dev server runs on http://localhost:3000.

### Environment variables

The API address is read from `.env`, which is committed with the production value. To use a different API, create `.env.local` (it is git-ignored) with the same variable:

```bash
VITE_API_BASE_URL=https://staging.example.com/api/v1/
```

Without an override, local development talks to the **production** API. See `.env.example`.

## Scripts

| Script                                    | What it does                                           |
| ----------------------------------------- | ------------------------------------------------------ |
| `npm run dev`                             | Start the dev server with hot reload (port 3000)       |
| `npm run build`                           | Type-check, then build the production site to `build/` |
| `npm run preview`                         | Serve the production build locally                     |
| `npm run typecheck`                       | Type-check only                                        |
| `npm run lint` / `npm run lint:fix`       | Run ESLint / fix what it can                           |
| `npm run format` / `npm run format:check` | Format with Prettier / check formatting                |

## Project structure

```
src/
  api/          HTTP client (adds the admin token, ends expired sessions), query client, shared API types
  assets/       Images bundled with the app
  components/   Shared UI: app layout, page header, form actions, delete button, truncated table text,
                error and loading states
  config/       Environment variables
  features/     One folder per business area:
    <feature>/
      api.ts        The feature's endpoints and TanStack Query keys
      types.ts      Data shapes returned by the API
      components/   Components used only by this feature
      pages/        Route components, one per URL
  routes/       Router, URL paths, sign-in guard, redirects from old URLs, 404 and error pages
  styles/       The design: theme.ts (colours, sizes, Ant Design theme) and global.css (the only stylesheet)
  utils/        Formatting, CSV export, search and error helpers
```

Features: `admins` (Access Management), `auth` (sign-in, profile, password), `contact`, `dashboard`, `payments`, `properties`, `users`.

## Conventions

- **File names:** components and pages are PascalCase (`UsersPage.tsx`) and route components end in `Page`. Other modules are camelCase (`api.ts`, `format.ts`). Feature folders are kebab-case.
- **URLs:** kebab-case and resource-based (`/admins/:adminId/edit`). Build them with `paths` from `src/routes/paths.ts` instead of string literals. URLs from the previous version of the app redirect to their new paths (`LEGACY_REDIRECTS` in `src/routes/router.tsx`).
- **Imports:** use the `@/` alias for anything outside the current feature.
- **Data:** components call the feature's `api.ts` functions through `useQuery` / `useMutation` with that feature's query keys; never call axios from a component.
- **API contract:** endpoint paths, field names, and multipart vs JSON bodies match the existing API. Change them only together with the backend.
- **UI:** Ant Design components only. Show toasts with `App.useApp().message`. Every page starts with `PageHeader`, whose title is the page's `<h1>`.
- **Styling:** the whole design lives in `src/styles`.
  - `theme.ts` holds every colour and size. The logo's blue and green are darkened just enough to meet WCAG AA contrast (4.5:1) and feed the Ant Design theme.
  - `global.css` is the only stylesheet. It reads those values through Ant Design's `--ant-*` CSS variables.
  - Components use its classes and never style themselves. ESLint rejects inline `style` props, hard-coded colours outside `theme.ts`, and any other stylesheet import.
- **Small screens:** below 768px the menu moves into a drawer opened from the header. Tables drop secondary columns on narrow screens (the column `responsive` option).

## Authentication

The admin token is kept in `localStorage` under `adminToken` and sent as the `x-access-token` header on every request (`src/api/client.ts`). The API reports an expired token as HTTP 500 "jwt expired" and a deleted admin as HTTP 403 "Admin not found."; both sign the admin out with a message. HTTP 401 means the admin's role cannot see that data, and the page shows "No access".

## Deployment

`npm run build` writes a static site to `build/`. The server must answer every path that is not a file with `index.html` (single-page-app fallback), for example:

- Apache: `FallbackResource /index.html`
- nginx: `try_files $uri /index.html;`
