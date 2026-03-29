import { useState } from 'react'

interface Props {
  onAdd: (weeks: number, purchasedAt: string, note?: string) => Promise<void>
}

const inputCls = 'w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors'

export function AddWeeks({ onAdd }: Props) {
  const [weeks, setWeeks] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseInt(weeks)
    if (!w || w <= 0) return
    setSubmitting(true)
    await onAdd(w, date, note || undefined)
    setWeeks('')
    setNote('')
    setSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3"
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        Add Weeks
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min="1"
          placeholder="Weeks"
          value={weeks}
          onChange={e => setWeeks(e.target.value)}
          required
          className={inputCls}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className={inputCls}
        />
      </div>
      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        className={inputCls}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
      >
        Add
      </button>
    </form>
  )
}
