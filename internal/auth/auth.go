package auth

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"math/big"
	"net/http"
	"os"

	"strconv"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/openidConnect"
)

var (
	key     = os.Getenv("SECRET_KEY")
	isProd  = os.Getenv("IS_PROD")
	RSAKeys map[string]*rsa.PublicKey
)

const MaxAge = 86400 * 30 // 1 month

func NewAuth() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	clientId := os.Getenv("SSO_CLIENT_ID")
	clientSecret := os.Getenv("SSO_CLIENT_SECRET")

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
		os.Getenv("SSO_DISCOVERY_URL"),
	)
	if err != nil {
		panic(err)
	}
	if openidConnect != nil {
		goth.UseProviders(openidConnect)
	}
}

func GetPublicKeys() {
	RSAKeys = make(map[string]*rsa.PublicKey)
	var body map[string]interface{}
	keys_url := os.Getenv("SSO_KEYS_URL")

	res, err := http.Get(keys_url)
	if err != nil {
		panic("Failed to get RSA public keys")
	}
	json.NewDecoder(res.Body).Decode(&body)

	for _, bodyKey := range body["keys"].([]interface{}) {
		key := bodyKey.(map[string]interface{})
		kid := key["kid"].(string)
		rsaKey := new(rsa.PublicKey)
		number, err := base64.RawURLEncoding.DecodeString(key["n"].(string))
		if err != nil {
			panic("Failed to decode key")
		}

		rsaKey.N = new(big.Int).SetBytes(number)
		rsaKey.E = 65537 // base64-encoded "AQAB"
		RSAKeys[kid] = rsaKey

	}
}
