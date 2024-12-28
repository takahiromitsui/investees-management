package drivers

import (
	"database/sql"
	"time"
	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v5"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type DB struct {
	SQL *sql.DB
}

var dbConn = &DB{}
const maxOpenConns = 10
const maxIdleConns = 5
const maxDBConnLifetime = 5 * time.Minute

// ConnectSQL connects to the database
func ConnectSQL(dsn string) (*DB, error) {
	db, err := NewDatabase(dsn)
	if err != nil {
		panic(err)
	}
	db.SetMaxOpenConns(maxOpenConns)
	db.SetMaxIdleConns(maxIdleConns)
	db.SetConnMaxLifetime(maxDBConnLifetime)

	dbConn.SQL = db
	err = testDB(db)
	if err != nil {
		return nil, err
	}
	return dbConn, nil
}
// Close closes the database connection
func testDB(db *sql.DB) error {
	err := db.Ping()
	if err != nil {
		return err
	}
	return nil
}

// NewDatabase creates a new database connection
func NewDatabase(dsn string) (*sql.DB, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}