import type { Purchase, Lesson, Balance } from '../types'

export function calculateBalance(
  purchases: Purchase[],
  lessons: Lesson[],
  lessonsPerWeek: number
): Balance {
  const totalLessons = purchases.reduce((sum, p) => sum + p.weeks * lessonsPerWeek, 0)
  const attended = lessons.filter(l => l.status === 'attended').length
  const banked = lessons.filter(l => l.status === 'missed').length
  const remaining = totalLessons - attended

  return { totalLessons, attended, banked, remaining }
}

export function calculateProjectedEndDate(
  remainingLessons: number,
  lessonDays: number[],
  fromDate: Date = new Date()
): Date | null {
  if (remainingLessons <= 0 || lessonDays.length === 0) return null

  let count = 0
  const current = new Date(fromDate)
  current.setDate(current.getDate() + 1)

  while (count < remainingLessons) {
    const day = current.getDay()
    if (lessonDays.includes(day)) {
      count++
      if (count === remainingLessons) return new Date(current)
    }
    current.setDate(current.getDate() + 1)
  }

  return null
}
