package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) routes() http.Handler {
	// NEEDS
	// 1. Create/Update/Delete env							done
	// 2. Get all envs										done
	// 3. Get a specific env with corresponding services	not ready
	// 4. Create/Update/Delete service of specific env 		not ready
	// 5. Get service with all details						not ready

	// POST		"/envs/:id/services"		create a service			done
	// PATCH	"/envs/:id/services/:sid"	update the service
	// DELETE	"/envs/:id/services/:sid"	delete the service
	// GET		"/envs/:id/services/:sid" 	get service with details
	// GET		"/envs/:id/services"		is it need? it's similar to /envs/:id path

	router := httprouter.New()

	router.HandlerFunc(http.MethodPost, "/envs", app.createEnvironmentHandler)
	router.HandlerFunc(http.MethodGet, "/envs", app.listEnvironmentHandler)
	router.HandlerFunc(http.MethodGet, "/envs/:id", app.showEnvironmentHandler) // todo: return corresponding services for specific env
	router.HandlerFunc(http.MethodPatch, "/envs/:id", app.updateEnvironmentHandler)
	router.HandlerFunc(http.MethodDelete, "/envs/:id", app.deleteEnvironmentHandler)

	router.HandlerFunc(http.MethodPost, "/envs/:id/services", app.createServiceHandler)
	router.HandlerFunc(http.MethodPatch, "/envs/:id/services/:sid", app.updateServiceHandler)

	return router
}
