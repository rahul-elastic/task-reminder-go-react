package store

import (
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/rahulyadav/task-reminder-go-react/backend/internal/models"
)

var ErrNotFound = errors.New("task not found")

// MemoryStore is a thread-safe in-memory task store.
// Swap this for a database-backed store later without changing handlers.
type MemoryStore struct {
	mu    sync.RWMutex
	tasks map[string]models.Task
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{tasks: make(map[string]models.Task)}
}

func (s *MemoryStore) List() []models.Task {
	s.mu.RLock()
	defer s.mu.RUnlock()

	out := make([]models.Task, 0, len(s.tasks))
	for _, t := range s.tasks {
		out = append(out, t)
	}
	return out
}

func (s *MemoryStore) Get(id string) (models.Task, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	t, ok := s.tasks[id]
	if !ok {
		return models.Task{}, ErrNotFound
	}
	return t, nil
}

func (s *MemoryStore) Create(req models.CreateTaskRequest) models.Task {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC()
	task := models.Task{
		ID:          uuid.NewString(),
		Title:       req.Title,
		Description: req.Description,
		Completed:   false,
		DueAt:       req.DueAt,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	s.tasks[task.ID] = task
	return task
}

func (s *MemoryStore) Update(id string, req models.UpdateTaskRequest) (models.Task, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	task, ok := s.tasks[id]
	if !ok {
		return models.Task{}, ErrNotFound
	}

	if req.Title != nil {
		task.Title = *req.Title
	}
	if req.Description != nil {
		task.Description = *req.Description
	}
	if req.Completed != nil {
		task.Completed = *req.Completed
	}
	if req.DueAt != nil {
		task.DueAt = req.DueAt
	}
	task.UpdatedAt = time.Now().UTC()
	s.tasks[id] = task
	return task, nil
}

func (s *MemoryStore) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.tasks[id]; !ok {
		return ErrNotFound
	}
	delete(s.tasks, id)
	return nil
}
