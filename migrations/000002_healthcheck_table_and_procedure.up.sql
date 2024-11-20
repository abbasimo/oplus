
CREATE TABLE IF NOT EXISTS healthcheck (
       id bigserial PRIMARY KEY,
       service_id bigserial NOT NULL REFERENCES service ON DELETE CASCADE,
       start_time timestamp(0) with time zone NOT NULL,
       end_time timestamp(0) with time zone,
       status text NOT NULL,
       version integer NOT NULL DEFAULT 1
);

 -- TODO: handle concurrency for update record with version
CREATE OR REPLACE FUNCTION update_healthcheck(
    p_service_id BIGINT,
    p_status TEXT
) RETURNS TEXT AS $$
DECLARE
    last_record RECORD;
    result_text TEXT;
BEGIN
    -- Step 1: Get the last record of the specified service_id
    SELECT id, service_id, start_time, end_time, status, version INTO last_record
    FROM healthcheck
    WHERE service_id = p_service_id
   -- ORDER BY id DESC
    ORDER BY id DESC
    LIMIT 1;

    -- Step 2: If no record exists for the service_id, insert a new record
    IF last_record IS NULL THEN
        INSERT INTO healthcheck (service_id, start_time, status)
        VALUES (p_service_id, NOW(), p_status);
        result_text := 'inserted';
    ELSE
        -- Step 3: Check if the status of the last record matches the provided status
        IF last_record.status = p_status THEN
            -- Step 4: If status matches, do nothing
            result_text := 'no-action';

        ELSE
            -- Step 5: If status does not match, update end_time of the last record and insert a new record
            UPDATE healthcheck
            SET end_time = NOW()
            WHERE id = last_record.id;

            INSERT INTO healthcheck (service_id, start_time, status)
            VALUES (p_service_id, NOW(), p_status);
            result_text := 'changed';
        END IF;
    END IF;
    RETURN result_text;
END;
$$ LANGUAGE plpgsql;
