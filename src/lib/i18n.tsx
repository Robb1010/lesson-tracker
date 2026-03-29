import { createContext, useContext } from 'react'

const translations = {
  en: {
    // Auth
    'auth.title': 'Lesson Tracker',
    'auth.subtitle': 'Track your Spanish lesson attendance',
    'auth.signIn': 'Sign in with Google',

    // Common
    'common.loading': 'Loading\u2026',

    // Dashboard
    'dashboard.title': 'Lesson Tracker',
    'dashboard.signOut': 'Sign out',
    'dashboard.history': 'History',

    // Balance
    'balance.total': 'Total',
    'balance.attended': 'Attended',
    'balance.banked': 'Banked',
    'balance.remaining': 'Remaining',

    // Projected end
    'projected.label': 'Lessons run out on',
    'projected.none': '\u2014',

    // Add weeks
    'addWeeks.title': 'Add Weeks',
    'addWeeks.weeks': 'Weeks',
    'addWeeks.note': 'Note (optional)',
    'addWeeks.add': 'Add',

    // Log lesson
    'logLesson.title': 'Mark Missed',
    'logLesson.attended': 'Attended',
    'logLesson.missed': 'Missed',
    'logLesson.note': 'Note (optional)',
    'logLesson.log': 'Log',
    'logLesson.markMissed': 'Mark as Missed',

    // History
    'history.empty': 'No lessons logged yet.',
    'history.date': 'Date',
    'history.day': 'Day',
    'history.status': 'Status',
    'history.note': 'Note',
    'history.delete': 'Delete',

    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'settings.themeSystem': 'System',
    'settings.language': 'Language',
    'settings.lessonsPerWeek': 'Lessons per week',
    'settings.lessonDays': 'Lesson days',
    'settings.startDate': 'Start date',

    // Days
    'days.mon': 'Mon',
    'days.tue': 'Tue',
    'days.wed': 'Wed',
    'days.thu': 'Thu',
    'days.fri': 'Fri',
    'days.sat': 'Sat',
    'days.sun': 'Sun',
  },
  es: {
    // Auth
    'auth.title': 'Control de Clases',
    'auth.subtitle': 'Registra la asistencia a tus clases de espa\u00f1ol',
    'auth.signIn': 'Iniciar sesi\u00f3n con Google',

    // Common
    'common.loading': 'Cargando\u2026',

    // Dashboard
    'dashboard.title': 'Control de Clases',
    'dashboard.signOut': 'Cerrar sesi\u00f3n',
    'dashboard.history': 'Historial',

    // Balance
    'balance.total': 'Total',
    'balance.attended': 'Asistidas',
    'balance.banked': 'Acumuladas',
    'balance.remaining': 'Restantes',

    // Projected end
    'projected.label': 'Las clases terminan el',
    'projected.none': '\u2014',

    // Add weeks
    'addWeeks.title': 'A\u00f1adir Semanas',
    'addWeeks.weeks': 'Semanas',
    'addWeeks.note': 'Nota (opcional)',
    'addWeeks.add': 'A\u00f1adir',

    // Log lesson
    'logLesson.title': 'Marcar Falta',
    'logLesson.attended': 'Asist\u00ed',
    'logLesson.missed': 'Falt\u00e9',
    'logLesson.note': 'Nota (opcional)',
    'logLesson.log': 'Registrar',
    'logLesson.markMissed': 'Marcar como falta',

    // History
    'history.empty': 'No hay clases registradas.',
    'history.date': 'Fecha',
    'history.day': 'D\u00eda',
    'history.status': 'Estado',
    'history.note': 'Nota',
    'history.delete': 'Eliminar',

    // Settings
    'settings.title': 'Ajustes',
    'settings.theme': 'Tema',
    'settings.themeLight': 'Claro',
    'settings.themeDark': 'Oscuro',
    'settings.themeSystem': 'Sistema',
    'settings.language': 'Idioma',
    'settings.lessonsPerWeek': 'Clases por semana',
    'settings.lessonDays': 'D\u00edas de clase',
    'settings.startDate': 'Fecha de inicio',

    // Days
    'days.mon': 'Lun',
    'days.tue': 'Mar',
    'days.wed': 'Mi\u00e9',
    'days.thu': 'Jue',
    'days.fri': 'Vie',
    'days.sat': 'S\u00e1b',
    'days.sun': 'Dom',
  },
} as const

type TranslationKey = keyof (typeof translations)['en']
type Language = keyof typeof translations

interface I18nContextValue {
  t: (key: TranslationKey) => string
  language: Language
}

const I18nContext = createContext<I18nContextValue>({
  t: (key) => key,
  language: 'en',
})

export function I18nProvider({ language, children }: { language: Language; children: React.ReactNode }) {
  const t = (key: TranslationKey): string => translations[language][key] ?? key

  return (
    <I18nContext.Provider value={{ t, language }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export type { Language, TranslationKey }
