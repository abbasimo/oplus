package main

import (
	"errors"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/abbasimo/oplus/internal/validator"
	"net/http"
)

func (app *application) createContactHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		PhoneNumber string `json:"phone_number"`
		FullName    string `json:"full_name"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	contact := &data.Contact{
		PhoneNumber: input.PhoneNumber,
		FullName:    input.FullName,
	}

	v := validator.New()
	if data.ValidateContact(v, contact); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Contact.Insert(contact)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateRecord):
			v.AddError("phone_number", "a contact with this phone number already exists")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"contact": contact}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listContactHandler(w http.ResponseWriter, r *http.Request) {

	var input struct {
		PhoneNumber string
		FullName    string
		data.Filters
	}
	v := validator.New()
	qs := r.URL.Query()

	input.PhoneNumber = app.readString(qs, "phone_number", "")
	input.FullName = app.readString(qs, "full_name", "")
	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 20, v)
	input.Filters.Sort = app.readString(qs, "sort", "id")
	input.Filters.SortSafeList = []string{"id", "phone_number", "full_name", "-id", "-phone_number", "-full_name"}
	v.Check(len(input.FullName) <= 200, "full_name", "must not be more than 200 bytes long")
	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	contacts, metadata, err := app.models.Contact.GetAll(input.PhoneNumber, input.FullName, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"contacts": contacts, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) showContactHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	contact, err := app.models.Contact.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"contact": contact}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateContactHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	contact, err := app.models.Contact.Get(id)
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
		PhoneNumber *string `json:"phone_number"`
		FullName    *string `json:"full_name"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.PhoneNumber != nil {
		contact.PhoneNumber = *input.PhoneNumber
	}
	if input.FullName != nil {
		contact.FullName = *input.FullName
	}
	v := validator.New()
	if data.ValidateContact(v, contact); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Contact.Update(contact)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"contact": contact}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteContactHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Contact.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "contact successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
