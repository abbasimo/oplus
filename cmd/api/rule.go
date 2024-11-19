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
		Source:      input.Source,
		Type:        input.Type,
		AudienceIDs: input.AudienceIDs,
		ActionIDs:   input.ActionIDs,
	}

	v := validator.New()
	if data.ValidateRule(v, rule); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Rule.Insert(rule)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateActionForRule):
			v.AddError("action_ids", "the action already exists")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrActionNotFound):
			v.AddError("action_ids", "the action not found")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrAudienceNotFound):
			v.AddError("audience_ids", "the audience not found")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrDuplicateAudienceForRule):
			v.AddError("audience_ids", "the audience already exists")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrFailedToCommit):
			v.AddError("message", "failed to commit transaction")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	rule.Actions, err = app.models.Action.GetByRuleID(rule.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	rule.Audiences, err = app.models.Audience.GetByRuleID(rule.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"rule": rule}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteRuleHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Rule.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "rule successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showRuleHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	rule, err := app.models.Rule.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"rule": rule}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateRuleHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	rule, err := app.models.Rule.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Source      *string `json:"source"`
		Type        *string `json:"type"`
		ActionIDs   *[]int  `json:"action_ids"`
		AudienceIDs *[]int  `json:"audience_ids"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Source != nil {
		rule.Source = *input.Source
	}
	if input.Type != nil {
		rule.Type = *input.Type
	}
	if input.ActionIDs != nil {
		rule.ActionIDs = *input.ActionIDs
	}
	if input.AudienceIDs != nil {
		rule.AudienceIDs = *input.AudienceIDs
	}

	v := validator.New()
	if data.ValidateRule(v, rule); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Rule.Update(rule)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		case errors.Is(err, data.ErrDuplicateActionForRule):
			v.AddError("action_ids", "the action already exists")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrActionNotFound):
			v.AddError("action_ids", "the action not found")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrAudienceNotFound):
			v.AddError("audience_ids", "the audience not found")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrDuplicateAudienceForRule):
			v.AddError("audience_ids", "the audience already exists")
			app.failedValidationResponse(w, r, v.Errors)
		case errors.Is(err, data.ErrFailedToCommit):
			v.AddError("message", "failed to commit transaction")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"rule": rule}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listRuleHandler(w http.ResponseWriter, r *http.Request) {

	var input struct {
		Source string
		Type   string
		data.Filters
	}
	v := validator.New()
	qs := r.URL.Query()

	input.Source = app.readString(qs, "source", "")
	input.Type = app.readString(qs, "type", "")
	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 20, v)
	input.Filters.Sort = app.readString(qs, "sort", "id")
	input.Filters.SortSafeList = []string{"id", "source", "type", "-id", "-source", "-type"}
	v.Check(len(input.Source) <= 200, "source", "must not be more than 200 bytes long")
	v.Check(len(input.Type) <= 200, "type", "must not be more than 200 bytes long")
	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	rules, metadata, err := app.models.Rule.GetAll(input.Source, input.Type, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	for _, rule := range rules {
		rule.Audiences, err = app.models.Audience.GetByRuleID(rule.ID)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		rule.Actions, err = app.models.Action.GetByRuleID(rule.ID)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"rules": rules, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
