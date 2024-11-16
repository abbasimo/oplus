package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/abbasimo/oplus/internal/validator"
	"time"
)

type Audience struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"-"`
	Version     int       `json:"-"`
	Contacts    []Contact `json:"contacts"`
}

func ValidateAudience(v *validator.Validator, audience *Audience) {
	v.Check(audience.Title != "", "title", "must be provided")
	v.Check(len(audience.Title) <= 250, "title", "must not be more than 250 bytes long")
	v.Check(len(audience.Description) <= 500, "description", "must not be more than 500 bytes long")
}

type AudienceModel struct {
	DB *sql.DB
}

func (a AudienceModel) Insert(audience *Audience) error {
	query := `  INSERT INTO audiences (title, description)
				VALUES ($1, $2)
				RETURNING id, created_at, version`

	args := []interface{}{audience.Title, audience.Description}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := a.DB.QueryRowContext(ctx, query, args...).Scan(&audience.ID, &audience.CreatedAt, &audience.Version)
	if err != nil {
		if err.Error() == `pq: duplicate key value violates unique constraint "audiences_title_key"` {
			return ErrDuplicateTitle
		} else {
			return err
		}
	}
	return nil
}

func (a AudienceModel) GetAll(title string, description string, filters Filters) ([]*Audience, Metadata, error) {
	query := fmt.Sprintf(`SELECT count(*) OVER(), id, created_at, title, description, version
								FROM audiences
								WHERE (to_tsvector('simple', title) @@ plainto_tsquery('simple', $1) OR $1 = '')
								AND (to_tsvector('simple', description) @@ plainto_tsquery('simple', $2) OR $2 = '')
								ORDER BY %s %s, id ASC
								LIMIT $3 OFFSET $4`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{title, description, filters.limit(), filters.offset()}

	rows, err := a.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	audiences := []*Audience{}
	for rows.Next() {
		var audience Audience
		err := rows.Scan(
			&totalRecords,
			&audience.ID,
			&audience.CreatedAt,
			&audience.Title,
			&audience.Description,
			&audience.Version,
		)
		if err != nil {
			return nil, Metadata{}, err
		}
		audiences = append(audiences, &audience)
	}

	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}
	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)
	return audiences, metadata, nil
}

func (a AudienceModel) GetWithoutContacts(id int64) (*Audience, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `SELECT id, created_at, title, description, version
				FROM audiences
				WHERE id = $1`

	var audience Audience
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := a.DB.QueryRowContext(ctx, query, id).Scan(
		&audience.ID,
		&audience.CreatedAt,
		&audience.Title,
		&audience.Description,
		&audience.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &audience, nil
}

func (a AudienceModel) Get(id int64) (*Audience, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}
	audienceQuery := `select id, created_at, title, description, version
					from audiences
					where id = $1`

	contactQuery := `select c.id, c.phone_number, c.full_name, c.version, c.created_at
					from contacts c
					left join public.audiences_contacts ac on c.id = ac.contact_id
					left join public.audiences a on a.id = ac.audience_id
					where a.id = $1;`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var audience Audience
	err := a.DB.QueryRowContext(ctx, audienceQuery, id).Scan(
		&audience.ID,
		&audience.CreatedAt,
		&audience.Title,
		&audience.Description,
		&audience.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	contacts, er := a.DB.QueryContext(ctx, contactQuery, id)
	if er != nil {
		return &audience, nil
	}
	defer contacts.Close()

	for contacts.Next() {
		var contact Contact
		contacts.Scan(
			&contact.ID,
			&contact.PhoneNumber,
			&contact.FullName,
			&contact.Version,
			&contact.CreatedAt,
		)
		audience.Contacts = append(audience.Contacts, contact)
	}

	return &audience, nil
}

func (a AudienceModel) Update(audience *Audience) error {
	query := `  UPDATE audiences
				SET title = $1, description = $2, version = version + 1
				WHERE id = $3 AND version = $4
				RETURNING version`

	args := []interface{}{
		audience.Title,
		audience.Description,
		audience.ID,
		audience.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := a.DB.QueryRowContext(ctx, query, args...).Scan(&audience.Version)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}
	return nil
}

func (a AudienceModel) Delete(id int64) error {
	if id < 1 {
		return ErrRecordNotFound
	}

	query := `DELETE FROM audiences WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := a.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}

func (a AudienceModel) MapContactToAudience(audienceID int64, contactID int64) error {
	if audienceID < 1 || contactID < 1 {
		return ErrRecordNotFound
	}

	query := `INSERT INTO audiences_contacts (audience_id, contact_id) VALUES ($1, $2)`

	args := []interface{}{audienceID, contactID}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := a.DB.ExecContext(ctx, query, args...)
	if err != nil {
		if err.Error() == `pq: insert or update on table "audiences_contacts" violates foreign key constraint "audiences_contacts_audience_id_fkey"` {
			return ErrAudienceNotFound
		} else if err.Error() == `pq: insert or update on table "audiences_contacts" violates foreign key constraint "audiences_contacts_contact_id_fkey"` {
			return ErrContactNotFound
		} else if err.Error() == `pq: duplicate key value violates unique constraint "audiences_contacts_pkey"` {
			return ErrDuplicateRecord
		} else {
			return err
		}
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return err
	}

	return nil
}
