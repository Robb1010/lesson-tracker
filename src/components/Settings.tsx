import type { UserSettings } from '../types'
import { useI18n } from '../lib/i18n'

interface Props {
  settings: UserSettings
  onUpdate: (partial: Partial<UserSettings>) => void
  onClose: () => void
}

const DAY_KEYS = ['days.sun', 'days.mon', 'days.tue', 'days.wed', 'days.thu', 'days.fri', 'days.sat'] as const
// Display order: Mon–Sun (1,2,3,4,5,6,0)
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function Settings({ settings, onUpdate, onClose }: Props) {
  const { t } = useI18n()

  const toggleDay = (day: number) => {
    const days = settings.lesson_days.includes(day)
      ? settings.lesson_days.filter(d => d !== day)
      : [...settings.lesson_days, day].sort((a, b) => a - b)
    onUpdate({ lesson_days: days })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50" />
      <div
        className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t('settings.title')}
          </p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Theme */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {t('settings.theme')}
          </legend>
          <div className="grid grid-cols-3 gap-1.5">
            {(['light', 'dark', 'system'] as const).map(v => (
              <button
                key={v}
                onClick={() => onUpdate({ theme: v })}
                className={`py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  settings.theme === v
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t(`settings.theme${v.charAt(0).toUpperCase() + v.slice(1)}` as 'settings.themeLight')}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Language */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {t('settings.language')}
          </legend>
          <div className="grid grid-cols-2 gap-1.5">
            {([['en', 'English'], ['es', 'Español']] as const).map(([code, label]) => (
              <button
                key={code}
                onClick={() => onUpdate({ language: code })}
                className={`py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  settings.language === code
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Lessons per week */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {t('settings.lessonsPerWeek')}
          </legend>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <button
                key={n}
                onClick={() => onUpdate({ lessons_per_week: n })}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  settings.lessons_per_week === n
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Start date */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {t('settings.startDate')}
          </legend>
          <input
            type="date"
            value={settings.start_date ?? ''}
            onChange={e => onUpdate({ start_date: e.target.value || null })}
            className="block w-full min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </fieldset>

        {/* Lesson days */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {t('settings.lessonDays')}
          </legend>
          <div className="flex items-center gap-1.5">
            {DAY_ORDER.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  settings.lesson_days.includes(day)
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t(DAY_KEYS[day])}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  )
}
