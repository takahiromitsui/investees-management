package routes

import (
	"net/http"

	"github.com/takahiromitsui/investees-management/pkg/handlers"
)

func RegisterCompanies(mux *http.ServeMux) {
	// GET
	mux.Handle("GET /companies", http.HandlerFunc(handlers.Repo.GetCompanies))
	// POST
}