package dbrepo

import (
	"context"
	"database/sql"
	"time"

	"github.com/takahiromitsui/investees-management/internal/helpers"
	"github.com/takahiromitsui/investees-management/internal/models"
)

func (m *postgresDBRepo) AllCompanies() ([]models.Company, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
			SELECT 
					company.id, 
					company.name, 
					company.country, 
					company."foundingDate", 
					company.description,
					deal.id,
					deal.date,
					deal."fundingAmount",
					deal."fundingRound",
					deal."companyId"
			FROM 
					company
			LEFT JOIN
					deal ON company.id = deal."companyId"
			ORDER BY 
					company.id
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
			return nil, err
	}
	defer rows.Close()

	companyMap := make(map[int]*models.Company)

	for rows.Next() {
			// company
			var company models.Company
			var country, description sql.NullString
			// deal
			var deal models.Deal
			var dealID, fundingAmount, companyID sql.NullInt64
			var foundRound sql.NullString
			var dealDate sql.NullTime
		

			// Scan row into variables
			err := rows.Scan(
					&company.ID,
					&company.Name,
					&country, // nullable
					&company.FoundingDate,
					&description, // nullable
					&dealID, // nullable
					&dealDate,	// nullable
					&fundingAmount,	// nullable
					&foundRound,	// nullable
					&companyID,	// nullable
			)
			if err != nil {
					return nil, err
			}
			// Assign
			company.Country = helpers.NullableStringToPointer(country)
			company.Description = helpers.NullableStringToPointer(description)
			
			if dealID.Valid {
					deal.ID = int(dealID.Int64)
					deal.Date = helpers.NullableTimeToTime(dealDate)
					deal.FundingAmount = helpers.NullableIntToPointer(fundingAmount)
					deal.FundingRound = foundRound.String
					deal.CompanyID = int(companyID.Int64)
			}
		
			if existingCompany, ok := companyMap[company.ID]; ok {
				if dealID.Valid {
					*existingCompany.Deals = append(*existingCompany.Deals, deal)
				}
			} else {
				if dealID.Valid {
					company.Deals = &[]models.Deal{deal}
				} else {
					company.Deals = &[]models.Deal{}
				}
				companyMap[company.ID] = &company
			}
	}

	if err = rows.Err(); err != nil {
			return nil, err
	}

	var companies []models.Company
	for _, company := range companyMap {
			// Ensure companies with no deals have an empty slice
			if company.Deals == nil {
					company.Deals = &[]models.Deal{}
			}
			companies = append(companies, *company)
	}

	return companies, nil
}
