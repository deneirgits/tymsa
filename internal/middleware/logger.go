package middleware

import (
	"log"
	"net/http"
	"time"
)

type Logger struct {
	handler http.Handler
}

func (m *Logger) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	m.handler.ServeHTTP(w, r)
	log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
}

func NewLogger(wrappedHandler http.Handler) *Logger {
	return &Logger{wrappedHandler}
}
