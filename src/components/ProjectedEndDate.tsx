import type { Lesson } from '../types'
import { calculateProjectedEndDate } from '../lib/calculations'
import { useI18n } from '../lib/i18n'

interface Props {
  remaining: number
  lessonDays: number[]
  futureMissed: Lesson[]
}

export function ProjectedEndDate({ remaining, lessonDays, futureMissed }: Props) {
  const { t, language } = useI18n()
  const endDate = calculateProjectedEndDate(remaining, lessonDays, futureMissed)

  const locale = language === 'es' ? 'es-ES' : 'en-US'
  const formatted = endDate
    ? endDate.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
      <p className="text-xs text-slate-500 dark:text-slate-400">{t('projected.label')}</p>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {formatted ?? t('projected.none')}
      </p>
    </div>
  )
}
