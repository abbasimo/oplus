package main

import (
	"fmt"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/abbasimo/oplus/internal/event"
	"time"
)

const (
	ServiceStateChanged = "ServiceStateChanged"
	EventReceived       = "EventReceived"
)

func (app *application) initializeEventsSubscriberAndHandler() {
	serviceStateChangedChan := make(chan event.Event)
	app.eventBus.Subscribe(ServiceStateChanged, serviceStateChangedChan)
	go app.serviceStateChangedHandler(serviceStateChangedChan)

	eventReceivedChan := make(chan event.Event)
	app.eventBus.Subscribe(EventReceived, eventReceivedChan)
	go app.eventReceivedHandler(eventReceivedChan)
}

func (app *application) serviceStateChangedHandler(eventChan <-chan event.Event) {
	for events := range eventChan {
		e, ok := events.Data.(data.ServiceStateChangedEvent) //TODO: wtf syntax!!
		if !ok {
			app.logger.Error().Msg("invalid event data for serviceStateChangedHandler")
			//TODO: implement retry & dead letter mechanisms
			continue
		}

		err := app.models.Event.Insert(&data.Event{
			ServiceID: e.ServiceID,
			Type:      events.Type,
			Source:    e.Source,
			Layer:     e.Layer,
			Severity:  e.Severity,
			Status:    e.Status,
			CreatedAt: e.CreatedAt,
			Text:      e.Text,
		})
		if err != nil {
			app.logger.Error().Err(err).Stack().Msg("error inserting event")
		}

		app.eventBus.Publish(event.Event{
			Type:      EventReceived,
			Timestamp: time.Now(),
			Data: data.EventReceivedEvent{
				ServiceID: e.ServiceID,
				Source:    e.Source,
				Layer:     e.Layer,
				Status:    e.Status,
				CreatedAt: e.CreatedAt,
				Text:      e.Text,
				Severity:  e.Severity,
			},
		})
	}
}

func (app *application) eventReceivedHandler(eventChan <-chan event.Event) {
	for events := range eventChan {
		e, ok := events.Data.(data.EventReceivedEvent)
		if !ok {
			app.logger.Error().Msg("invalid event data for eventReceivedHandler")
			continue
		}
		fmt.Println(e)
		// fetch all rules from database
		// do as rule

	}
}
