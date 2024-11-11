CREATE TABLE IF NOT EXISTS environment (
        id bigserial PRIMARY KEY,
        title varchar(250) NOT NULL UNIQUE,
        description text,
        version integer NOT NULL DEFAULT 1,
        created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service (
      id bigserial PRIMARY KEY,
      environment_id bigint NOT NULL REFERENCES environment ON DELETE CASCADE ,
      title varchar(250) NOT NULL,
      description text NULL,
      health_check_url text NOT NULL,
      interval bigint NOT NULL,
      version integer NOT NULL DEFAULT 1,
      created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);
