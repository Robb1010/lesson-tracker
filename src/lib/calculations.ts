import type { Lesson } from '../types'

// calculateBalance is now handled by the Supabase get_user_balance() RPC function.

export function calculateProjectedEndDate(
  remainingLessons: number,
  lessonDays: number[],
  futureMissed: Lesson[],
  fromDate: Date = new Date()
): Date | null {
  if (remainingLessons <= 0 || lessonDays.length === 0) return null

  const futureMissedDates = new Set(futureMissed.map(l => l.lesson_date))
  const today = fromDate.toISOString().split('T')[0]

  let count = 0
  const current = new Date(fromDate)
  current.setDate(current.getDate() + 1)

  while (count < remainingLessons) {
    const dateStr = current.toISOString().split('T')[0]
    const day = current.getDay()
    if (lessonDays.includes(day) && dateStr > today && !futureMissedDates.has(dateStr)) {
      count++
      if (count === remainingLessons) return new Date(current)
    }
    current.setDate(current.getDate() + 1)
  }

  return null
}
