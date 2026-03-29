import type { Lesson } from '../types'

interface Props {
  lessons: Lesson[]
  onDelete: (id: string) => Promise<void>
}

export function LessonHistory({ lessons, onDelete }: Props) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-gray-500">
        No lessons logged yet.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Date</th>
            <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Day</th>
            <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Status</th>
            <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Note</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {lessons.map(lesson => {
            const d = new Date(lesson.lesson_date + 'T12:00:00')
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
            return (
              <tr key={lesson.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2 text-sm">{lesson.lesson_date}</td>
                <td className="px-4 py-2 text-sm">{dayName}</td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      lesson.status === 'attended'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {lesson.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{lesson.note ?? ''}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onDelete(lesson.id)}
                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
