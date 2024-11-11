package data

import (
	"database/sql"
	"errors"
)

type Models struct {
	Environment EnvironmentModel
	Service     ServiceModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Environment: EnvironmentModel{DB: db},
		Service:     ServiceModel{DB: db},
	}
}

var (
	ErrDuplicateTitle = errors.New("duplicate title")
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
	ErrEnvNotFound    = errors.New("env not found")
)
