import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'

function App() {
  const { user, loading, signIn, signOut } = useAuth()
  const { dark, toggle } = useTheme()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-400">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Auth onSignIn={signIn} dark={dark} onToggleTheme={toggle} />
  }

  return <Dashboard user={user} onSignOut={signOut} dark={dark} onToggleTheme={toggle} />
}

export default App
