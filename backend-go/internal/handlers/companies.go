package handlers

import (
	"github.com/takahiromitsui/investees-management/internal/helpers"
	"net/http"
)

// GetCompanies returns a list of companies
func (repo *Repository) GetCompanies(w http.ResponseWriter, r *http.Request) {
	companies, err := repo.DB.AllCompanies()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	for i := range companies {
		if companies[i].Country != nil {
			repo.App.InfoLog.Println(*companies[i].Country)
	} else {
			repo.App.InfoLog.Println("Country is nil")
	}
	}
}