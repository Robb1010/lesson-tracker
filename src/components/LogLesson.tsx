import { useState } from 'react'

interface Props {
  onLog: (date: string, status: 'attended' | 'missed', note?: string) => Promise<void>
}

const inputCls = 'w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors'

export function LogLesson({ onLog }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<'attended' | 'missed'>('attended')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const dayOfWeek = new Date(date + 'T12:00:00').getDay()
  const isLessonDay = dayOfWeek === 1 || dayOfWeek === 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onLog(date, status, note || undefined)
    setNote('')
    setSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3"
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        Log Lesson
      </p>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setStatus('attended')}
          className={`py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            status === 'attended'
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Attended
        </button>
        <button
          type="button"
          onClick={() => setStatus('missed')}
          className={`py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            status === 'missed'
              ? 'bg-amber-500 dark:bg-amber-400 text-white dark:text-amber-950'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Missed
        </button>
      </div>
      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        className={inputCls}
      />
      {!isLessonDay && date && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Not a Monday or Wednesday
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
      >
        Log
      </button>
    </form>
  )
}
