package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"tymsa/components"
	"tymsa/internal/middleware"

	"github.com/markbates/goth/gothic"
)

var (
	isProd = os.Getenv("IS_PROD")
)

func (s *Server) RegisterRoutes() http.Handler {
	fs := http.FileServer(http.Dir("static"))
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", s.AppHandler)
	mux.HandleFunc("GET /auth", s.beginAuthProvider)
	mux.HandleFunc("GET /auth/callback", s.getAuthCallback)
	mux.Handle("GET /static/*", http.StripPrefix("/static/", fs))

	var wrappedMux http.Handler = middleware.NewValidateAuth(mux)

	isProd, err := strconv.ParseBool(isProd)
	if err != nil {
		isProd = false
	}

	if !isProd {
		wrappedMux = middleware.NewLogger(wrappedMux)
	}

	return wrappedMux
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

	fmt.Println(user.AccessToken, user.RefreshToken)

	http.Redirect(w, r, "http://localhost:8080", http.StatusFound)
}

func (s *Server) beginAuthProvider(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	q.Add("provider", "openid-connect")
	r.URL.RawQuery = q.Encode()

	_, err := gothic.CompleteUserAuth(w, r)
	if err == nil {
		fmt.Fprintln(w, err)
		return
	} else {
		gothic.BeginAuthHandler(w, r)
	}

}
