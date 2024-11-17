package main

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func (app *application) routes() http.Handler {
	//NEEDS

	// 0. Create audience group (crud)
	// 1. Add contacts to specific audience (create contact) (crud)
	// 2. Create rule (crud)
	// 3. Create receive event endpoint

	// when an event received, fetch all rules, do according rule, then submit event on database

	// endpoints:
	// POST		/audiences						done
	// GET		/audiences						done
	// GET		/audiences/:id					done
	// DELETE	/audiences/:id					done
	// PATCH	/audiences/:id					done
	// PUT		/audiences/:id/contacts/:cid	done
	//-------------------------------------
	// POST		/contacts		done
	// GET		/contacts		done
	// GET		/contacts/:id	done
	// DELETE	/contacts/:id	done
	// PATCH	/contacts/:id	done
	//-------------------------------------
	// POST		/rules		done
	// GET		/rules		not-ready
	// GET		/rules/:id	done
	// DELETE	/rules/:id	done
	// PATCH	/rules/:id	done
	//-------------------------------------
	// POST		/events		not-ready

	router := httprouter.New()
	//TODO: I think env and service is a aggregate!
	//TODO: I think i need some dto to return query, maybe in its file!
	//TODO: what if user edit or delete a service !!!! must to save job information.
	router.HandlerFunc(http.MethodPost, "/envs", app.createEnvironmentHandler)
	router.HandlerFunc(http.MethodGet, "/envs", app.listEnvironmentHandler)
	router.HandlerFunc(http.MethodGet, "/envs/:id", app.showEnvironmentHandler)
	router.HandlerFunc(http.MethodPatch, "/envs/:id", app.updateEnvironmentHandler)
	router.HandlerFunc(http.MethodDelete, "/envs/:id", app.deleteEnvironmentHandler)

	router.HandlerFunc(http.MethodPost, "/envs/:id/services", app.createServiceHandler)
	router.HandlerFunc(http.MethodGet, "/envs/:id/services/:sid", app.showServiceHandler)
	router.HandlerFunc(http.MethodPatch, "/envs/:id/services/:sid", app.updateServiceHandler)
	router.HandlerFunc(http.MethodDelete, "/envs/:id/services/:sid", app.deleteServiceHandler)

	router.HandlerFunc(http.MethodPost, "/audiences", app.createAudienceHandler)
	router.HandlerFunc(http.MethodGet, "/audiences", app.listAudienceHandler)
	router.HandlerFunc(http.MethodGet, "/audiences/:id", app.showAudienceHandler)
	router.HandlerFunc(http.MethodPatch, "/audiences/:id", app.updateAudienceHandler)
	router.HandlerFunc(http.MethodDelete, "/audiences/:id", app.deleteAudienceHandler)
	router.HandlerFunc(http.MethodPut, "/audiences/:id/contacts/:cid", app.mappingContactToAudienceHandler)

	router.HandlerFunc(http.MethodPost, "/contacts", app.createContactHandler)
	router.HandlerFunc(http.MethodGet, "/contacts", app.listContactHandler)
	router.HandlerFunc(http.MethodGet, "/contacts/:id", app.showContactHandler)
	router.HandlerFunc(http.MethodPatch, "/contacts/:id", app.updateContactHandler)
	router.HandlerFunc(http.MethodDelete, "/contacts/:id", app.deleteContactHandler)

	router.HandlerFunc(http.MethodPost, "/rules", app.createRuleHandler)
	router.HandlerFunc(http.MethodGet, "/rules", app.listRuleHandler)
	router.HandlerFunc(http.MethodGet, "/rules/:id", app.showRuleHandler)
	router.HandlerFunc(http.MethodPatch, "/rules/:id", app.updateRuleHandler)
	router.HandlerFunc(http.MethodDelete, "/rules/:id", app.deleteRuleHandler)

	return router
}
