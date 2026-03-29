import { useState } from 'react'

interface Props {
  onLog: (date: string, status: 'attended' | 'missed', note?: string) => Promise<void>
}

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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">Log Lesson</h3>
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStatus('attended')}
            className={`px-3 py-2 rounded cursor-pointer ${
              status === 'attended'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Attended
          </button>
          <button
            type="button"
            onClick={() => setStatus('missed')}
            className={`px-3 py-2 rounded cursor-pointer ${
              status === 'missed'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-[150px]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Log
        </button>
      </div>
      {!isLessonDay && date && (
        <p className="text-amber-600 text-sm mt-2">
          This date is not a Monday or Wednesday.
        </p>
      )}
    </form>
  )
}
