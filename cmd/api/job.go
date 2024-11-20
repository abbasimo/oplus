package main

import (
	"github.com/abbasimo/oplus/internal/data"
	"github.com/go-co-op/gocron/v2"
	"time"
)

func (app *application) initializeJobScheduler() {
	services, err := app.models.Service.GetAll()
	if err != nil {
		app.logger.Error().Err(err).Msg("error getting all services")
	}
	for _, svc := range *services {
		// todo: can i add this job with some interval between them?!
		job, err := app.createJob(&svc)

		if err != nil {
			app.logger.Error().Err(err).Stack().
				Int64("service_id", svc.ID).Str("service_title", svc.Title).
				Msg("error creating job")
		}

		err = app.models.Job.UpdateSchedulerStatus(svc.ID, job.ID())
		if err != nil {
			app.logger.Error().Err(err).Stack().
				Int64("service_id", svc.ID).Str("job_id", job.ID().String()).
				Msg("error updating job in database")
		}
	}
	app.logger.Info().Msgf("%d job(s) initialized successfully", len(*services)) //todo: really? are u sure?!
	app.scheduler.Start()
}

func (app *application) createJob(svc *data.Service) (gocron.Job, error) {
	return app.scheduler.NewJob(gocron.DurationJob(time.Duration(svc.Interval)*time.Second), gocron.NewTask(func() {
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
}
