package handlers

import (
	"fmt"
	"net/http"

	"github.com/takahiromitsui/investees-management/pkg/config"
)


type Repository struct {
	App *config.AppConfig
}

// Repo the repository used by the handlers
var Repo *Repository

// NewRepo creates a new repository
func NewRepo(appConfig *config.AppConfig) *Repository {
	return &Repository {
		App: appConfig,
	}
}

// SetRepository sets the repository for the handlers
func SetRepository(repository *Repository) {
	Repo = repository
}

func (repo *Repository) Home(w http.ResponseWriter, r* http.Request) {
	fmt.Fprintf(w, "Home")
}

func (repo *Repository) About (w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "About")
}