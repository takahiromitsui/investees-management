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
			var company models.Company
			var country sql.NullString
			var description sql.NullString
			var deal models.Deal
			var dealID sql.NullInt64
			var fundingAmount sql.NullInt64
			var foundRound sql.NullString
			var dealDate sql.NullTime // Use sql.NullTime for nullable date
			var companyID sql.NullInt64	

			// Scan row into variables
			err := rows.Scan(
					&company.ID,
					&company.Name,
					&country,
					&company.FoundingDate,
					&description,
					&dealID,
					&dealDate,
					&fundingAmount,
					&foundRound,
					&companyID,
			)
			if err != nil {
					return nil, err
			}

			// Handle nullable fields
			if country.Valid {
					company.Country = &country.String
			}
			if description.Valid {
					company.Description = &description.String
			}

			// Handle nullable Deal ID and Funding Amount
			if dealID.Valid {
					deal.ID = int(dealID.Int64)
			} 
		
			if fundingAmount.Valid {
					fundingAmountValue := int(fundingAmount.Int64)
					deal.FundingAmount = &fundingAmountValue
			} 
			
			if foundRound.Valid {
					deal.FundingRound = foundRound.String
			} 
		

			// Handle nullable Date (dealDate)
			if dealDate.Valid {
					deal.Date = dealDate.Time // Use the time from sql.NullTime
			} 
	
			if companyID.Valid {
					deal.CompanyID = int(companyID.Int64)
			} 
		
			// If company already exists, append the deal
			if existingCompany, ok := companyMap[company.ID]; ok {
					*existingCompany.Deals = append(*existingCompany.Deals, deal)
			} else {
					company.Deals = &[]models.Deal{deal}
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
