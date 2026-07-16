package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/rahulyadav/task-reminder-go-react/backend/internal/models"
	"github.com/rahulyadav/task-reminder-go-react/backend/internal/store"
)

type TaskStore interface {
	List() []models.Task
	Get(id string) (models.Task, error)
	Create(req models.CreateTaskRequest) models.Task
	Update(id string, req models.UpdateTaskRequest) (models.Task, error)
	Delete(id string) error
}

type TaskHandler struct {
	store TaskStore
}

func NewTaskHandler(s TaskStore) *TaskHandler {
	return &TaskHandler{store: s}
}

func (h *TaskHandler) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/tasks", h.list)
	mux.HandleFunc("POST /api/tasks", h.create)
	mux.HandleFunc("GET /api/tasks/{id}", h.get)
	mux.HandleFunc("PUT /api/tasks/{id}", h.update)
	mux.HandleFunc("DELETE /api/tasks/{id}", h.delete)
}

func (h *TaskHandler) list(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, h.store.List())
}

func (h *TaskHandler) get(w http.ResponseWriter, r *http.Request) {
	task, err := h.store.Get(r.PathValue("id"))
	if err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) create(w http.ResponseWriter, r *http.Request) {
	var req models.CreateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	req.Title = strings.TrimSpace(req.Title)
	if req.Title == "" {
		writeError(w, http.StatusBadRequest, "title is required")
		return
	}

	task := h.store.Create(req)
	writeJSON(w, http.StatusCreated, task)
}

func (h *TaskHandler) update(w http.ResponseWriter, r *http.Request) {
	var req models.UpdateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	if req.Title != nil {
		trimmed := strings.TrimSpace(*req.Title)
		req.Title = &trimmed
		if trimmed == "" {
			writeError(w, http.StatusBadRequest, "title cannot be empty")
			return
		}
	}

	task, err := h.store.Update(r.PathValue("id"), req)
	if err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) delete(w http.ResponseWriter, r *http.Request) {
	if err := h.store.Delete(r.PathValue("id")); err != nil {
		writeStoreError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func writeStoreError(w http.ResponseWriter, err error) {
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "task not found")
		return
	}
	writeError(w, http.StatusInternalServerError, "internal server error")
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
