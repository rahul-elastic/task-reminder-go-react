package main

import (
	"log"
	"net/http"
	"os"

	"github.com/rahulyadav/task-reminder-go-react/backend/internal/handlers"
	"github.com/rahulyadav/task-reminder-go-react/backend/internal/store"
)

func main() {
	addr := ":8080"
	if v := os.Getenv("PORT"); v != "" {
		addr = ":" + v
	}

	taskStore := store.NewMemoryStore()
	taskHandler := handlers.NewTaskHandler(taskStore)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})
	taskHandler.Register(mux)

	log.Printf("task reminder API listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, handlers.WithCORS(mux)); err != nil {
		log.Fatal(err)
	}
}
