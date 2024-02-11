package middleware

import "net/http"

type ValidateAuth struct {
	handler http.Handler
}

func (m *ValidateAuth) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// TODO: offline validation
	// TODO: redirect to login if token expired/invalid
	m.handler.ServeHTTP(w, r)
}

func NewValidateAuth(wrappedHandler http.Handler) *ValidateAuth {
	return &ValidateAuth{wrappedHandler}
}
