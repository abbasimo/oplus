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
		// todo: can i add this job with some interval between them?!
		_, err = app.scheduler.NewJob(gocron.DurationJob(time.Duration(svc.Interval)*time.Second), gocron.NewTask(func() {
			data.CheckServiceHealth(app.models.Service.DB,
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
