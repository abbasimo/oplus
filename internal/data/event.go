package data

import (
	"context"
	"database/sql"
	"time"
)

type Event struct {
	ID        int64     `json:"id"`
	ServiceID int64     `json:"service_id"`
	Type      string    `json:"type"`
	Source    string    `json:"source"`
	Severity  string    `json:"severity"`
	Layer     string    `json:"layer"`
	CreatedAt time.Time `json:"created_at"`
	Text      string    `json:"text"`
	Status    string    `json:"status"`
}

type EventModel struct {
	DB *sql.DB
}

func (e EventModel) Insert(event *Event) error {
	query := `INSERT INTO events (service_id, type, source, severity, layer, text, status, created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
			RETURNING id`

	args := []interface{}{event.ServiceID, event.Type, event.Source, event.Severity,
		event.Layer, event.Text, event.Status, event.CreatedAt}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := e.DB.QueryRowContext(ctx, query, args...).Scan(&event.ID)
	if err != nil {
		return err
	}
	return nil
}

type EventReceivedEvent struct {
	ID        int64
	ServiceID int64
	Source    string
	Severity  string
	Layer     string
	CreatedAt time.Time
	Text      string
	Status    string
}
