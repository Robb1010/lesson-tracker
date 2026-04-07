# Lesson Tracker

A personal language lesson attendance tracker. Tracks purchased lesson weeks, automatically counts scheduled days as attended, and lets you mark missed lessons. Shows remaining lessons and projects when they'll run out.

Live: **https://robb1010.github.io/lesson-tracker/**

## Features

- **Auto-attendance** — scheduled lesson days are counted automatically from a start date; you only mark misses
- **Balance tracking** — total purchased, attended, banked (missed), and remaining lessons
- **Projected end date** — forecasts the date remaining lessons will be exhausted, skipping pre-marked future misses
- **Flexible schedule** — configure lessons per week and which days (any combination Mon–Sun)
- **Bilingual** — English and Spanish UI
- **Dark / light / system theme**
- **Google OAuth** via Supabase — one-click sign-in, no passwords
- **Mobile-first** — responsive layout, iOS safe areas, no input zoom on Safari

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / DB | Supabase (PostgreSQL + Google OAuth) |
| Hosting | GitHub Pages (`gh-pages` branch) |
| CI/CD | GitHub Actions → `peaceiris/actions-gh-pages` |

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project with Google OAuth enabled

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/Robb1010/lesson-tracker.git
   cd lesson-tracker
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the database setup SQL in your Supabase SQL editor:

   ```
   supabase-setup.sql
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173/lesson-tracker/`

### Other Commands

```bash
npm run build   # type-check + build to dist/
npm run lint    # ESLint
```

## Database Schema

Two tables (both with Row Level Security — users only see their own rows):

**`purchases`** — records of purchased lesson weeks

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to auth.users |
| weeks | int | number of weeks purchased |
| purchased_at | date | |
| note | text | optional |
| created_at | timestamptz | |

**`lessons`** — missed lesson records (attended days are computed automatically)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to auth.users |
| lesson_date | date | unique per user |
| status | text | `'missed'` |
| note | text | optional |
| created_at | timestamptz | |

**`user_settings`** — per-user preferences

| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | PK |
| theme | text | `'light'`, `'dark'`, or `'system'` |
| language | text | `'en'` or `'es'` |
| lessons_per_week | int | |
| lesson_days | int[] | day-of-week numbers (0=Sun, 1=Mon…) |
| start_date | date | when lesson schedule began |

**`get_user_balance()`** — Supabase RPC function
Uses `generate_series` to count all scheduled days from `start_date` to today, then subtracts missed lessons. Returns `{ total_purchased, attended, missed, remaining }`.

## Deployment

Push to `main` → GitHub Actions runs → builds `dist/` → pushes to `gh-pages` branch → served by GitHub Pages.

The workflow requires two repository secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Project Structure

```
src/
├── App.tsx                    # Auth gate + theme/i18n providers
├── types.ts                   # TypeScript interfaces + DEFAULT_SETTINGS
├── index.css                  # Tailwind import, dark mode, iOS fixes
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── calculations.ts        # calculateProjectedEndDate()
│   └── i18n.tsx               # I18nProvider, useI18n(), translations (en + es)
├── hooks/
│   ├── useAuth.ts             # Google OAuth, session state
│   ├── useSettings.ts         # DB-backed user settings, localStorage fallback
│   ├── useTheme.ts            # Applies dark class + theme-color meta
│   ├── useBalance.ts          # Calls get_user_balance() RPC
│   ├── usePurchases.ts        # Fetch + add + delete purchases
│   └── useLessons.ts          # Fetch + mark missed + delete lessons
└── components/
    ├── Auth.tsx               # Login screen
    ├── Dashboard.tsx          # Main layout
    ├── BalanceCard.tsx        # Stat cards (purchased / attended / missed / remaining)
    ├── ProjectedEndDate.tsx   # Forecasted last lesson date
    ├── AddWeeks.tsx           # Record a week purchase
    ├── LogLesson.tsx          # Mark a lesson as missed
    ├── LessonHistory.tsx      # Past lessons table with delete
    └── Settings.tsx           # Theme, language, schedule config modal
```

## Core Logic

```
remaining = (total weeks × lessons_per_week) − attended
```

- Missed lessons do **not** reduce `remaining` — they stay banked as credit
- Auto-attendance: the `get_user_balance()` RPC walks every scheduled weekday from `start_date` to today using `generate_series`, counting each as attended unless it appears in the `lessons` table as missed
- Projected end date: walks forward from tomorrow along configured lesson days until `remaining` is exhausted, skipping days already marked as future misses
