package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/takahiromitsui/investees-management/pkg/config"
	"github.com/takahiromitsui/investees-management/pkg/handlers"
	"github.com/takahiromitsui/investees-management/pkg/middleware"
	"github.com/takahiromitsui/investees-management/pkg/routes"
)

var appConfig config.AppConfig
var session *scs.SessionManager

func main() {
	appConfig.InProduction = false
	session = scs.New()
	session.Lifetime = 24 * time.Hour
	session.Cookie.Persist = true
	session.Cookie.SameSite = http.SameSiteLaxMode
	session.Cookie.Secure = appConfig.InProduction
	
	appConfig.Session = session

	// Create a new repository
	repo := handlers.NewRepo(&appConfig)
	handlers.SetRepository(repo)
	// Create a new middleware struct
	middlewareStruct := middleware.NewMiddlewareStruct(&appConfig)
	middleware.SetMiddlewareStruct(middlewareStruct)

	mux := http.NewServeMux()
	routes.RegisterRoutes(mux)

	stack := middleware.CreateStack(
		middleware.SessionLoad,
		middleware.Logging,
	)

	port := ":8080"
	server := http.Server{
		Addr: port,
		Handler: stack(mux),
	}

	fmt.Printf("Starting server on port %s\n", port)
	server.ListenAndServe()
}