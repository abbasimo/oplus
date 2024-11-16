package data

import (
	"context"
	"database/sql"
	"errors"
	"github.com/abbasimo/oplus/internal/validator"
	"time"
)

type Service struct {
	ID             int64         `json:"id"`
	EnvironmentID  int64         `json:"environment_id"`
	Title          string        `json:"title"`
	Description    string        `json:"description"`
	Uptime         int64         `json:"uptime"`
	HealthCheckUrl string        `json:"health_check_url"`
	Interval       int64         `json:"interval"` // todo: why this value is int64?! int is enough
	CreatedAt      time.Time     `json:"-"`
	Version        int           `json:"-"`
	Status         ServiceStatus `json:"status"`
}

type ServiceStatus string

const (
	Healthy   ServiceStatus = "healthy"
	Unhealthy ServiceStatus = "unhealthy"
)

type ServiceModel struct {
	DB *sql.DB
}

func ValidateService(v *validator.Validator, svc *Service) {
	v.Check(svc.Title != "", "title", "must be provided")
	v.Check(len(svc.Title) <= 250, "title", "must not be more than 250 bytes long")

	v.Check(len(svc.Description) <= 500, "description", "must not be more than 500 bytes long")

	v.Check(svc.HealthCheckUrl != "", "health_check_url", "must be provided")
	//v.Check(validator.Matches(svc.HealthCheckUrl, validator.UrlRX), "health_check_url", "url is incorrect") // todo: must to check url correctness!

	v.Check(svc.Interval > 4, "interval", "must be bigger than 4")
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
			return ErrEnvNotFound //TODO: what the fuck?!
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

	query := `	SELECT id, created_at, title, description, version, environment_id, interval, health_check_url
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
		&svc.Interval,
		&svc.HealthCheckUrl,
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

func (s ServiceModel) Update(svc *Service) error {
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

	err := s.DB.QueryRowContext(ctx, query, args...).Scan(&svc.Version)
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

func (s ServiceModel) Delete(envID int64, svcID int64) error {
	if envID < 1 || svcID < 1 {
		return ErrRecordNotFound
	}

	query := `DELETE FROM service WHERE environment_id = $1 and id = $2`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := s.DB.ExecContext(ctx, query, envID, svcID)
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

func (s ServiceModel) GetAll() (*[]Service, error) {

	query := `	SELECT id, created_at, title, description, version, environment_id, interval, health_check_url
				FROM service
				`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var services []Service

	rows, err := s.DB.QueryContext(ctx, query)

	for rows.Next() {
		var svc Service
		err = rows.Scan(
			&svc.ID,
			&svc.CreatedAt,
			&svc.Title,
			&svc.Description,
			&svc.Version,
			&svc.EnvironmentID,
			&svc.Interval,
			&svc.HealthCheckUrl,
		)
		services = append(services, svc)
	}

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &services, nil
}

type ServiceStateChangedEvent struct {
	ID        int64
	ServiceID int64
	Source    string
	Severity  string
	Layer     string
	CreatedAt time.Time
	Text      string
	Status    string
}
