package models

import "time"

// Define the Company struct
type Company struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Country *string `json:"country"`
	FoundingDate time.Time `json:"foundingDate"`
	Description *string `json:"description"`
	Deals *[]Deal `json:"deals"`
}

// Define the Deal struct
type Deal struct {
	ID   int    `json:"id"`
	Date time.Time `json:"date"`
	FundingAmount int `json:"fundingAmount"`
	FundingRound string `json:"fundingRound"`
	CompanyID int `json:"companyID"`
}

// Define the User struct
type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	RefreshToken string `json:"refreshToken"`
}