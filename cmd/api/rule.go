package main

import (
	"errors"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/abbasimo/oplus/internal/validator"
	"net/http"
)

func (app *application) createRuleHandler(w http.ResponseWriter, r *http.Request) {

	var input struct {
		Source      string `json:"source"`
		Type        string `json:"type"`
		ActionIDs   []int  `json:"action_ids"`
		AudienceIDs []int  `json:"audience_ids"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	rule := &data.Rule{
		Source: input.Source,
		Type:   input.Type,
	}

	v := validator.New()
	if data.ValidateRule(v, rule); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Audience.Insert(rule)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateTitle):
			v.AddError("title", "a audience with this title already exists")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"audience": audience}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
