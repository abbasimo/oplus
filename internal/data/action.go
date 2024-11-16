package data

import (
	"context"
	"database/sql"
	"time"
)

type Action struct {
	ID    int64
	Title string
}

type ActionModel struct {
	DB *sql.DB
}

func (a ActionModel) GetAllByRuleID(ruleID int64) ([]*Action, error) {
	query := `SELECT  id, created_at, title, description, version
			FROM audiences
			WHERE (to_tsvector('simple', title) @@ plainto_tsquery('simple', $1) OR $1 = '')
			AND (to_tsvector('simple', description) @@ plainto_tsquery('simple', $2) OR $2 = '')
			ORDER BY %s %s, id ASC
			LIMIT $3 OFFSET $4`

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
