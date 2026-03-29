import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { UserSettings } from '../types'
import { usePurchases } from '../hooks/usePurchases'
import { useLessons } from '../hooks/useLessons'
import { calculateBalance } from '../lib/calculations'
import { useI18n } from '../lib/i18n'
import { BalanceCard } from './BalanceCard'
import { ProjectedEndDate } from './ProjectedEndDate'
import { AddWeeks } from './AddWeeks'
import { LogLesson } from './LogLesson'
import { LessonHistory } from './LessonHistory'
import { Settings } from './Settings'

interface Props {
  user: User
  onSignOut: () => void
  settings: UserSettings
  onUpdateSettings: (partial: Partial<UserSettings>) => void
}

export function Dashboard({ user, onSignOut, settings, onUpdateSettings }: Props) {
  const { t } = useI18n()
  const [showSettings, setShowSettings] = useState(false)
  const { purchases, addWeeks } = usePurchases(user.id)
  const { lessons, logLesson, deleteLesson } = useLessons(user.id)
  const balance = calculateBalance(purchases, lessons, settings.lessons_per_week)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t('dashboard.title')}
          </h1>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-slate-400 dark:text-slate-500">
              {user.email}
            </span>
            <button
              onClick={() => setShowSettings(true)}
              aria-label={t('settings.title')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button
              onClick={onSignOut}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded cursor-pointer transition-colors"
            >
              {t('dashboard.signOut')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
        <BalanceCard {...balance} />
        <ProjectedEndDate remaining={balance.remaining} lessonDays={settings.lesson_days} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AddWeeks onAdd={addWeeks} />
          <LogLesson onLog={logLesson} />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          {t('dashboard.history')}
        </p>
        <LessonHistory lessons={lessons} onDelete={deleteLesson} />
      </main>

      {showSettings && (
        <Settings
          settings={settings}
          onUpdate={onUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
