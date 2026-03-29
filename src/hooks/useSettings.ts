import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { UserSettings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

const LS_KEY = 'user_settings'

function readLocalSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS
}

function writeLocalSettings(s: UserSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s))
}

export function useSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<UserSettings>(readLocalSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    (async () => {
      const { data } = await supabase
        .from('user_settings')
        .select('theme, language, lessons_per_week, lesson_days, start_date')
        .eq('user_id', userId)
        .single()

      if (data) {
        const s: UserSettings = {
          theme: data.theme,
          language: data.language,
          lessons_per_week: data.lessons_per_week,
          lesson_days: data.lesson_days,
          start_date: data.start_date ?? null,
        }
        setSettings(s)
        writeLocalSettings(s)
      } else {
        // No row yet — insert defaults
        await supabase.from('user_settings').insert({
          user_id: userId,
          ...DEFAULT_SETTINGS,
        })
      }
      setLoading(false)
    })()
  }, [userId])

  const updateSettings = useCallback(async (partial: Partial<UserSettings>) => {
    const next = { ...settings, ...partial }
    setSettings(next)
    writeLocalSettings(next)

    if (userId) {
      await supabase
        .from('user_settings')
        .upsert({ user_id: userId, ...next, updated_at: new Date().toISOString() })
    }
  }, [settings, userId])

  return { settings, loading, updateSettings }
}
