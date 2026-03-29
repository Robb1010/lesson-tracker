import type { Balance } from '../types'

export function BalanceCard({ totalLessons, attended, banked, remaining }: Balance) {
  const cards = [
    { label: 'Total Lessons', value: totalLessons, color: 'text-gray-900' },
    { label: 'Attended', value: attended, color: 'text-green-600' },
    { label: 'Banked', value: banked, color: 'text-amber-600' },
    { label: 'Remaining', value: remaining, color: 'text-blue-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
