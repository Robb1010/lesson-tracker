import { useState, useEffect } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    // Keep browser chrome color in sync with theme toggle
    document.querySelectorAll('meta[name="theme-color"]').forEach(el => {
      el.setAttribute('content', dark ? '#0f172a' : '#ffffff')
    })
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}
