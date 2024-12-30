package dbrepo

import (
	"context"
	"database/sql"
	"time"

	"github.com/takahiromitsui/investees-management/internal/models"
)

func (m *postgresDBRepo) AllCompanies() ([]models.Company, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
			SELECT 
					id, 
					name, 
					country, 
					"foundingDate", 
					description 
			FROM 
					company
			ORDER BY 
					id
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
			return nil, err
	}
	defer rows.Close()

	var companies []models.Company

	for rows.Next() {
			var company models.Company
			var country sql.NullString
			var description sql.NullString

			err := rows.Scan(
					&company.ID,
					&company.Name,
					&country,
					&company.FoundingDate,
					&description,
			)
			if err != nil {
					return nil, err
			}

			if country.Valid {
					company.Country = &country.String
			} 
			if description.Valid {
					company.Description = &description.String
			} 
			companies = append(companies, company)
	}

	if err = rows.Err(); err != nil {
			return nil, err
	}

	return companies, nil
}