package helpers

import (
	"database/sql"
	"fmt"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/takahiromitsui/investees-management/internal/config"
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

// Helper function to convert sql.NullString to *string
func NullableStringToPointer(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}

// Helper function to convert sql.NullInt64 to *int
func NullableIntToPointer(ni sql.NullInt64) *int {
	if ni.Valid {
		val := int(ni.Int64)
		return &val
	}
	return nil
}

// Helper function to convert sql.NullTime to time.Time
func NullableTimeToTime(nt sql.NullTime) time.Time {
	if nt.Valid {
		return nt.Time
	}
	return time.Time{}
}