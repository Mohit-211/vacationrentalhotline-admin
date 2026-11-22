# Vacation Rental Hotline — Admin Panel

Web admin panel for Vacation Rental Hotline. Staff look up and manage customers and their properties, cover and billing, payments, contact-form messages, sign-in history, staff accounts and roles.

The data comes from the site's own API (the `vrh-frontend` app, under `/api`). `vrh-frontend/docs/admin-api.md` describes it. The old Node backend is retired.

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

1. Run the site locally on port 3000 with `ADMIN_APP_ORIGIN=http://localhost:5173` in its environment, so its API accepts this panel's requests. On a new database, create the first admin there:

   ```bash
   npm run admin:create -- --email you@example.com --name "Your Name"
   ```

   It prints a generated password once.

2. Run the panel:

   ```bash
   cp .env.example .env   # once; its value points at the site on port 3000
   npm ci
   npm run dev
   ```

   It opens on http://localhost:5173. The port is fixed because the API only accepts the origin set in `ADMIN_APP_ORIGIN`.

### Environment variables

Settings live in `.env`, one per machine. It is git-ignored, so a `git pull` never changes it. `.env.example` lists the settings with their values:

| Setting             | Production                              | Developing                  |
| ------------------- | --------------------------------------- | --------------------------- |
| `VITE_API_BASE_URL` | `https://vacationrentalhotline.com/api` | `http://localhost:3000/api` |

- **Read at build time.** Vite reads `.env` when it starts the dev server or builds, and builds the values into the JavaScript. After changing a value, run `npm run build` again.
- **The building machine counts.** If you build on one machine and upload `build/` to another, the building machine's `.env` is the one used.
- **Checked before building.** The dev server and the build stop with a message if `VITE_API_BASE_URL` is missing or isn't a full address.
- **No secrets.** `VITE_*` values reach every browser.

## Scripts

| Script                                    | What it does                                           |
| ----------------------------------------- | ------------------------------------------------------ |
| `npm run dev`                             | Start the dev server with hot reload (port 5173)       |
| `npm run build`                           | Type-check, then build the production site to `build/` |
| `npm run preview`                         | Serve the production build locally                     |
| `npm run typecheck`                       | Type-check only                                        |
| `npm run lint` / `npm run lint:fix`       | Run ESLint / fix what it can                           |
| `npm run format` / `npm run format:check` | Format with Prettier / check formatting                |

## Project structure

```
src/
  api/          HTTP client (cookie session, 401 handling), query client, paging helper, shared API types
  assets/       Images bundled with the app
  components/   Shared UI: app layout, page header, search field, form actions, delete button,
                one-time password and reset dialogs, truncated table text, error and loading states
  config/       Environment variables, and the time zone and date formats
  features/     One folder per business area:
    <feature>/
      api.ts        The feature's endpoints and TanStack Query keys
      types.ts      Data shapes returned by the API
      components/   Components used only by this feature
      pages/        Route components, one per URL
  routes/       Router, URL paths, menu, sign-in and permission guards, redirects from old URLs, 404 and error pages
  styles/       The design: theme.ts (colours, sizes, Ant Design theme) and global.css (the only stylesheet)
  utils/        Formatting, CSV export, list state in the URL, forms, errors, phone and device helpers
```

Features:

- `auth`: sign-in, forgot and reset password, profile, change password, permissions
- `dashboard`
- `customers`, `properties` (cover: cancel renewal, end or move it; notes), `payments`
- `messages` (contact forms), `sign-ins`
- `staff`, `roles`
- `locations`: countries and states for addresses

## Conventions

