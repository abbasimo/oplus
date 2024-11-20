package data

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"time"
)

type JobModel struct {
	DB *sql.DB
}

func (j JobModel) UpdateSchedulerStatus(svcID int64, jobID uuid.UUID) error {

	query := `select update_scheduler($1, $2)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := j.DB.ExecContext(ctx, query, svcID, jobID)
	if err != nil {
		return err
	}
	return nil
}

func (j JobModel) GetJobID(svcID int64) (uuid.UUID, error) {

	query := `select job_id from schedulers where service_id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var jobID uuid.UUID
	err := j.DB.QueryRowContext(ctx, query, svcID).Scan(&jobID)
	if err != nil {
		return uuid.UUID{}, err
	}
	return jobID, nil
}
