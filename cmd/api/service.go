package main

import (
	"errors"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/abbasimo/oplus/internal/validator"
	"net/http"
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

	job, err := app.createJob(svc)
	if err != nil {
		app.serverErrorResponse(w, r, err) // todo: what if job failed to creation? insert done
	}
	err = app.models.Job.UpdateSchedulerStatus(svc.ID, job.ID())
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

	err = updateJob(app, svc)
	if err != nil {
		app.serverErrorResponse(w, r, err)
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

func updateJob(app *application, svc *data.Service) error {
	oldJobID, err := app.models.Job.GetJobID(svc.ID)
	if err != nil {
		return err
	}

	err = app.scheduler.RemoveJob(oldJobID)
	if err != nil {
		return err
	}

	job, err := app.createJob(svc)
	if err != nil {
		return err
	}

	err = app.models.Job.UpdateSchedulerStatus(svc.ID, job.ID())
	if err != nil {
		return err
	}
	return nil
}
