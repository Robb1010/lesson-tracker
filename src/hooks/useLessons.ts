import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Lesson } from '../types'

export function useLessons(userId: string | undefined, onMutate?: () => void) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLessons = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('status', 'missed')
      .order('lesson_date', { ascending: false })
    setLessons(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  const markMissed = async (lessonDate: string, note?: string) => {
    await supabase.from('lessons').upsert(
      {
        user_id: userId,
        lesson_date: lessonDate,
        status: 'missed',
        note: note || null,
      },
      { onConflict: 'user_id,lesson_date' }
    )
    await fetchLessons()
    onMutate?.()
  }

  const deleteLesson = async (id: string) => {
    await supabase.from('lessons').delete().eq('id', id)
    await fetchLessons()
    onMutate?.()
  }

  return { lessons, loading, markMissed, deleteLesson }
}
