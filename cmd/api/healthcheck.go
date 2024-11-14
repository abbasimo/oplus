package main

import (
	"errors"
	"fmt"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/abbasimo/oplus/internal/event"
	"net/http"
	"time"
)

var (
	ErrRequestFailed      = errors.New("request failed")
	ErrServiceUnreachable = errors.New("service unreachable")
)

func (app *application) healthCheckService(svc data.Service) {
	ok, err := app.pingService(svc.HealthCheckUrl)
	if err != nil {
		switch {
		case errors.Is(err, ErrRequestFailed):
			app.logger.Error().Int64("service_id", svc.ID).
				Err(err).Stack().Msg("there is error in healthcheck service while creation request")
		case errors.Is(err, ErrServiceUnreachable):
			result, err := app.updateHealthCheck(svc.ID, string(data.Unhealthy))
			if err != nil {
				fmt.Println(err)
			}
			if result == "changed" {
				app.fireUnhealthyEvent(&svc)
			}
		default:
			app.logger.Error().Err(err).Stack().Msg("there is unknown error in healthcheck service")
		}
		return
	}
	if ok {
		result, err := app.updateHealthCheck(svc.ID, string(data.Healthy))
		if err != nil {
			fmt.Println(err)
		}
		if result == "changed" {
			app.fireHealthyEvent(&svc)
		}
	}
}
func (app *application) pingService(svcUrl string) (bool, error) {
	client := &http.Client{
		Timeout: time.Second * 2, // todo: is it better to give from config?! idk!
	}

	req, err := http.NewRequest(http.MethodHead, svcUrl, nil)
	if err != nil {
		return false, ErrRequestFailed
	}

	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return false, ErrServiceUnreachable
	}
	defer resp.Body.Close()

	return true, nil
}

func (app *application) updateHealthCheck(svcID int64, status string) (string, error) {
	var result string
	query := `SELECT update_healthcheck($1, $2)`
	err := app.models.Generic.DB.QueryRow(query, svcID, status).Scan(&result)

	if err != nil {
		return "", err
	}
	return result, nil
}

func (app *application) fireHealthyEvent(svc *data.Service) {
	app.fireEvent(svc, "info", data.Healthy)
}

func (app *application) fireUnhealthyEvent(svc *data.Service) {
	app.fireEvent(svc, "critical", data.Unhealthy)
}

func (app *application) fireEvent(svc *data.Service, severity string, status data.ServiceStatus) {
	app.eventBus.Publish(event.Event{
		Type:      ServiceStateChanged,
		Timestamp: time.Now(),
		Data: data.ServiceStateChangedEvent{
			ServiceID: svc.ID,
			Source:    "healthcheck",
			Severity:  severity,
			Layer:     "application",
			CreatedAt: time.Now(),
			Text:      fmt.Sprintf("Service %s (%d) is unreachable", svc.Title, svc.ID),
			Status:    string(status),
		},
	})
}
