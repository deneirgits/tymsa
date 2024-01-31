package auth

import (
	"os"

	"strconv"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/openidConnect"
)

var (
	key    = os.Getenv("SECRET_KEY")
	isProd = os.Getenv("IS_PROD")
)

const MaxAge = 86400 * 30 // 1 month

func NewAuth() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	clientId := os.Getenv("KEYCLOAK_CLIENT_ID")
	clientSecret := os.Getenv("KEYCLOAK_CLIENT_SECRET")

	store := sessions.NewCookieStore([]byte(key))
	store.MaxAge(MaxAge)

	isProd, err := strconv.ParseBool(isProd)
	if err != nil {
		isProd = false
	}

	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = isProd

	gothic.Store = store

	openidConnect, err := openidConnect.New(
		clientId,
		clientSecret,
		"http://localhost:8080/auth/callback",
		os.Getenv("KEYCLOAK_DISCOVERY_URL"),
	)
	if err != nil {
		panic(err)
	}
	if openidConnect != nil {
		goth.UseProviders(openidConnect)
	}
}
