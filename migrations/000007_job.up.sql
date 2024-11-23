create table if not exists schedulers (
      service_id bigint not null references service on delete cascade,
      job_id uuid,
      primary key (service_id)
);


create or replace function update_scheduler(
    p_service_id bigint,
    p_job_id uuid
) returns text as $$
declare
    record record;
    result text;
begin
    -- Get the record of the specified service_id
    select service_id, job_id into record
    from schedulers
    where service_id = p_service_id;


    -- If no record exists for the service_id, insert a new record
    if record is null then
        insert into schedulers (service_id, job_id)
        values (p_service_id, p_job_id);
        result = 'inserted';
    else
        -- update existing record to new job_id
        update schedulers
        set job_id = p_job_id
        where service_id = p_service_id;
        result = 'updated';
    end if;
    return result;
end;
$$ language plpgsql;




create or replace view outages_90days_view as (
WITH healthcheck_filtered AS (
    SELECT
        id,
        service_id,
        status,
        start_time,
        COALESCE(end_time, NOW()) AS end_time
    FROM healthcheck
    WHERE status = 'unhealthy'
      AND start_time >= NOW() - INTERVAL '90 days'
),
     daily_segments AS (
         SELECT
             id,
             service_id,
             status,
             start_time::date AS day,
             GREATEST(start_time, day::timestamp) AS segment_start_time,
             LEAST(end_time, (day + INTERVAL '1 day')::timestamp) AS segment_end_time
         FROM (
                  SELECT
                      id,
                      service_id,
                      status,
                      start_time,
                      end_time,
                      generate_series(
                              start_time::date,
                              end_time::date,
                              '1 day'::interval
                      ) AS day
                  FROM healthcheck_filtered
              ) AS expanded
     )
SELECT
    id,
    service_id,
    segment_start_time::date AS day,
    segment_start_time,
    segment_end_time,
    EXTRACT(EPOCH FROM segment_end_time - segment_start_time) AS downtime_seconds
FROM daily_segments
ORDER BY day, segment_start_time);

