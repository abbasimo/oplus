package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) routes() http.Handler {
	//NEEDS

	// match endpoints with pages
	// healthcheck page (view)		not-ready
	// healthcheck page (setting)	not-ready
	// healthcheck details			not-ready
	// event manager (view)			not-ready
	// event manager (setting)		not-ready
	// dashboard (first page)		not-ready

	router := httprouter.New()
	//TODO: I think env and service is a single aggregate!
	//TODO: I think i need some dto to return query, maybe in its file!
	router.HandlerFunc(http.MethodPost, "/envs", app.createEnvironmentHandler)       // checked
	router.HandlerFunc(http.MethodGet, "/envs", app.listEnvironmentHandler)          // checked
	router.HandlerFunc(http.MethodGet, "/envs/:id", app.showEnvironmentHandler)      // checked
	router.HandlerFunc(http.MethodPatch, "/envs/:id", app.updateEnvironmentHandler)  // checked
	router.HandlerFunc(http.MethodDelete, "/envs/:id", app.deleteEnvironmentHandler) // checked

	router.HandlerFunc(http.MethodPost, "/envs/:id/services", app.createServiceHandler)                  // checked
	router.HandlerFunc(http.MethodGet, "/envs/:id/services/:sid", app.showServiceHandler)                // checked
	router.HandlerFunc(http.MethodGet, "/envs/:id/services/:sid/outages", app.showServiceOutagesHandler) // checked
	router.HandlerFunc(http.MethodPatch, "/envs/:id/services/:sid", app.updateServiceHandler)            // checked
	router.HandlerFunc(http.MethodDelete, "/envs/:id/services/:sid", app.deleteServiceHandler)           // checked

	router.HandlerFunc(http.MethodPost, "/audiences", app.createAudienceHandler)                            // checked
	router.HandlerFunc(http.MethodGet, "/audiences", app.listAudienceHandler)                               // checked
	router.HandlerFunc(http.MethodGet, "/audiences/:id", app.showAudienceHandler)                           // checked
	router.HandlerFunc(http.MethodPatch, "/audiences/:id", app.updateAudienceHandler)                       // checked
	router.HandlerFunc(http.MethodDelete, "/audiences/:id", app.deleteAudienceHandler)                      // checked
	router.HandlerFunc(http.MethodPut, "/audiences/:id/contacts/:cid", app.mappingContactToAudienceHandler) // checked

	router.HandlerFunc(http.MethodPost, "/contacts", app.createContactHandler)       // checked
	router.HandlerFunc(http.MethodGet, "/contacts", app.listContactHandler)          // checked
	router.HandlerFunc(http.MethodGet, "/contacts/:id", app.showContactHandler)      // checked
	router.HandlerFunc(http.MethodPatch, "/contacts/:id", app.updateContactHandler)  // checked
	router.HandlerFunc(http.MethodDelete, "/contacts/:id", app.deleteContactHandler) // checked

	router.HandlerFunc(http.MethodPost, "/rules", app.createRuleHandler)       // checked
	router.HandlerFunc(http.MethodGet, "/rules", app.listRuleHandler)          // checked
	router.HandlerFunc(http.MethodGet, "/rules/:id", app.showRuleHandler)      // checked
	router.HandlerFunc(http.MethodPatch, "/rules/:id", app.updateRuleHandler)  // checked
	router.HandlerFunc(http.MethodDelete, "/rules/:id", app.deleteRuleHandler) // checked

	return router
}
