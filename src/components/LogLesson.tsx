import { useState } from 'react'
import { useI18n } from '../lib/i18n'

interface Props {
  onMark: (date: string, note?: string) => Promise<void>
}

const inputCls = 'block w-full min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors'

export function LogLesson({ onMark }: Props) {
  const { t } = useI18n()
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onMark(date, note || undefined)
    setNote('')
    setSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {t('logLesson.title')}
      </p>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
        className={inputCls}
      />
      <input
        type="text"
        placeholder={t('logLesson.note')}
        value={note}
        onChange={e => setNote(e.target.value)}
        className={inputCls}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-amber-500 dark:bg-amber-400 text-white dark:text-amber-950 text-sm font-medium py-2 rounded-lg hover:bg-amber-400 dark:hover:bg-amber-300 transition-colors disabled:opacity-40 cursor-pointer"
      >
        {t('logLesson.markMissed')}
      </button>
    </form>
  )
}
