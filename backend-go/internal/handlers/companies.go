package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/takahiromitsui/investees-management/internal/helpers"
)

// GetCompanies returns a list of companies
func (repo *Repository) GetCompanies(w http.ResponseWriter, r *http.Request) {
	companies, err := repo.DB.AllCompanies()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
    err = json.NewEncoder(w).Encode(companies)
    if err != nil {
        helpers.ServerError(w, err)
        return
    }
}