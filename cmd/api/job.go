package main

import (
	"github.com/abbasimo/oplus/internal/data"
	"github.com/go-co-op/gocron/v2"
	"time"
)

func (app *application) initializeJobScheduler() {
	// fetch all service from database
	services, err := app.models.Service.GetAll()
	if err != nil {
		app.logger.Error().Err(err).Msg("error getting all services")
	}
	// submit all service as task (job) with its interval
	for _, svc := range *services {
		// todo: can i add this job with some interval between them?!
		_, err = app.scheduler.NewJob(gocron.DurationJob(time.Duration(svc.Interval)*time.Second), gocron.NewTask(func() {
			app.healthCheckService(
				data.Service{
					ID:             svc.ID,
					HealthCheckUrl: svc.HealthCheckUrl,
					Title:          svc.Title,
					Description:    svc.Description,
					CreatedAt:      svc.CreatedAt,
					Interval:       svc.Interval,
					EnvironmentID:  svc.EnvironmentID,
					Status:         svc.Status,
					Uptime:         svc.Uptime,
					Version:        svc.Version,
				},
			)
		}))
		if err != nil {
			app.logger.Error().Err(err).Msg("error creating job")
		}
	}
	app.logger.Info().Msg("job(s) initialized successfully") //todo: really? are u sure?!
	app.scheduler.Start()
}
