package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/abbasimo/oplus/internal/validator"
	"time"
)

type Contact struct {
	ID          int64     `json:"id"`
	PhoneNumber string    `json:"phone_number"`
	FullName    string    `json:"full_name"`
	CreatedAt   time.Time `json:"-"`
	Version     int       `json:"-"`
}

func ValidateContact(v *validator.Validator, contact *Contact) {
	// TODO: validate phone number with regex
	v.Check(contact.PhoneNumber != "", "phone_number", "must be provided")
	v.Check(len(contact.PhoneNumber) == 11, "phone_number", "must be exactly 11 characters")
	v.Check(contact.FullName != "", "full_name", "must be provided")
	v.Check(len(contact.FullName) <= 200, "full_name", "must not be more than 200 bytes long")
}

type ContactModel struct {
	DB *sql.DB
}

func (c ContactModel) Insert(contact *Contact) error {
	query := `  INSERT INTO contacts (phone_number, full_name)
				VALUES ($1, $2)
				RETURNING id, created_at, version`

	args := []interface{}{contact.PhoneNumber, contact.FullName}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := c.DB.QueryRowContext(ctx, query, args...).Scan(&contact.ID, &contact.CreatedAt, &contact.Version)
	if err != nil {
		if err.Error() == `pq: duplicate key value violates unique constraint "contacts_phone_number_key"` {
			return ErrDuplicateRecord
		} else {
			return err
		}
	}
	return nil
}

func (c ContactModel) GetAll(phone_number string, full_name string, filters Filters) ([]*Contact, Metadata, error) {
	query := fmt.Sprintf(`SELECT count(*) OVER(), id, created_at, phone_number, full_name, version
								FROM contacts
								WHERE (phone_number = $1 OR $1 = '')
								AND (to_tsvector('simple', full_name) @@ plainto_tsquery('simple', $2) OR $2 = '')
								ORDER BY %s %s, id ASC
								LIMIT $3 OFFSET $4`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{phone_number, full_name, filters.limit(), filters.offset()}

	rows, err := c.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	contacts := []*Contact{}
	for rows.Next() {
		var contact Contact
		err := rows.Scan(
			&totalRecords,
			&contact.ID,
			&contact.CreatedAt,
			&contact.PhoneNumber,
			&contact.FullName,
			&contact.Version,
		)
		if err != nil {
			return nil, Metadata{}, err
		}
		contacts = append(contacts, &contact)
	}

	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}
	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)
	return contacts, metadata, nil
}

func (c ContactModel) Get(id int64) (*Contact, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `SELECT id, created_at, phone_number, full_name, version
				FROM contacts
				WHERE id = $1`

	var contact Contact
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := c.DB.QueryRowContext(ctx, query, id).Scan(
		&contact.ID,
		&contact.CreatedAt,
		&contact.PhoneNumber,
		&contact.FullName,
		&contact.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &contact, nil
}

func (c ContactModel) Update(contact *Contact) error {
	query := `  UPDATE contacts
				SET phone_number = $1, full_name = $2, version = version + 1
				WHERE id = $3 AND version = $4
				RETURNING version`

	args := []interface{}{
		contact.PhoneNumber,
		contact.FullName,
		contact.ID,
		contact.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := c.DB.QueryRowContext(ctx, query, args...).Scan(&contact.Version)
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

func (c ContactModel) Delete(id int64) error {
	if id < 1 {
		return ErrRecordNotFound
	}

	query := `DELETE FROM contacts WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := c.DB.ExecContext(ctx, query, id)
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
