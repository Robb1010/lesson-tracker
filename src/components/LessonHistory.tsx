import type { Lesson } from '../types'

interface Props {
  lessons: Lesson[]
  onDelete: (id: string) => Promise<void>
}

export function LessonHistory({ lessons, onDelete }: Props) {
  if (lessons.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-6 text-center text-sm text-slate-400">
        No lessons logged yet.
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 dark:text-slate-500">Date</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 dark:text-slate-500 hidden sm:table-cell">Day</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 dark:text-slate-500">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-400 dark:text-slate-500 hidden md:table-cell">Note</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => {
              const d = new Date(lesson.lesson_date + 'T12:00:00')
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
              return (
                <tr
                  key={lesson.id}
                  className="border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                >
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 tabular-nums">
                    {lesson.lesson_date}
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 dark:text-slate-500 hidden sm:table-cell">
                    {dayName}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${
                        lesson.status === 'attended'
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 dark:text-slate-500 max-w-[200px] truncate hidden md:table-cell">
                    {lesson.note ?? ''}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => onDelete(lesson.id)}
                      className="text-xs text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors cursor-pointer"
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
    </div>
  )
}
