package server

import (
	"fmt"
	"net/http"

	"tymsa/components"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/markbates/goth/gothic"
)

func (s *Server) RegisterRoutes() http.Handler {
	fs := http.FileServer(http.Dir("static"))
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/", s.AppHandler)
	r.Get("/auth", s.beginAuthProvider)
	r.Get("/auth/callback", s.getAuthCallback)
	r.Handle("/static/*", http.StripPrefix("/static/", fs))

	return r
}

func (s *Server) AppHandler(w http.ResponseWriter, r *http.Request) {
	components.Index().Render(r.Context(), w)
}

func (s *Server) getAuthCallback(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	q.Add("provider", "openid-connect")
	r.URL.RawQuery = q.Encode()

	user, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}

	fmt.Println(user)

	http.Redirect(w, r, "http://localhost:8080", http.StatusFound)
}

func (s *Server) beginAuthProvider(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	q.Add("provider", "openid-connect")
	r.URL.RawQuery = q.Encode()

	gothic.BeginAuthHandler(w, r)
}
