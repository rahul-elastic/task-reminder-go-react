import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export const tasksApi = {
  list: () => request<Task[]>('/api/tasks'),
  create: (input: CreateTaskInput) =>
    request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateTaskInput) =>
    request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    }),
}
