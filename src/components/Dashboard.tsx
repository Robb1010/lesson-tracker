import type { User } from '@supabase/supabase-js'
import { usePurchases } from '../hooks/usePurchases'
import { useLessons } from '../hooks/useLessons'
import { calculateBalance } from '../lib/calculations'
import { BalanceCard } from './BalanceCard'
import { ProjectedEndDate } from './ProjectedEndDate'
import { AddWeeks } from './AddWeeks'
import { LogLesson } from './LogLesson'
import { LessonHistory } from './LessonHistory'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  user: User
  onSignOut: () => void
  dark: boolean
  onToggleTheme: () => void
}

export function Dashboard({ user, onSignOut, dark, onToggleTheme }: Props) {
  const { purchases, addWeeks } = usePurchases(user.id)
  const { lessons, logLesson, deleteLesson } = useLessons(user.id)
  const balance = calculateBalance(purchases, lessons)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Lesson Tracker
          </h1>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-slate-400 dark:text-slate-500">
              {user.email}
            </span>
            <ThemeToggle dark={dark} onToggle={onToggleTheme} />
            <button
              onClick={onSignOut}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded cursor-pointer transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
        <BalanceCard {...balance} />
        <ProjectedEndDate remaining={balance.remaining} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AddWeeks onAdd={addWeeks} />
          <LogLesson onLog={logLesson} />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          History
        </p>
        <LessonHistory lessons={lessons} onDelete={deleteLesson} />
      </main>
    </div>
  )
}
