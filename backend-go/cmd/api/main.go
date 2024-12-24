package main

import (
	"fmt"
	"net/http"

	"github.com/takahiromitsui/investees-management/pkg/config"
	"github.com/takahiromitsui/investees-management/pkg/handlers"
	"github.com/takahiromitsui/investees-management/pkg/routes"
)


func main() {
	var appConfig config.AppConfig
	repo := handlers.NewRepo(&appConfig)
	handlers.SetRepository(repo)

	mux := http.NewServeMux()
	routes.RegisterRoutes(mux)
	
	if err := http.ListenAndServe("localhost:8080", mux); err != nil {
		fmt.Println(err.Error())
	}
}