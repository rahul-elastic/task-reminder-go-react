import { useState, type FormEvent } from 'react'

type Props = {
  onSubmit: (title: string, description: string) => Promise<void>
  disabled?: boolean
}

export function TaskForm({ onSubmit, disabled }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      await onSubmit(trimmed, description.trim())
      setTitle('')
      setDescription('')
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
      <button type="submit" disabled={disabled || submitting || !title.trim()}>
        {submitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}
