# Lesson Tracker — Claude Context

## What this project is
A personal Spanish lesson attendance tracker. The user pays for "weeks" of lessons (2 per week: Mon + Wed). Missed lessons bank as credit rather than being lost. The app tracks attendance, calculates remaining lessons, and projects the date lessons will run out.

## Tech stack
- **Vite + React + TypeScript** — static SPA
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed)
- **Supabase** — PostgreSQL database + Google OAuth (client-side JS SDK)
- **GitHub Pages** — hosting (deployed to `gh-pages` branch via `peaceiris/actions-gh-pages`)

## Key commands
```bash
npm run dev      # local dev server at http://localhost:5173/lesson-tracker/
npm run build    # type-check + build to dist/
npm run lint     # eslint
```

## Environment variables
Local dev requires a `.env` file (gitignored):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
These are also set as GitHub repo secrets for the deploy workflow.

## Project structure
```
src/
├── App.tsx                    # Auth gate — shows Auth or Dashboard
├── types.ts                   # Purchase, Lesson, Balance types
├── lib/
│   ├── supabase.ts            # Supabase client (env vars)
│   └── calculations.ts        # calculateBalance(), calculateProjectedEndDate()
├── hooks/
│   ├── useAuth.ts             # Google OAuth, user state
│   ├── usePurchases.ts        # fetch + addWeeks + deletePurchase
│   └── useLessons.ts          # fetch + logLesson (upsert) + deleteLesson
└── components/
    ├── Auth.tsx               # Login screen
    ├── Dashboard.tsx          # Main layout, composes everything
    ├── BalanceCard.tsx        # 4 stat cards (total/attended/banked/remaining)
    ├── ProjectedEndDate.tsx   # Forecasted last lesson date
    ├── AddWeeks.tsx           # Form to record purchased weeks
    ├── LogLesson.tsx          # Form to log attended/missed lesson
    └── LessonHistory.tsx      # Table of past lessons with delete
```

## Database schema (Supabase)
Two tables, both with RLS (users see only their own rows):
- **`purchases`** — id, user_id, weeks (int), purchased_at (date), note, created_at
- **`lessons`** — id, user_id, lesson_date (date), status ('attended'|'missed'), note, created_at; unique on (user_id, lesson_date)

Schema SQL is in `supabase-schema.sql`.

## Core logic
- `remaining = (sum of weeks * 2) - attended_count`
- Missed lessons do NOT reduce remaining — they stay banked as available credit
- Projected end date: walk forward from tomorrow counting Mon (day 1) + Wed (day 3) until remaining is exhausted
- `logLesson` uses upsert on (user_id, lesson_date) — re-logging a date updates status

## Deployment
Push to `main` → GitHub Actions builds → pushes `dist/` to `gh-pages` branch → GitHub Pages serves it.
Live URL: https://robb1010.github.io/lesson-tracker/

## Supabase auth setup notes
- Google OAuth provider enabled in Supabase dashboard
- Redirect URLs configured in Supabase for both local (`http://localhost:5173/lesson-tracker/`) and production (`https://robb1010.github.io/lesson-tracker/`)
- The `redirectTo` in `useAuth.ts` uses `window.location.origin + import.meta.env.BASE_URL` so it works in both environments
