package main

import (
	"fmt"
	"net/http"

	"github.com/takahiromitsui/investees-management/pkg/config"
	"github.com/takahiromitsui/investees-management/pkg/handlers"
)


func main() {
	var appConfig config.AppConfig
	repo := handlers.NewRepo(&appConfig)
	handlers.SetRepository(repo)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /", handlers.Repo.Home)
	mux.HandleFunc("GET /about", handlers.Repo.About)
	
	if err := http.ListenAndServe("localhost:8080", mux); err != nil {
		fmt.Println(err.Error())
	}
}