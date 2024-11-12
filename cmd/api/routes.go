package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) routes() http.Handler {
	// NEEDS
	// 1. Create/Update/Delete env							done
	// 2. Get all envs										done
	// 3. Get a specific env with corresponding services	done
	// 4. Create/Update/Delete service of specific env 		done
	// 5. Get service with all details						done

	// POST		"/envs/:id/services"		create a service			done
	// PATCH	"/envs/:id/services/:sid"	update the service			done
	// DELETE	"/envs/:id/services/:sid"	delete the service			done
	// GET		"/envs/:id/services/:sid" 	get service with details	done
	// GET		"/envs/:id/services"		is it need? it's similar to /envs/:id path

	router := httprouter.New()

	router.HandlerFunc(http.MethodPost, "/envs", app.createEnvironmentHandler)
	router.HandlerFunc(http.MethodGet, "/envs", app.listEnvironmentHandler)
	router.HandlerFunc(http.MethodGet, "/envs/:id", app.showEnvironmentHandler)
	router.HandlerFunc(http.MethodPatch, "/envs/:id", app.updateEnvironmentHandler)
	router.HandlerFunc(http.MethodDelete, "/envs/:id", app.deleteEnvironmentHandler)

	router.HandlerFunc(http.MethodPost, "/envs/:id/services", app.createServiceHandler)
	router.HandlerFunc(http.MethodPatch, "/envs/:id/services/:sid", app.updateServiceHandler)
	router.HandlerFunc(http.MethodDelete, "/envs/:id/services/:sid", app.deleteServiceHandler)
	router.HandlerFunc(http.MethodGet, "/envs/:id/services/:sid", app.showServiceHandler)

	return router
}
