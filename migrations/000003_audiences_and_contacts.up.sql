CREATE TABLE IF NOT EXISTS audiences (
    id bigserial PRIMARY KEY,
    title text NOT NULL UNIQUE,
    description text,
    version integer NOT NULL DEFAULT 1,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    id bigserial PRIMARY KEY,
    phone_number text NOT NULL UNIQUE,
    full_name text, -- TODO: is not better to use VARCHAR(200) ?!
    version integer NOT NULL DEFAULT 1,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audiences_contacts (
    audience_id bigint NOT NULL REFERENCES audiences ON DELETE CASCADE,
    contact_id bigint NOT NULL REFERENCES contacts ON DELETE CASCADE,
    version integer NOT NULL DEFAULT 1,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    PRIMARY KEY (audience_id, contact_id)
);