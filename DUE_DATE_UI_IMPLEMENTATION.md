# Due Date UI Implementation Summary

## Changes Made

### 1. Frontend - TaskForm Component (`frontend/src/components/TaskForm.tsx`)
- **Added:** `dueAt` state to store the datetime-local input value
- **Added:** `<input type="datetime-local" />` field for selecting due date/time
- **Updated:** Form submission to pass `dueAt` parameter to `onSubmit` callback
- **Updated:** Form reset to clear `dueAt` after successful submission

**Key changes:**
```typescript
const [dueAt, setDueAt] = useState('')

// In the form:
<input
  type="datetime-local"
  placeholder="Due date and time (optional)"
  value={dueAt}
  onChange={(e) => setDueAt(e.target.value)}
  disabled={disabled || submitting}
  aria-label="Task due date"
/>

// On submit:
await onSubmit(trimmed, description.trim(), dueAt || undefined)
```

### 2. Frontend - App Component (`frontend/src/App.tsx`)
- **Updated:** `handleCreate` function signature to accept `dueAt?: string` parameter
- **Updated:** API call to pass `dueAt` to `tasksApi.create()`

**Key changes:**
```typescript
async function handleCreate(title: string, description: string, dueAt?: string) {
  setError(null)
  const created = await tasksApi.create({
    title,
    description: description || undefined,
    dueAt: dueAt || undefined,  // New
  })
  setTasks((prev) => [...prev, created])
}
```

## What Was Already in Place

✅ **Backend Support:** The Go API already had full `dueAt` support in models and handlers
✅ **Type Definitions:** TypeScript types already included `dueAt?: string` in `CreateTaskInput`
✅ **Task Display:** `TaskItem` component already had `formatDue()` helper to display due dates
✅ **CSS Styling:** `.task-item__due` class already styled in `App.css`

## How It Works End-to-End

1. **User Action:** User fills out task form with title, optional description, and optional due date/time
2. **Form Processing:** `TaskForm` captures the `datetime-local` input value
3. **API Call:** `handleCreate` sends all three fields to `/api/tasks` POST endpoint
4. **Backend Processing:** Go API receives the request with `dueAt` field (ISO 8601 string)
5. **Storage:** In-memory store saves task with `dueAt` timestamp
6. **Display:** `TaskItem` renders the due date using locale-aware formatting (e.g., "Due Jan 15, 10:30 AM")

## Testing Checklist

To test locally:

1. **Start Backend:**
   ```bash
   cd backend
   go run ./cmd/server
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install  # if needed
   npm run dev
   ```

3. **Test Cases:**
   - [ ] Create a task with title, description, and due date
   - [ ] Create a task without a due date (optional field)
   - [ ] Verify task appears in list with formatted due date
   - [ ] Verify task without due date doesn't show "Due" label
   - [ ] Toggle task completion (due date should persist)
   - [ ] Delete task (removed from list)

## Browser Compatibility

- `datetime-local` input type is supported in modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback: Older browsers may show a text input, but the ISO 8601 format still works
- Mobile: Native date/time pickers on iOS and Android

## Future Enhancements

- Add ability to edit due date on existing tasks (currently only settable on creation)
- Add due date badges with overdue warnings (e.g., red text if past due)
- Add filtering by due date (e.g., "Due today", "Due this week", "Overdue")
- Add sorting by due date
- Add timezone support if needed
