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
