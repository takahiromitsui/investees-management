package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/takahiromitsui/investees-management/pkg/config"
	"github.com/takahiromitsui/investees-management/pkg/handlers"
	"github.com/takahiromitsui/investees-management/pkg/helpers"
	"github.com/takahiromitsui/investees-management/pkg/middleware"
	"github.com/takahiromitsui/investees-management/pkg/routes"
)

var appConfig config.AppConfig
var session *scs.SessionManager
var InfoLog *log.Logger
var ErrorLog *log.Logger

func main() {
	appConfig.InProduction = false
	// Create a new logger
	appConfig.InfoLog = log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	appConfig.ErrorLog = log.New(os.Stdout, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)
	// Create a new session manager
	session = scs.New()
	session.Lifetime = 24 * time.Hour
	session.Cookie.Persist = true
	session.Cookie.SameSite = http.SameSiteLaxMode
	session.Cookie.Secure = appConfig.InProduction
	
	appConfig.Session = session
	// Set the app configuration for the helpers package
	helpers.SetHelpers(&appConfig)
	// Create a new repository => set the repository for the handlers package
	repo := handlers.NewRepo(&appConfig)
	handlers.SetRepository(repo)
	// Create a new middleware struct => set the middleware struct for the middleware package
	middlewareStruct := middleware.NewMiddlewareStruct(&appConfig)
	middleware.SetMiddlewareStruct(middlewareStruct)

	mux := http.NewServeMux()
	routes.RegisterRoutes(mux)

	stack := middleware.CreateStack(
		middleware.SessionLoad,
	)

	port := ":8080"
	server := http.Server{
		Addr: port,
		Handler: stack(mux),
	}

	fmt.Printf("Starting server on port %s\n", port)
	server.ListenAndServe()
}