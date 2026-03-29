export interface Purchase {
  id: string
  user_id: string
  weeks: number
  purchased_at: string
  note: string | null
  created_at: string
}

export interface Lesson {
  id: string
  user_id: string
  lesson_date: string
  status: 'attended' | 'missed'
  note: string | null
  created_at: string
}

export interface Balance {
  totalLessons: number
  attended: number
  banked: number
  remaining: number
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'es'
  lessons_per_week: number
  lesson_days: number[] // 0=Sun, 1=Mon, ..., 6=Sat
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'en',
  lessons_per_week: 2,
  lesson_days: [1, 3],
}
