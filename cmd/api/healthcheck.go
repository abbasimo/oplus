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

func (app *application) healthCheckService(svc data.Service) { // TODO: transport to cmd/api directory and make application receiver
	// if request failed: ignore that period and log an error
	// if service unreachable submit a outage in database
	// if service was okay, submit success in database
	//--------------------------------------------------------
	// maybe it's better to create healthcheck model to use database access
	// maybe it's better to transport this file to data package
	ok, err := app.pingService(svc.HealthCheckUrl)
	if err != nil {
		switch {
		case errors.Is(err, ErrRequestFailed):
			// ignore this iteration
			// must log with error severity
			// how to get logger in this place?! I can pass logger to Healthcheck  model
		case errors.Is(err, ErrServiceUnreachable):
			result, err := app.updateHealthCheck(svc.ID, string(data.Unhealthy))
			if err != nil {
				fmt.Println(err)
			}
			// raising event
			app.eventBus.Publish(event.Event{
				Type:      ServiceStateChanged,
				Timestamp: time.Now(),
				Data: data.ServiceStateChangedEvent{
					Source:    "healthcheck",
					Type:      "critical",
					Layer:     "application",
					CreatedAt: time.Now(),
					Text:      fmt.Sprintf("Service %s (%d) is unreachable", svc.Title, svc.ID),
				},
			})
			fmt.Println(svc.ID, result)
		default:
			// log error
		}
		return
	}
	if ok {
		result, err := app.updateHealthCheck(svc.ID, string(data.Healthy))
		if err != nil {
			fmt.Println(err)
		}
		app.eventBus.Publish(event.Event{
			Type:      ServiceStateChanged,
			Timestamp: time.Now(),
			Data: data.ServiceStateChangedEvent{
				Source:    "healthcheck",
				Type:      "info",
				Layer:     "application",
				CreatedAt: time.Now(),
				Text:      fmt.Sprintf("Service %s (%d) is reachable", svc.Title, svc.ID),
			},
		})
		fmt.Println(svc.ID, result)
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
