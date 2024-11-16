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
	Event       EventModel
	Rule        RuleModel
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
		Event:       EventModel{DB: db},
		Rule:        RuleModel{DB: db},
		Generic:     GenericModel{DB: db},
	}
}

var (
	ErrDuplicateTitle           = errors.New("duplicate title")
	ErrDuplicateRecord          = errors.New("duplicate record")
	ErrRecordNotFound           = errors.New("record not found")
	ErrEditConflict             = errors.New("edit conflict")
	ErrEnvNotFound              = errors.New("env not found")
	ErrAudienceNotFound         = errors.New("audience not found")
	ErrContactNotFound          = errors.New("contact not found")
	ErrDuplicateActionForRule   = errors.New("duplicate action for rule")
	ErrDuplicateAudienceForRule = errors.New("duplicate audience for rule")
	ErrFailedToCommit           = errors.New("failed to commit transaction")
)
