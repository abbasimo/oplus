package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/abbasimo/oplus/internal/validator"
	"time"
)

type Rule struct {
	ID          int64       `json:"id"`
	Source      string      `json:"source"`
	Type        string      `json:"type"`
	Actions     []*Action   `json:"actions"`
	ActionIDs   []int       `json:"-"`
	Audiences   []*Audience `json:"audiences"`
	AudienceIDs []int       `json:"-"`
	CreatedAt   time.Time   `json:"-"`
	Version     int         `json:"-"`
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
	v.Check(len(rule.ActionIDs) > 0, "actions", "must be more than 0")
	v.Check(len(rule.AudienceIDs) > 0, "audiences", "must be more than 0")
}

func (r RuleModel) Insert(rule *Rule) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	ruleQuery := `insert into rules (source, type) values ($1, $2) returning id`
	err = tx.QueryRowContext(ctx, ruleQuery, rule.Source, rule.Type).Scan(&rule.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	for _, actionID := range rule.ActionIDs {
		_, err = tx.ExecContext(ctx,
			`insert into rules_actions (rule_id, action_id) values ($1, $2)`,
			rule.ID, actionID)
		if err != nil {
			tx.Rollback()
			if err.Error() == `pq: insert or update on table "rules_actions" violates foreign key constraint "rules_actions_action_id_fkey"` {
				return ErrActionNotFound
			} else if err.Error() == `pq: duplicate key value violates unique constraint "rules_actions_pkey"` {
				return ErrDuplicateActionForRule
			}
			return err
		}
	}

	for _, audienceID := range rule.AudienceIDs {
		_, err = tx.ExecContext(ctx,
			`insert into rules_audiences (rule_id, audience_id) values ($1, $2)`,
			rule.ID, audienceID)
		if err != nil {
			tx.Rollback()
			if err.Error() == `pq: insert or update on table "rules_audiences" violates foreign key constraint "rules_audiences_audience_id_fkey"` {
				return ErrAudienceNotFound
			} else if err.Error() == `pq: duplicate key value violates unique constraint "rules_audiences_pkey"` {
				return ErrDuplicateAudienceForRule
			}
			return err
		}
	}

	if err = tx.Commit(); err != nil {
		return ErrFailedToCommit
	}

	return nil
}

func (r RuleModel) Delete(ruleID int64) error {
	if ruleID < 1 {
		return ErrRecordNotFound
	}

	query := `delete from rules where id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := r.DB.ExecContext(ctx, query, ruleID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}

func (r RuleModel) Get(id int64) (*Rule, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `select id, type, source, version, created_at from rules where id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var rule Rule
	err := r.DB.QueryRowContext(ctx, query, id).Scan(
		&rule.ID,
		&rule.Type,
		&rule.Source,
		&rule.Version,
		&rule.CreatedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	actionQuery := `select a.id, a.title, a.version, a.created_at from actions a  
    				left join public.rules_actions ra on a.id = ra.action_id where ra.rule_id = $1`

	actionRows, err := r.DB.QueryContext(ctx, actionQuery, id)
	if err != nil {
		return nil, err
	}
	defer actionRows.Close()

	actions := make([]*Action, 0)
	for actionRows.Next() {
		var action Action
		if err := actionRows.Scan(
			&action.ID,
			&action.Title,
			&action.Version,
			&action.CreatedAt); err != nil {
			return nil, err
		}
		actions = append(actions, &action)
	}
	rule.Actions = actions

	audienceQuery := `select a.id, a.title, a.description, a.version, a.created_at from audiences a 
					left join public.rules_audiences ra on a.id = ra.audience_id where ra.rule_id = $1`

	audienceRows, err := r.DB.QueryContext(ctx, audienceQuery, id)
	if err != nil {
		return nil, err
	}
	defer audienceRows.Close()

	audiences := make([]*Audience, 0)
	for audienceRows.Next() {
		var audience Audience
		if err := audienceRows.Scan(
			&audience.ID,
			&audience.Title,
			&audience.Description,
			&audience.Version,
			&audience.CreatedAt); err != nil {
			return nil, err
		}
		audiences = append(audiences, &audience)
	}
	rule.Audiences = audiences

	return &rule, nil
}

func (r RuleModel) Update(rule *Rule) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}

	query := `  update rules set source = $1, type = $2, version = version + 1
				where id = $3 and version = $4 returning version`

	args := []interface{}{
		rule.Source,
		rule.Type,
		rule.ID,
		rule.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err = tx.QueryRowContext(ctx, query, args...).Scan(&rule.Version)
	if err != nil {
		tx.Rollback()
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}

	_, err = tx.ExecContext(ctx, `delete from rules_actions where rule_id = $1`, rule.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.ExecContext(ctx, `delete from rules_audiences where rule_id = $1`, rule.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	for _, actionID := range rule.ActionIDs {
		_, err = tx.ExecContext(ctx,
			`insert into rules_actions (rule_id, action_id) values ($1, $2)`,
			rule.ID, actionID)
		if err != nil {
			tx.Rollback()
			if err.Error() == `pq: insert or update on table "rules_actions" violates foreign key constraint "rules_actions_action_id_fkey"` {
				return ErrActionNotFound
			} else if err.Error() == `pq: duplicate key value violates unique constraint "rules_actions_pkey"` {
				return ErrDuplicateActionForRule
			}
			return err
		}
	}

	for _, audienceID := range rule.AudienceIDs {
		_, err = tx.ExecContext(ctx,
			`insert into rules_audiences (rule_id, audience_id) values ($1, $2)`,
			rule.ID, audienceID)
		if err != nil {
			tx.Rollback()
			if err.Error() == `pq: insert or update on table "rules_audiences" violates foreign key constraint "rules_audiences_audience_id_fkey"` {
				return ErrAudienceNotFound
			} else if err.Error() == `pq: duplicate key value violates unique constraint "rules_audiences_pkey"` {
				return ErrDuplicateAudienceForRule
			}
			return err
		}
	}

	if err = tx.Commit(); err != nil {
		return ErrFailedToCommit
	}

	return nil
}

func (r RuleModel) GetAll(phoneNumber string, fullName string, filters Filters) ([]*Rule, Metadata, error) {

	query := fmt.Sprintf(`select count(*) over(), id, source, type, created_at, version from rules
								where (source = $1 or $1 = '') and (type = $2 or $2 = '')
								order by %s %s, id asc limit $3 offset $4`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{phoneNumber, fullName, filters.limit(), filters.offset()}

	rows, err := r.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	rules := []*Rule{}
	for rows.Next() {
		var rule Rule
		err := rows.Scan(
			&totalRecords,
			&rule.ID,
			&rule.Source,
			&rule.Type,
			&rule.CreatedAt,
			&rule.Version,
		)
		if err != nil {
			return nil, Metadata{}, err
		}
		rules = append(rules, &rule)
	}

	if err = rows.Err(); err != nil {
		return nil, Metadata{}, err
	}
	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)
	return rules, metadata, nil
}
