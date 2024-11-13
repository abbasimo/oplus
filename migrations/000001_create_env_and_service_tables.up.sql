CREATE TABLE IF NOT EXISTS environment (
        id bigserial PRIMARY KEY,
        title varchar(250) NOT NULL UNIQUE,
        description text,
        version integer NOT NULL DEFAULT 1,
        created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service ( -- TODO: is not better to use plural of noun?
      id bigserial PRIMARY KEY,
      environment_id bigint NOT NULL REFERENCES environment ON DELETE CASCADE,
      title varchar(250) NOT NULL,
      description text NULL,
      status text, -- TODO: add not null to this field
      health_check_url text NOT NULL,
      interval bigint NOT NULL, -- TODO: add default value of 3 seconds
      version integer NOT NULL DEFAULT 1,
      created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

