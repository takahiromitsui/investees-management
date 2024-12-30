package middleware

import (
	"net/http"

	"github.com/takahiromitsui/investees-management/internal/config"
)

type Middleware func(http.Handler) http.Handler

// MiddlewareStruct is a struct that holds the app configuration
type MiddlewareStruct struct {
	App *config.AppConfig
}

var MiddlewareStructInstance *MiddlewareStruct

// NewMiddlewareStruct creates a new MiddlewareStruct
func NewMiddlewareStruct(appConfig *config.AppConfig) *MiddlewareStruct {
	return &MiddlewareStruct {
		App: appConfig,
	}
}

// SetMiddlewareStruct sets the MiddlewareStruct for the middleware package
func SetMiddlewareStruct(middlewareStruct *MiddlewareStruct) {
	MiddlewareStructInstance = middlewareStruct
}

// CreateStack creates a stack of middleware
func CreateStack(xs ...Middleware) Middleware {
	return func(next http.Handler) http.Handler {
		for i:=len(xs)-1; i>=0; i-- {
			x := xs[i]
			next = x(next)
		}
		return next
	}
}

// SessionLoad loads and saves the session on every request
func SessionLoad(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		MiddlewareStructInstance.App.Session.LoadAndSave(next)
		next.ServeHTTP(w, r)
	})
}

// type wrappedWriter struct {
// 	http.ResponseWriter
// 	statusCode int
// }

// func (w *wrappedWriter) WriteHeader(code int) {
// 	w.statusCode = code
// 	w.ResponseWriter.WriteHeader(code)
// }

// Logging logs the request method, URL path, and the time it took to process the request
// func Logging(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		start := time.Now()
// 		wrapped := &wrappedWriter{
// 			ResponseWriter: w,
// 			statusCode: http.StatusOK,
// 		}
// 		next.ServeHTTP(w, r)
// 		log.Println(wrapped.statusCode, r.Method, r.URL.Path, time.Since(start))
// 	})
// }