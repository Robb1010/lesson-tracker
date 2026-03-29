import { useEffect } from 'react'
import type { UserSettings } from '../types'

export function useApplyTheme(theme: UserSettings['theme']) {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

    function apply() {
      const dark =
        theme === 'dark' || (theme === 'system' && prefersDark.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.querySelectorAll('meta[name="theme-color"]').forEach(el => {
        el.setAttribute('content', dark ? '#0f172a' : '#ffffff')
      })
    }

    apply()
    // Re-apply if system preference changes while on 'system'
    prefersDark.addEventListener('change', apply)
    return () => prefersDark.removeEventListener('change', apply)
  }, [theme])
}
