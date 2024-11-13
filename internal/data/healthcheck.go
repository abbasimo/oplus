package data

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"
)

var (
	ErrRequestFailed      = errors.New("request failed")
	ErrServiceUnreachable = errors.New("service unreachable")
)

type HealthCheck struct {
	ID        int64      `json:"id"`
	ServiceID int64      `json:"service_id"`
	StartTime time.Time  `json:"start_time"`
	EndTime   *time.Time `json:"end_time"`
	Status    string     `json:"status"`
	Version   string     `json:"-"`
}

type HealthCheckModel struct {
	DB *sql.DB
	// put logger here!
}

func CheckServiceHealth(db *sql.DB, svc Service) {
	// if request failed: ignore that period and log an error
	// if service unreachable submit a outage in database
	// if service was okay, submit success in database
	//--------------------------------------------------------
	// maybe it's better to create healthcheck model to use database access
	// maybe it's better to transport this file to data package
	ok, err := pingService(svc.HealthCheckUrl)
	if err != nil {
		switch {
		case errors.Is(err, ErrRequestFailed):
			// ignore this iteration
			// must log with error severity
			// how to get logger in this place?! I can pass logger to Healthcheck  model
		case errors.Is(err, ErrServiceUnreachable):
			result, err := updateHealthCheck(db, svc.ID, "down")
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println(svc.ID, result)
		default:
			// log error
		}
		return
	}
	if ok {
		result, err := updateHealthCheck(db, svc.ID, "up")
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(svc.ID, result)
	}
}
func pingService(svcUrl string) (bool, error) {
	client := &http.Client{
		Timeout: time.Second * 2, // todo: is it better to give from config?! idk!
	}

	req, err := http.NewRequest(http.MethodHead, svcUrl, nil)
	if err != nil {
		return false, ErrRequestFailed
	}

	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return false, ErrServiceUnreachable
	}
	defer resp.Body.Close()

	return true, nil
}

func updateHealthCheck(db *sql.DB, svcID int64, status string) (string, error) {
	var result string
	query := `SELECT update_healthcheck($1, $2)`
	err := db.QueryRow(query, svcID, status).Scan(&result)

	if err != nil {
		return "", err
	}
	return result, nil
}
