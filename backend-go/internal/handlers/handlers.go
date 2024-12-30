package handlers

import (
	"github.com/takahiromitsui/investees-management/internal/config"
	"github.com/takahiromitsui/investees-management/internal/drivers"
	"github.com/takahiromitsui/investees-management/internal/repositories"
	"github.com/takahiromitsui/investees-management/internal/repositories/dbrepo"
)


type Repository struct {
	App *config.AppConfig
	DB repositories.DatabaseRepo
}

// Repo the repository used by the handlers
var Repo *Repository

// NewRepo creates a new repository
func NewRepo(appConfig *config.AppConfig, db *drivers.DB) *Repository {
	return &Repository {
		App: appConfig,
		DB: dbrepo.NewPostgresRepo(appConfig, db.SQL),
	}
}

// SetRepository sets the repository for the handlers
func SetRepository(repository *Repository) {
	Repo = repository
}