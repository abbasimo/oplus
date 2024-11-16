package data

import "github.com/abbasimo/oplus/internal/validator"

type Rule struct {
	ID        int64
	Source    string
	Type      string
	Actions   []Action
	Audiences []Audience
}

func ValidateRule(v *validator.Validator, rule *Rule) {
	v.Check(rule.Source != "", "source", "must be provided")
	v.Check(rule.Type != "", "type", "must be provided")
	v.Check(len(rule.Source) <= 50, "source", "must not be more than 50 bytes long")
	v.Check(len(rule.Type) <= 50, "type", "must not be more than 50 bytes long")
	v.Check(validator.In(rule.Source, "healthcheck", "prometheus", "elk"), "source", "must include a valid source")
}
