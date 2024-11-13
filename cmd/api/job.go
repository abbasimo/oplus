package main

import (
	"database/sql"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/go-co-op/gocron/v2"
	"time"
)

func (app *application) initializeJobScheduler(db *sql.DB) {
	// fetch all service from database
	services, err := app.models.Service.GetAll()
	if err != nil {
		app.logger.Error().Err(err).Msg("error getting all services")
	}
	// submit all service as task (job) with its interval
	for _, svc := range *services {
		// use interval
		_, err = app.scheduler.NewJob(gocron.DurationJob(10*time.Second), gocron.NewTask(func() {
			data.CheckServiceHealth(db,
				data.Service{
					ID:             svc.ID,
					HealthCheckUrl: svc.HealthCheckUrl,
				},
			)
		}))

		if err != nil {
			app.logger.Error().Err(err).Msg("error creating job")
		}

	}
	app.scheduler.Start()
}
