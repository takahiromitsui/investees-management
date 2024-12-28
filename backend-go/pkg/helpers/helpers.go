package helpers

import (
	"fmt"
	"net/http"
	"runtime/debug"

	"github.com/takahiromitsui/investees-management/pkg/config"
)

var appConfig *config.AppConfig

// SetHelpers sets the app configuration for the helpers package
func SetHelpers(app *config.AppConfig) {
	appConfig = app
}

// ClientError logs a client error and sends a response with the given status code
func ClientError(rw http.ResponseWriter, status int) {
	appConfig.InfoLog.Println("Client error with status of", status)
	http.Error(rw, http.StatusText(status), status)
}

// ServerError logs a server error and sends a response with a 500 status code
func ServerError(rw http.ResponseWriter, err error) {
	trace := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
	appConfig.ErrorLog.Println(trace)
	http.Error(rw, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}