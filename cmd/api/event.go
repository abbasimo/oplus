package main

import "github.com/abbasimo/oplus/internal/event"

const ServiceStateChanged = "ServiceStateChanged"

func (app *application) initializeEventsSubscriberAndHandler() {
	serviceStateChangedChan := make(chan event.Event)

	app.eventBus.Subscribe("ServiceStateChanged", serviceStateChangedChan)
	go app.models.Service.ServiceStateChangedHandler(serviceStateChangedChan)

}
