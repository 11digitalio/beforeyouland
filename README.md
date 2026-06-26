# Before You Land

A polished Next.js MVP for a destination-specific arrival-prep dashboard. This build focuses on Tokyo, Japan for a U.S. passport holder visiting as a first-time solo traveler for under 90 days.

Checklist completion state is saved in the browser with `localStorage`. There is no backend, login, or database.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Next.js prints in the terminal, usually:

```text
http://localhost:3000
```

## Available commands

```bash
npm run dev        # start the local development server
npm run build      # create a production build
npm run start      # run the production build
npm run typecheck  # run TypeScript checks
```

## Routes

- `/` - product landing page
- `/tokyo` - interactive Tokyo checklist
- `/tokyo-travel-checklist` - SEO landing page for first-time Tokyo visitors
- `/japan-travel-apps` - draft SEO content entry
- `/japan-esim-guide` - draft SEO content entry
- `/narita-airport-arrival-guide` - draft SEO content entry

`/checklist` redirects to `/tokyo`.

## Data

Tokyo checklist content lives in `data/tokyoChecklist.ts`, with reusable types in `types/checklist.ts`.
SEO landing pages live in `data/seoPages.ts`, with reusable types in `types/seo.ts`.

## Local-only storage

- Checklist completion: `before-you-land:tokyo:completed-items`
- Email signups: `before-you-land:email-signups`
- City requests: `before-you-land:requested-cities`
