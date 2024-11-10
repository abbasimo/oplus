package data

import (
	"database/sql"
)

type Models struct {
	Environment EnvironmentModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Environment: EnvironmentModel{DB: db},
	}
}
