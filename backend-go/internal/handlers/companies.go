package handlers

import (
	"fmt"
	"net/http"
)

// GetCompanies returns a list of companies
func (repo *Repository) GetCompanies(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "List of companies")
}