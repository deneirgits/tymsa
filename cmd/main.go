package main

import (
	"fmt"
	"tymsa/internal/auth"
	"tymsa/internal/server"
)

func main() {

	auth.NewAuth()
	auth.GetPublicKeys()

	server := server.NewServer()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
