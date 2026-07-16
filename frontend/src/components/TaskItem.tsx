import type { Task } from '../types/task'

type Props = {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
}

function formatDue(dueAt?: string) {
  if (!dueAt) return null
  const date = new Date(dueAt)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const dueLabel = formatDue(task.dueAt)

  return (
    <li className={`task-item${task.completed ? ' is-completed' : ''}`}>
      <label className="task-item__main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="task-item__body">
          <span className="task-item__title">{task.title}</span>
          {task.description ? (
            <span className="task-item__description">{task.description}</span>
          ) : null}
          {dueLabel ? <span className="task-item__due">Due {dueLabel}</span> : null}
        </span>
      </label>
      <button
        type="button"
        className="task-item__delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </li>
  )
}
