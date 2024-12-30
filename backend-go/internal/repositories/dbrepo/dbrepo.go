package dbrepo

import (
	"database/sql"

	"github.com/takahiromitsui/investees-management/internal/config"
)

type postgresDBRepo struct {
	AppConfig *config.AppConfig
	DB *sql.DB
}

// NewPostgresRepo creates a new postgresDBRepo
func NewPostgresRepo(app *config.AppConfig, db *sql.DB) *postgresDBRepo {
	return &postgresDBRepo{
		AppConfig: app,
		DB: db,
	}
}