import { useEffect, useState } from 'react'
import { tasksApi } from './api/tasks'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskFilter, type FilterState } from './components/TaskFilter'
import type { Task } from './types/task'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterState>({ search: '', status: 'all' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await tasksApi.list()
        if (!cancelled) {
          setTasks(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load tasks')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCreate(title: string, description: string, dueAt?: string) {
    setError(null)
    const created = await tasksApi.create({
      title,
      description: description || undefined,
      dueAt: dueAt || undefined,
    })
    setTasks((prev) => [...prev, created])
  }

  async function handleToggle(task: Task) {
    setError(null)
    try {
      const updated = await tasksApi.update(task.id, { completed: !task.completed })
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  async function handleDelete(id: string) {
    setError(null)
    try {
      await tasksApi.remove(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  const remaining = tasks.filter((t) => !t.completed).length

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (filter.status === 'open' && task.completed) return false
    if (filter.status === 'completed' && !task.completed) return false

    // Search filter
    if (filter.search.trim()) {
      const query = filter.search.toLowerCase()
      const matchesTitle = task.title.toLowerCase().includes(query)
      const matchesDescription = task.description?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesDescription) return false
    }

    return true
  })

  return (
    <div className="app">
      <header className="app__header">
        <h1>Task Reminder</h1>
        <p>Capture tasks, mark them done, clear them out.</p>
      </header>

      <main className="app__main">
        <TaskForm onSubmit={handleCreate} disabled={loading} />

        {error ? <p className="error" role="alert">{error}</p> : null}

        {loading ? (
          <p className="status">Loading tasks…</p>
        ) : (
          <>
            <div className="task-meta">
              <span>
                {remaining} open · {tasks.length} total
              </span>
            </div>
            <TaskFilter filter={filter} onChange={setFilter} />
            <TaskList tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
