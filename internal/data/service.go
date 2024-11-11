package data

import (
	"context"
	"database/sql"
	"errors"
	"github.com/abbasimo/oplus/internal/validator"
	"time"
)

type Service struct {
	ID             int64     `json:"id"`
	EnvironmentID  int64     `json:"environment_id"`
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	Uptime         int64     `json:"uptime"`
	HealthCheckUrl string    `json:"health_check_url"`
	Interval       int64     `json:"interval"`
	CreatedAt      time.Time `json:"-"`
	Version        int       `json:"-"`
}

type ServiceModel struct {
	DB *sql.DB
}

func ValidateService(v *validator.Validator, svc *Service) {
	v.Check(svc.Title != "", "title", "must be provided")
	v.Check(len(svc.Title) <= 250, "title", "must not be more than 250 bytes long")

	v.Check(len(svc.Description) <= 500, "description", "must not be more than 500 bytes long")

	v.Check(svc.HealthCheckUrl != "", "health_check_url", "must be provided")
	//v.Check(validator.Matches(svc.HealthCheckUrl, validator.UrlRX), "health_check_url", "url is incorrect") // todo: must to check url correctness!

	v.Check(svc.Interval > 0, "interval", "must be bigger than 0")
}

func (s ServiceModel) Insert(svc *Service) error {
	query := `INSERT INTO service (environment_id, title, description, health_check_url, interval)
			VALUES ($1, $2, $3, $4, $5) 
			RETURNING id, created_at, version`

	args := []interface{}{svc.EnvironmentID, svc.Title, svc.Description, svc.HealthCheckUrl, svc.Interval}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := s.DB.QueryRowContext(ctx, query, args...).Scan(&svc.ID, &svc.CreatedAt, &svc.Version)
	if err != nil {
		if err.Error() == `pq: insert or update on table "service" violates foreign key constraint "service_environment_id_fkey"` {
			return ErrEnvNotFound
		} else {
			return err
		}
	}
	return nil
}

func (s ServiceModel) Get(envID int64, svcID int64) (*Service, error) {
	if envID < 1 || svcID < 1 {
		return nil, ErrRecordNotFound
	}

	query := `	SELECT id, created_at, title, description, version, environment_id, health_check_url, interval
				FROM service
				WHERE id = $1 and environment_id = $2`

	var svc Service
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := s.DB.QueryRowContext(ctx, query, svcID, envID).Scan(
		&svc.ID,
		&svc.CreatedAt,
		&svc.Title,
		&svc.Description,
		&svc.Version,
		&svc.EnvironmentID,
		&svc.HealthCheckUrl,
		&svc.Interval,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &svc, nil
}

func (e ServiceModel) Update(svc *Service) error {
	query := `  UPDATE service
				SET title = $1, description = $2, health_check_url = $3, interval = $4, version = version + 1
				WHERE id = $5 AND version = $6
				RETURNING version`

	args := []interface{}{
		svc.Title,
		svc.Description,
		svc.HealthCheckUrl,
		svc.Interval,
		svc.ID,
		svc.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := e.DB.QueryRowContext(ctx, query, args...).Scan(&svc.Version)
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
