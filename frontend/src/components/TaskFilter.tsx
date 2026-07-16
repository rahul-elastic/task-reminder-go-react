import type { ChangeEvent } from 'react'

export type FilterState = {
  search: string
  status: 'all' | 'open' | 'completed'
}

type Props = {
  filter: FilterState
  onChange: (filter: FilterState) => void
}

export function TaskFilter({ filter, onChange }: Props) {
  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    onChange({ ...filter, search: e.target.value })
  }

  function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange({ ...filter, status: e.target.value as FilterState['status'] })
  }

  return (
    <div className="task-filter">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filter.search}
        onChange={handleSearchChange}
        aria-label="Search tasks"
        className="task-filter__search"
      />
      <select
        value={filter.status}
        onChange={handleStatusChange}
        aria-label="Filter by status"
        className="task-filter__status"
      >
        <option value="all">All tasks</option>
        <option value="open">Open only</option>
        <option value="completed">Completed only</option>
      </select>
    </div>
  )
}
