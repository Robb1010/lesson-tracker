import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Lesson } from '../types'

export function useLessons(userId: string | undefined) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLessons = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .order('lesson_date', { ascending: false })
    setLessons(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  const logLesson = async (lessonDate: string, status: 'attended' | 'missed', note?: string) => {
    await supabase.from('lessons').upsert(
      {
        user_id: userId,
        lesson_date: lessonDate,
        status,
        note: note || null,
      },
      { onConflict: 'user_id,lesson_date' }
    )
    await fetchLessons()
  }

  const deleteLesson = async (id: string) => {
    await supabase.from('lessons').delete().eq('id', id)
    await fetchLessons()
  }

  return { lessons, loading, logLesson, deleteLesson }
}
