import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

type Props = {
  tasks: Task[]
  onToggle: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add one above to get started.</p>
  }

  const sorted = [...tasks].sort(
    (a, b) => Number(a.completed) - Number(b.completed) || a.createdAt.localeCompare(b.createdAt),
  )

  return (
    <ul className="task-list">
      {sorted.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
