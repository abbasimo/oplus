package healthcheck

import (
	"errors"
	"net/http"
	"time"
)

var (
	ErrRequestFailed      = errors.New("request failed")
	ErrServiceUnreachable = errors.New("service unreachable")
)

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

func CheckServiceHealth(svcUrl string) {
	// if request failed: ignore that period and log an error
	// if service unreachable submit a outage in database
	// if service was okay, submit success in database
	//--------------------------------------------------------
	// maybe it's better to create healthcheck model to use database access
	// maybe it's better to transport this file to data package
	ok, err := pingService("http://localhost:5000")
	if err != nil {
		switch {
		case errors.Is(err, ErrRequestFailed):
			// do something
		case errors.Is(err, ErrServiceUnreachable):
			// do something
		default:
			// log error
		}
		return
	}
	if ok {
		// do something
	}

}
