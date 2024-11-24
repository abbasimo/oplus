package data

import (
	"context"
	"database/sql"
	"time"
)

type Action struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Version   int       `json:"-"`
	CreatedAt time.Time `json:"-"`
}

type ActionModel struct {
	DB *sql.DB
}

func (a ActionModel) GetByRuleID(ruleID int64) ([]*Action, error) {

	query := `select a.id, a.title, a.version, a.created_at from actions a 
				left join public.rules_actions ra on a.id = ra.action_id where ra.rule_id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := a.DB.QueryContext(ctx, query, ruleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	actions := make([]*Action, 0)
	for rows.Next() {
		var action Action
		if err := rows.Scan(
			&action.ID,
			&action.Title,
			&action.Version,
			&action.CreatedAt); err != nil {
			return nil, err
		}
		actions = append(actions, &action)
	}
	return actions, nil
}
