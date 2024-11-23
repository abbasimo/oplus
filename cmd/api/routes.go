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

	router.HandlerFunc(http.MethodPost, "/envs/:id/services", app.createServiceHandler)                  // not-checked
	router.HandlerFunc(http.MethodGet, "/envs/:id/services/:sid", app.showServiceHandler)                // not-checked
	router.HandlerFunc(http.MethodGet, "/envs/:id/services/:sid/outages", app.showServiceOutagesHandler) // not-checked
	router.HandlerFunc(http.MethodPatch, "/envs/:id/services/:sid", app.updateServiceHandler)            // not-checked
	router.HandlerFunc(http.MethodDelete, "/envs/:id/services/:sid", app.deleteServiceHandler)           // not-checked

	router.HandlerFunc(http.MethodPost, "/audiences", app.createAudienceHandler)                            // not-checked
	router.HandlerFunc(http.MethodGet, "/audiences", app.listAudienceHandler)                               // not-checked
	router.HandlerFunc(http.MethodGet, "/audiences/:id", app.showAudienceHandler)                           // not-checked
	router.HandlerFunc(http.MethodPatch, "/audiences/:id", app.updateAudienceHandler)                       // not-checked
	router.HandlerFunc(http.MethodDelete, "/audiences/:id", app.deleteAudienceHandler)                      // not-checked
	router.HandlerFunc(http.MethodPut, "/audiences/:id/contacts/:cid", app.mappingContactToAudienceHandler) // not-checked

	router.HandlerFunc(http.MethodPost, "/contacts", app.createContactHandler)       // not-checked
	router.HandlerFunc(http.MethodGet, "/contacts", app.listContactHandler)          // not-checked
	router.HandlerFunc(http.MethodGet, "/contacts/:id", app.showContactHandler)      // not-checked
	router.HandlerFunc(http.MethodPatch, "/contacts/:id", app.updateContactHandler)  // not-checked
	router.HandlerFunc(http.MethodDelete, "/contacts/:id", app.deleteContactHandler) // not-checked

	router.HandlerFunc(http.MethodPost, "/rules", app.createRuleHandler)       // not-checked
	router.HandlerFunc(http.MethodGet, "/rules", app.listRuleHandler)          // not-checked
	router.HandlerFunc(http.MethodGet, "/rules/:id", app.showRuleHandler)      // not-checked
	router.HandlerFunc(http.MethodPatch, "/rules/:id", app.updateRuleHandler)  // not-checked
	router.HandlerFunc(http.MethodDelete, "/rules/:id", app.deleteRuleHandler) // not-checked

	return router
}
