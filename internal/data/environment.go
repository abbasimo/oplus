package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/abbasimo/oplus/internal/validator"
	"time"
)

type Environment struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"-"`
	Version     int       `json:"-"`
	Services    []Service `json:"services"`
}

func ValidateEnvironment(v *validator.Validator, env *Environment) {
	v.Check(env.Title != "", "title", "must be provided")
	v.Check(len(env.Title) <= 250, "title", "must not be more than 250 bytes long")
	v.Check(len(env.Description) <= 500, "description", "must not be more than 500 bytes long")
	// todo: add uniqueness check of title
}

type EnvironmentModel struct {
	DB *sql.DB
}

func (e EnvironmentModel) Insert(env *Environment) error {
	query := `  INSERT INTO environments (title, description)
				VALUES ($1, $2)
				RETURNING id, created_at, version`

	args := []interface{}{env.Title, env.Description}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := e.DB.QueryRowContext(ctx, query, args...).Scan(&env.ID, &env.CreatedAt, &env.Version)
	if err != nil {
		if err.Error() == `pq: duplicate key value violates unique constraint "environment_title_key"` {
			return ErrDuplicateTitle
		} else {
			return err
		}
	}
	return nil
}

func (e EnvironmentModel) Get(id int64) (*GetEnvironmentQueryResult, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}
	envQuery := `SELECT id, created_at, title, description, version
				FROM environments
				WHERE id = $1`

	var env GetEnvironmentQueryResult
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := e.DB.QueryRowContext(ctx, envQuery, id).Scan(
		&env.ID,
		&env.CreatedAt,
		&env.Title,
		&env.Description,
		&env.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	svcQuery := `select id, created_at, title, description, environment_id,
					   interval, health_check_url,
					   (select status from healthcheck where service_id = service.id order by id desc limit 1) as status,
					   get_uptime(service.id) as uptime
				from services
				where environment_id = $1;`

	svcRows, er := e.DB.QueryContext(ctx, svcQuery, id)
	if er != nil {
		return &env, nil
	}
	defer svcRows.Close()

	for svcRows.Next() {
		var svc GetServiceQueryResult
		svcRows.Scan(
			&svc.ID,
			&svc.CreatedAt,
			&svc.Title,
			&svc.Description,
			&svc.EnvironmentID,
			&svc.Interval,
			&svc.HealthCheckUrl,
			&svc.Status,
			&svc.Uptime,
		)
		env.Services = append(env.Services, svc)
	}

	return &env, nil
}

func (e EnvironmentModel) GetWithoutServices(id int64) (*GetEnvironmentWithoutServicesQueryResult, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}
	envQuery := `SELECT id, created_at, title, description, version
				FROM environments
				WHERE id = $1`

	var env GetEnvironmentWithoutServicesQueryResult
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := e.DB.QueryRowContext(ctx, envQuery, id).Scan(
		&env.ID,
		&env.CreatedAt,
		&env.Title,
		&env.Description,
		&env.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &env, nil
}

func (e EnvironmentModel) Update(env *Environment) error {
	query := `  UPDATE environments
				SET title = $1, description = $2, version = version + 1
				WHERE id = $3 AND version = $4
				RETURNING version`

	args := []interface{}{
		env.Title,
		env.Description,
		env.ID,
		env.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := e.DB.QueryRowContext(ctx, query, args...).Scan(&env.Version)
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

func (e EnvironmentModel) Delete(id int64) error {
	if id < 1 {
		return ErrRecordNotFound
	}

	query := `DELETE FROM environments WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := e.DB.ExecContext(ctx, query, id)
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

func (e EnvironmentModel) GetAll(title string, description string, filters Filters) ([]*GetAllEnvironmentsQueryResult, Metadata, error) {
	query := fmt.Sprintf(`SELECT count(*) OVER(), id, created_at, title, description
								FROM environments
								WHERE (to_tsvector('simple', title) @@ plainto_tsquery('simple', $1) OR $1 = '')
								AND (to_tsvector('simple', description) @@ plainto_tsquery('simple', $2) OR $2 = '')
								ORDER BY %s %s, id ASC
								LIMIT $3 OFFSET $4`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{title, description, filters.limit(), filters.offset()}

	rows, err := e.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	envs := []*GetAllEnvironmentsQueryResult{}
	for rows.Next() {
		var env GetAllEnvironmentsQueryResult
		err := rows.Scan(
			&totalRecords,
			&env.ID,
			&env.CreatedAt,
			&env.Title,
			&env.Description,
		)
		if err != nil {
			return nil, Metadata{}, err
		}
		envs = append(envs, &env)
	}

	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}
	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)
	return envs, metadata, nil
}

type GetEnvironmentQueryResult struct {
	ID          int64                   `json:"id"`
	Title       string                  `json:"title"`
	Description string                  `json:"description"`
	CreatedAt   time.Time               `json:"created_at"`
	Version     int                     `json:"-"`
	Services    []GetServiceQueryResult `json:"services"`
}

type GetEnvironmentWithoutServicesQueryResult struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Version     int       `json:"-"`
}

type GetAllEnvironmentsQueryResult struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}
