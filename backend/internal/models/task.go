package models

import "time"

// Task is a single reminder item.
type Task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Completed   bool      `json:"completed"`
	DueAt       *time.Time `json:"dueAt,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// CreateTaskRequest is the body for creating a task.
type CreateTaskRequest struct {
	Title       string     `json:"title"`
	Description string     `json:"description,omitempty"`
	DueAt       *time.Time `json:"dueAt,omitempty"`
}

// UpdateTaskRequest is the body for updating a task.
type UpdateTaskRequest struct {
	Title       *string    `json:"title,omitempty"`
	Description *string    `json:"description,omitempty"`
	Completed   *bool      `json:"completed,omitempty"`
	DueAt       *time.Time `json:"dueAt,omitempty"`
}
