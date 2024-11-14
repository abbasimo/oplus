package main

import (
	"errors"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/abbasimo/oplus/internal/validator"
	"github.com/go-co-op/gocron/v2"
	"net/http"
	"time"
)

func (app *application) createServiceHandler(w http.ResponseWriter, r *http.Request) {
	envID, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	var input struct {
		Title          string `json:"title"`
		Description    string `json:"description"`
		HealthCheckUrl string `json:"health_check_url"`
		Interval       int64  `json:"interval"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	svc := &data.Service{
		EnvironmentID:  envID,
		Title:          input.Title,
		Description:    input.Description,
		HealthCheckUrl: input.HealthCheckUrl,
		Interval:       input.Interval,
	}

	v := validator.New()
	if data.ValidateService(v, svc); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Service.Insert(svc)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEnvNotFound):
			v.AddError("environment", "there is no environment with this id")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}
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

	err = app.writeJSON(w, http.StatusCreated, envelope{"service": svc}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateServiceHandler(w http.ResponseWriter, r *http.Request) {
	envID, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	svcID, err := app.readServiceIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	svc, err := app.models.Service.Get(envID, svcID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Title          *string `json:"title"`
		Description    *string `json:"description"`
		HealthCheckUrl *string `json:"health_check_url"`
		Interval       *int64  `json:"interval"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Title != nil {
		svc.Title = *input.Title
	}
	if input.Description != nil {
		svc.Description = *input.Description
	}
	if input.HealthCheckUrl != nil {
		svc.HealthCheckUrl = *input.HealthCheckUrl
	}
	if input.Interval != nil {
		svc.Interval = *input.Interval
	}

	v := validator.New()
	if data.ValidateService(v, svc); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Service.Update(svc)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"service": svc}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteServiceHandler(w http.ResponseWriter, r *http.Request) {
	envID, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	svcID, err := app.readServiceIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Service.Delete(envID, svcID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "service successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showServiceHandler(w http.ResponseWriter, r *http.Request) {
	envID, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	svcID, err := app.readServiceIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	svc, err := app.models.Service.Get(envID, svcID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"service": svc}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
