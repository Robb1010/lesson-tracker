import { useAuth } from './hooks/useAuth'
import { useSettings } from './hooks/useSettings'
import { useApplyTheme } from './hooks/useTheme'
import { I18nProvider } from './lib/i18n'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'

function App() {
  const { user, loading: authLoading, signIn, signOut } = useAuth()
  const { settings, loading: settingsLoading, updateSettings } = useSettings(user?.id)

  useApplyTheme(settings.theme)

  const loading = authLoading || (user && settingsLoading)

  return (
    <I18nProvider language={settings.language}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <p className="text-slate-400">{'\u2026'}</p>
        </div>
      ) : !user ? (
        <Auth onSignIn={signIn} />
      ) : (
        <Dashboard
          user={user}
          onSignOut={signOut}
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      )}
    </I18nProvider>
  )
}

export default App
