package data

import (
	"context"
	"database/sql"
	"github.com/abbasimo/oplus/internal/validator"
	"time"
)

type Rule struct {
	ID          int64
	Source      string
	Type        string
	Actions     []Action
	ActionIDs   []int64
	Audiences   []Audience
	AudienceIDs []int64
}
type RuleModel struct {
	DB *sql.DB
}

func ValidateRule(v *validator.Validator, rule *Rule) {
	v.Check(rule.Source != "", "source", "must be provided")
	v.Check(rule.Type != "", "type", "must be provided")
	v.Check(len(rule.Source) <= 50, "source", "must not be more than 50 bytes long")
	v.Check(len(rule.Type) <= 50, "type", "must not be more than 50 bytes long")
	v.Check(validator.In(rule.Source, "healthcheck", "prometheus", "elk"), "source", "must include a valid source")
}

func (r RuleModel) Insert(rule *Rule) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}

	var ruleID int64

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	ruleQuery := `insert into rules (source, type) values ($1, $2) returning id`
	err = tx.QueryRowContext(ctx, ruleQuery, rule.Source, rule.Type).Scan(&ruleID)
	if err != nil {
		tx.Rollback()
		return err
	}

	for _, actionID := range rule.ActionIDs {
		_, err = tx.ExecContext(ctx,
			`insert into rules_actions (rule_id, action_id) values ($1, $2)`,
			ruleID, actionID)
		if err != nil {
			tx.Rollback()
			return ErrDuplicateActionForRule
		}
	}

	for _, audienceID := range rule.AudienceIDs {
		_, err = tx.ExecContext(ctx,
			`insert into rules_audiences (rule_id, audience_id) values ($1, $2)`,
			ruleID, audienceID)
		if err != nil {
			tx.Rollback()
			return ErrDuplicateAudienceForRule
		}
	}

	if err = tx.Commit(); err != nil {
		return ErrFailedToCommit
	}

	// fetch actions and audiences
	// add to rule object
	return nil
}
