export type Task = {
  id: string
  title: string
  description?: string
  completed: boolean
  dueAt?: string
  createdAt: string
  updatedAt: string
}

export type CreateTaskInput = {
  title: string
  description?: string
  dueAt?: string
}

export type UpdateTaskInput = {
  title?: string
  description?: string
  completed?: boolean
  dueAt?: string
}
