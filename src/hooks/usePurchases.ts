import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Purchase } from '../types'

export function usePurchases(userId: string | undefined, onMutate?: () => void) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPurchases = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('purchases')
      .select('*')
      .order('purchased_at', { ascending: false })
    setPurchases(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])

  const addWeeks = async (weeks: number, purchasedAt: string, note?: string) => {
    await supabase.from('purchases').insert({
      user_id: userId,
      weeks,
      purchased_at: purchasedAt,
      note: note || null,
    })
    await fetchPurchases()
    onMutate?.()
  }

  const deletePurchase = async (id: string) => {
    await supabase.from('purchases').delete().eq('id', id)
    await fetchPurchases()
    onMutate?.()
  }

  return { purchases, loading, addWeeks, deletePurchase }
}
