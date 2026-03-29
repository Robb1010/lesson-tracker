import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Balance } from '../types'

const DEFAULT_BALANCE: Balance = { totalLessons: 0, attended: 0, banked: 0, remaining: 0 }

export function useBalance(userId: string | undefined) {
  const [balance, setBalance] = useState<Balance>(DEFAULT_BALANCE)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase.rpc('get_user_balance')
    if (data) setBalance(data as Balance)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { balance, loading, refresh }
}
