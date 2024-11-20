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







SELECT
    id,
    service_id,
    start_time::date AS day,
    GREATEST(start_time, start_time::date::timestamp) AS start_time,
    LEAST(COALESCE(end_time, now()), start_time::date::timestamp + INTERVAL '1 day') AS end_time,
    EXTRACT(EPOCH FROM LEAST(COALESCE(end_time, now()), start_time::date::timestamp + INTERVAL '1 day')
        - GREATEST(start_time, start_time::date::timestamp)) AS downtime_seconds
FROM healthcheck
WHERE status = 'unhealthy'
  AND service_id = 1
  AND start_time >= NOW() - INTERVAL '90 days';