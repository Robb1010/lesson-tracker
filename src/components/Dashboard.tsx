import type { User } from '@supabase/supabase-js'
import { usePurchases } from '../hooks/usePurchases'
import { useLessons } from '../hooks/useLessons'
import { calculateBalance } from '../lib/calculations'
import { BalanceCard } from './BalanceCard'
import { ProjectedEndDate } from './ProjectedEndDate'
import { AddWeeks } from './AddWeeks'
import { LogLesson } from './LogLesson'
import { LessonHistory } from './LessonHistory'

interface Props {
  user: User
  onSignOut: () => void
}

export function Dashboard({ user, onSignOut }: Props) {
  const { purchases, addWeeks } = usePurchases(user.id)
  const { lessons, logLesson, deleteLesson } = useLessons(user.id)
  const balance = calculateBalance(purchases, lessons)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Lesson Tracker</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button
            onClick={onSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
        <BalanceCard {...balance} />
        <ProjectedEndDate remaining={balance.remaining} />
        <AddWeeks onAdd={addWeeks} />
        <LogLesson onLog={logLesson} />
        <h2 className="text-lg font-semibold text-gray-900 mt-2">Lesson History</h2>
        <LessonHistory lessons={lessons} onDelete={deleteLesson} />
      </main>
    </div>
  )
}
