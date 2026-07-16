import { useState, type FormEvent } from 'react'

type Props = {
  onSubmit: (title: string, description: string, dueAt?: string) => Promise<void>
  disabled?: boolean
}

export function TaskForm({ onSubmit, disabled }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      await onSubmit(trimmed, description.trim(), dueAt || undefined)
      setTitle('')
      setDescription('')
      setDueAt('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What do you need to remember?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled || submitting}
        aria-label="Task title"
        required
      />
      <input
        type="text"
        placeholder="Optional notes"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={disabled || submitting}
        aria-label="Task description"
      />
      <input
        type="datetime-local"
        placeholder="Due date and time (optional)"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        disabled={disabled || submitting}
        aria-label="Task due date"
      />
      <button type="submit" disabled={disabled || submitting || !title.trim()}>
        {submitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}
