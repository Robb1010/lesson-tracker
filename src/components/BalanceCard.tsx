import type { Balance } from '../types'

export function BalanceCard({ totalLessons, attended, banked, remaining }: Balance) {
  const cards = [
    { label: 'Total', value: totalLessons, color: 'text-slate-900 dark:text-slate-100' },
    { label: 'Attended', value: attended, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Banked', value: banked, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Remaining', value: remaining, color: 'text-blue-600 dark:text-blue-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ label, value, color }) => (
        <div
          key={label}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
