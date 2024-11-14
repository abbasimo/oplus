package main

import (
	"context"
	"database/sql"
	"flag"
	"github.com/abbasimo/oplus/internal/data"
	"github.com/abbasimo/oplus/internal/event"
	"github.com/go-co-op/gocron/v2"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog"
	"os"
	"sync"
	"time"
)

type config struct {
	port int
	env  string
	db   struct {
		dsn          string
		maxOpenConns int
		maxIdleConns int
		maxIdleTime  string
	}
}

type application struct {
	config    config
	logger    zerolog.Logger
	models    data.Models
	wg        sync.WaitGroup
	scheduler gocron.Scheduler
	eventBus  *event.EventBus
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.db.dsn, "db-dsn", os.Getenv("OPLUS_DB_DSN"), "PostgresSQL DSN")
	flag.IntVar(&cfg.db.maxOpenConns, "db-max-open-conns", 25, "PostgresSQL max open connections")
	flag.IntVar(&cfg.db.maxIdleConns, "db-max-idle-conns", 25, "PostgresSQL max idle connections")
	flag.StringVar(&cfg.db.maxIdleTime, "db-max-idle-time", "15m", "PostgresSQL max connection idle time")

	logger := zerolog.New(os.Stdout).With().
		Timestamp().
		Logger()

	db, err := openDB(cfg)
	if err != nil {
		logger.Fatal().Stack().Err(err).Msg("can not connect to database")
	}
	defer func() {
		err = db.Close()
		if err != nil {
			logger.Fatal().Err(err).Msg("can not close database")
		}
	}()
	logger.Info().Msg("database connection pool established")

	s, _ := gocron.NewScheduler()

	eventBus := event.NewEventBus()

	app := &application{
		config:    cfg,
		logger:    logger,
		models:    data.NewModels(db),
		scheduler: s,
		eventBus:  eventBus,
	}

	// make a function that initialize scheduler
	// in that function must fetch any service from database
	// then register any service as a job with specific interval
	// think about how add job in runtime
	// maybe it's better to add following scheduler in application struct till accessible from handler
	app.initializeEventsSubscriberAndHandler()
	app.initializeJobScheduler()

	err = app.serve()
	if err != nil {
		logger.Fatal().Err(err).Msg("can not start server")
	}
}

// The openDB() function returns a sql.DB connection pool.
func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	// todo: investigate about these parameters
	db.SetMaxOpenConns(cfg.db.maxOpenConns)
	db.SetMaxIdleConns(cfg.db.maxIdleConns)
	duration, err := time.ParseDuration(cfg.db.maxIdleTime)
	if err != nil {
		return nil, err
	}
	db.SetConnMaxIdleTime(duration)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil
}
