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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <p className="text-sm text-gray-500">Lessons run out on</p>
      <p className="text-lg font-semibold text-gray-900">
        {formatted ?? 'No lessons remaining'}
      </p>
    </div>
  )
}
