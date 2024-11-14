package data

import (
	"database/sql"
	"errors"
)

type Models struct {
	Environment EnvironmentModel
	Service     ServiceModel
	Audience    AudienceModel
	Contact     ContactModel
	Generic     GenericModel
}

type GenericModel struct {
	DB *sql.DB
}

func NewModels(db *sql.DB) Models {
	return Models{
		Environment: EnvironmentModel{DB: db},
		Service:     ServiceModel{DB: db},
		Audience:    AudienceModel{DB: db},
		Contact:     ContactModel{DB: db},
		Generic:     GenericModel{DB: db},
	}
}

var (
	ErrDuplicateTitle  = errors.New("duplicate title")
	ErrDuplicateRecord = errors.New("duplicate record")
	ErrRecordNotFound  = errors.New("record not found")
	ErrEditConflict    = errors.New("edit conflict")
	ErrEnvNotFound     = errors.New("env not found")
)
