# Search & Filter Feature

## Overview

Added comprehensive search and filtering capabilities to the task reminder app. Users can now:
- **Search** tasks by title or description (case-insensitive, substring matching)
- **Filter** by completion status (All, Open only, Completed only)
- **Combine** search and filter for powerful task management

## Components

### TaskFilter Component (`frontend/src/components/TaskFilter.tsx`)

New React component that provides the UI for searching and filtering.

**Props:**
```typescript
type Props = {
  filter: FilterState
  onChange: (filter: FilterState) => void
}

type FilterState = {
  search: string
  status: 'all' | 'open' | 'completed'
}
```

**Features:**
- Text input for searching task titles and descriptions
- Select dropdown for status filtering (All, Open, Completed)
- Real-time filtering (updates as user types/selects)
- Accessible with proper aria-labels

**Styling:**
- Grid layout: search field takes up 1fr, status dropdown is auto-sized
- Consistent with form styling (borders, focus states, transitions)
- Respects design tokens for colors and spacing

## App.tsx Changes

### New State
```typescript
const [filter, setFilter] = useState<FilterState>({ search: '', status: 'all' })
```

### Filter Logic
```typescript
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
```

**Filtering behavior:**
1. Status filter runs first (can eliminate completed/open tasks)
2. Search filter runs second (checks if query appears in title OR description)
3. Both filters must pass for a task to appear
4. All matching is case-insensitive
5. Search does substring matching (partial words work)

### Render Changes
- TaskFilter component added between task-meta and TaskList
- TaskList now receives `filteredTasks` instead of `tasks`
- Task counts (remaining/total) still reflect ALL tasks, not filtered results

## CSS Updates

Added to `frontend/src/App.css`:

```css
.task-filter {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.65rem;
  align-items: center;
}

.task-filter__search {
  /* Text input styling */
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.task-filter__search:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.task-filter__status {
  /* Select dropdown styling */
  padding: 0.85rem 1rem;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.task-filter__status:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
```

**Layout:**
- Search input takes full width (1fr)
- Status dropdown takes only as much space as needed (auto)
- Both aligned vertically (center)
- Consistent spacing and styling with form inputs

## Usage Examples

1. **Find a task by name:**
   - Type "grocery" → shows only tasks with "grocery" in title or description

2. **View only incomplete tasks:**
   - Select "Open only" → shows only incomplete tasks

3. **Find incomplete tasks matching a keyword:**
   - Type "urgent" AND Select "Open only" → shows incomplete tasks with "urgent" in title/description

4. **View completed tasks:**
   - Select "Completed only" → shows only completed tasks

## Testing Checklist

- [ ] Create multiple tasks with different titles and descriptions
- [ ] Type in search field and verify results filter in real-time
- [ ] Change status dropdown and verify filtering works
- [ ] Combine search + status filtering
- [ ] Verify search is case-insensitive (search "TODO" matches "todo")
- [ ] Verify search matches partial words ("task" matches "tasklist")
- [ ] Toggle task completion and verify search results update
- [ ] Delete a task and verify search results update
- [ ] Clear search field and verify all matching tasks appear again
- [ ] Verify task counts (open/total) still show all tasks, not filtered

## Performance Considerations

- Filter logic runs on every render when tasks or filter state changes
- For typical use cases (100-1000 tasks), performance is negligible
- String matching is done with `.includes()` (O(n) per task)
- Total complexity: O(n) where n = number of tasks
- If performance becomes an issue, consider:
  - Memoizing filteredTasks with `useMemo`
  - Debouncing search input
  - Full-text search on backend

## Future Enhancements

1. **Advanced search:**
   - Search only in titles or descriptions
   - Regular expression support
   - Date range filtering (e.g., "due within 7 days")

2. **Saved filters:**
   - Save filter presets (e.g., "My urgent tasks")
   - Remember last used filter on page reload

3. **Sort options:**
   - Sort by due date
   - Sort by creation date (newest/oldest)
   - Sort by title (A-Z)

4. **Smart filters:**
   - "Overdue" filter (past due date)
   - "Due soon" filter (due within 7 days)
   - "No due date" filter

5. **Keyboard shortcuts:**
   - Cmd+F / Ctrl+F to focus search
   - Arrow keys to navigate results
