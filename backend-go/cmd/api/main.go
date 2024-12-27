package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/takahiromitsui/investees-management/pkg/config"
	"github.com/takahiromitsui/investees-management/pkg/handlers"
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

	repo := handlers.NewRepo(&appConfig)
	handlers.SetRepository(repo)

	mux := http.NewServeMux()
	routes.RegisterRoutes(mux)
	var port = "localhost:8080"
	fmt.Printf("Starting server on port %s\n", port)

	if err := http.ListenAndServe(
		port,
		mux,
	); err != nil {
		fmt.Println(err.Error())
	}
}