- **File names:** components and pages are PascalCase (`CustomersPage.tsx`) and route components end in `Page`. Other modules are camelCase (`api.ts`, `format.ts`). Feature folders are kebab-case.
- **URLs:** kebab-case and resource-based (`/staff/:staffId/edit`). Build them with `paths` from `src/routes/paths.ts` instead of string literals. URLs from earlier versions of the panel redirect to their new pages (`LEGACY_REDIRECTS` in `src/routes/router.tsx`).
- **Imports:** use the `@/` alias for anything outside the current feature.
- **Data:** components call the feature's `api.ts` functions through `useQuery` / `useMutation` with that feature's query keys; never call axios from a component.
- **Lists:** the API searches and pages them. A list's page, search and filters live in the URL (`useListParams`), so going back from a record returns to the same place.
- **API contract** (details in `vrh-frontend/docs/admin-api.md`):
  - **Bodies and fields:** JSON bodies, camelCase fields, UUID ids, money in cents.
  - **Responses:** answers are `{ data }`, with `{ meta }` added to lists. Errors are `{ error: { code, message, fields } }`, except the sign-in endpoints, which answer `{ code, message }` (`src/utils/errors.ts` reads both).
  - **Forms:** show per-field errors with `showFieldErrors` (`src/utils/forms.ts`).
  - **Requests:** paths start with `/`, and no custom headers: the API's CORS allows only `Content-Type`.
  - **Sign-in:** staff's own endpoints are under `/admin/auth`. The website's `/auth` is for customers and refuses staff.
- **Permissions:** the menu, pages and buttons follow the signed-in role's permissions (`useAuth().can(...)`, `NAV_ITEMS` in `src/routes/navigation.tsx`). The API checks every call as well.
- **Dates:** every date and time is shown in US Eastern time (Florida) as MM/DD/YYYY, whatever the viewer's time zone. Use `formatDate` / `formatDateTime`; the zone and formats are set in `src/config/locale.ts`.
- **UI:** Ant Design components only. Show toasts with `App.useApp().message`. Every page starts with `PageHeader`, whose title is the page's `<h1>`.
- **Styling:** the whole design lives in `src/styles`.
  - `theme.ts` holds every colour and size. The logo's blue and green are darkened just enough to meet WCAG AA contrast (4.5:1) and feed the Ant Design theme.
  - `global.css` is the only stylesheet. It reads those values through Ant Design's `--ant-*` CSS variables.
  - Components use its classes and never style themselves. ESLint rejects inline `style` props, hard-coded colours outside `theme.ts`, and any other stylesheet import.
- **Small screens:** below 768px the menu moves into a drawer opened from the header. Tables drop or stack secondary columns on narrow screens, so none of them scrolls sideways.

## Authentication

Staff have their own sign-in, separate from customers' on the website: `POST /admin/auth/sign-in/email`, and the other `/admin/auth/...` endpoints for signing out and passwords. The session is its own httpOnly cookie (`vrh_admin.session_token`) that scripts can't read; the panel stores no token. Signing in or out of the panel never touches a website login in the same browser.

- **On load and after sign-in:** the panel asks `GET /admin/me` who is signed in and what their role allows.
- **Errors:** a 401 from any call ends the session in the panel and returns to the sign-in page. A 403 means the role lacks a permission, and the page shows "No access".
- **Staying signed in:** only `GET /admin/auth/get-session` renews the cookie. The panel calls it on load and when it is used again after a few hours, so active staff stay signed in past the cookie's 7 days.
- **Customer accounts:** the API refuses them here (403 `CUSTOMER_ACCOUNT`), and the sign-in page tells them to sign in on the website.

## Deployment

On the server, keep a `.env` with the production value from the table above, then run `npm run build`. It writes a static site to `build/`.

Serve it on a subdomain of the site, such as `https://admin.vacationrentalhotline.com`. The session cookie only works between addresses of the same site.

The site's server must set `ADMIN_APP_ORIGIN` to exactly that origin (scheme, host and port). Otherwise the API refuses the panel's requests.

The panel's web server must answer every path that is not a file with `index.html` (single-page-app fallback), for example:

- Apache: `FallbackResource /index.html`
- nginx: `try_files $uri /index.html;`
