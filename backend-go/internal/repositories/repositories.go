package repositories

import "github.com/takahiromitsui/investees-management/internal/models"

type DatabaseRepo interface {
	AllCompanies() ([]models.Company, error)
}