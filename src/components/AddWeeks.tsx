import { useState } from 'react'

interface Props {
  onAdd: (weeks: number, purchasedAt: string, note?: string) => Promise<void>
}

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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">Add Weeks</h3>
      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          min="1"
          placeholder="Weeks"
          value={weeks}
          onChange={e => setWeeks(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 w-24"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-[150px]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Add
        </button>
      </div>
    </form>
  )
}
