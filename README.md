# HamList

HamList is a mobile-first shared-list and everyday-planning app for individuals and small groups. It is designed for many kinds of groups—not only households—including friends, trips, personal projects and small teams. The initial interface supports Persian (RTL) and English (LTR), with a clean white-and-violet light theme and a midnight indigo/slate dark theme.

> **Current state:** HamList is a frontend-only interactive preview. The UI uses clearly identified sample data stored locally in the current browser. PWA groundwork now includes a manifest, app icons, production service-worker registration, public static-asset caching and an offline fallback. Offline list editing/sync, a backend, real accounts, invitation acceptance, cross-device sync, push notifications and payment processing are not implemented.

## Getting started

### Requirements

- Node.js 20 or later
- npm 10 or later

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server binds to `0.0.0.0` for preview environments. The service worker is registered in production only; use `npm run build && npm start` over HTTPS (or localhost) to test PWA installation and the offline fallback.

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build the static Storybook site |

## Frontend stack

- Next.js App Router and React
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible component conventions, Radix UI primitives and Lucide icons
- Storybook for component development and documentation
- `next-themes` for light/dark theme preference
- Browser `localStorage` for preview preferences and demo data only

## Product preview

The current UI includes:

- A responsive dashboard with overview statistics, shared spaces, recent activity and tasks
- Space discovery, creation and detail views, with sample member and invitation states
- Shared list creation and rename/delete with undo, plus item editing, optional notes/quantities, completion, filtering and reordering
- Task creation and completion, plus reminder and expense preview screens
- Settings for Persian/English, RTL/LTR and light/dark appearance
- A sample invitation preview route at `/invite/[token]`
- Responsive desktop navigation and a mobile bottom navigation bar

Every action that is local-only or not backed by a real service is identified in the interface. Changes made to lists, tasks, spaces, expenses and display preferences remain in the current browser and can be cleared from **Settings → Reset sample data**.

## Storybook

Storybook is configured under `.storybook/`. Component stories live alongside the frontend in `src/stories/`. Run `npm run storybook` to inspect the button, badge, statistics card and space card components. The Storybook canvas uses the same theme tokens and locally bundled Vazirmatn font as the app.

## Repository map

```text
src/
  app/                 Next.js routes and global styles
  components/          Layout, HamList patterns and reusable UI primitives
  lib/                 Demo data, translations and small utilities
  providers/           Locale and browser-local demo state
  stories/             Storybook component stories
.storybook/            Storybook configuration
public/fonts/          Locally bundled Vazirmatn variable font
public/icons/          PWA standard and maskable icons
public/sw.js            Versioned public-asset service worker
public/offline.html     Bilingual offline fallback
wireframes/            Earlier standalone interactive wireframe
 docs/                  Product and planning documents
```

The analysis and planning documents are maintained in their original languages. The project README is intentionally English throughout.

## Product and planning documents

- [Pre-implementation analysis (Persian)](docs/PRE_IMPLEMENTATION_ANALYSIS_FA.md)
- [Competitor analysis (Persian)](docs/COMPETITOR_ANALYSIS_FA.md)
- [Product brief](docs/PRODUCT_BRIEF.md)
- [Business flows](docs/BUSINESS_FLOWS.md)
- [Information architecture](docs/INFORMATION_ARCHITECTURE.md)
- [Wireframe notes](docs/WIREFRAME.md)
- [Decision log](docs/DECISIONS.md)
- [PWA requirements](docs/PWA_SPEC.md)
- [MVP backlog and release plan](docs/MVP_BACKLOG.md)
- [Standalone interactive wireframe](wireframes/hamlist-wireframe.html)

## Product direction and boundaries

The product direction is a mobile-first, installable PWA with desktop web support. The current service worker caches public static assets only and returns a clear offline fallback; it does not cache personal data or queue writes. Reliable offline list editing, conflict handling, account/authentication, secure invitations, shared cloud storage, push notifications, production expense features and backend architecture remain later-phase work, guided by the existing product documents and validated decisions.

The product name is **HamList**. The design uses violet accents without brown or gold; the dark theme uses midnight indigo/slate and cool violet/periwinkle. Reference products and screenshots informed the visual direction only—unrelated appreciation, wallet and rewards features are not part of HamList.
