import { calculateProjectedEndDate } from '../lib/calculations'

interface Props {
  remaining: number
}

export function ProjectedEndDate({ remaining }: Props) {
  const endDate = calculateProjectedEndDate(remaining)

  const formatted = endDate
    ? endDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
      <p className="text-xs text-slate-500 dark:text-slate-400">Lessons run out on</p>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {formatted ?? '—'}
      </p>
    </div>
  )
}
