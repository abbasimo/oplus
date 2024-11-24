create table if not exists environments (
    id bigserial primary key,
    title varchar(250) not null unique,
    description text,
    version integer not null default 1,
    created_at timestamp(0) with time zone not null default now()
);

create table if not exists services (
    id bigserial primary key,
    environment_id bigint not null references environments on delete cascade,
    title varchar(250) not null,
    description text null,
    health_check_url text not null,
    interval bigint not null,
    version integer not null default 1,
    created_at timestamp(0) with time zone not null default now()
);


create table if not exists healthcheck (
   id bigserial primary key,
   service_id bigserial not null references services on delete cascade,
   start_time timestamp(0) with time zone NOT NULL,
   end_time timestamp(0) with time zone,
   status text NOT NULL,
   version integer NOT NULL DEFAULT 1
);

-- Create index for outage view
create index idx_healthcheck_status_service_start on healthcheck (status, service_id, start_time);



create or replace function update_healthcheck(p_service_id bigint, p_status text)
    returns text as $$
declare
    last_record record;
    result_text text;
begin
    -- Step 1: Get the last record of the specified service_id
    select id, service_id, start_time, end_time, status, version into last_record
    from healthcheck where service_id = p_service_id order by id desc limit 1;

    -- Step 2: If no record exists for the service_id, insert a new record
    if last_record is null then
        insert into healthcheck (service_id, start_time, status)
        values (p_service_id, NOW(), p_status);
        result_text := 'inserted';
    else
        -- Step 3: Check if the status of the last record matches the provided status
        if last_record.status = p_status then
            -- Step 4: If status matches, do nothing
            result_text := 'no-action';

        else
            -- Step 5: If status does not match, update end_time of the last record and insert a new record
            update healthcheck set end_time = now() where id = last_record.id;

            insert into healthcheck (service_id, start_time, status)
            values (p_service_id, NOW(), p_status);
            result_text := 'changed';
        end if;
    end if;
    return result_text;
end;
$$ language plpgsql;


create or replace function get_uptime(p_service_id bigint) returns text as $$
declare
    last_record record;
    result int;
begin
    -- Get the last record of the specified service_id
    select id, service_id, start_time, end_time, status, version into last_record
    from healthcheck where service_id = p_service_id order by id desc limit 1;

    -- calculate uptime based on SECONDS
    if last_record.status = 'healthy' then
        result = extract(epoch from (now() - last_record.start_time))::int;
    else
        -- if status was 'unhealthy' return 0 for uptime
        result = 0;
    end if;
    return result;
end;
$$ language plpgsql;



/*
This view is represent of outages. actually it fetch all outages from 'healthcheck' table
and spans these rows on days. for example suppose we have a downtime in table healthcheck
between 2024-10-5 to 2024-10-8. this lag in following function generates 3 rows like this:
1. 2024-10-5 to 2024-10-6
2. 2024-10-6 to 2024-10-7
3. 2024-10-7 to 2024-10-8
*/
create or replace view outages_90days_view as (
with healthcheck_filtered as (
  select id, service_id, status, start_time, coalesce(end_time, now()) as end_time
  from healthcheck where status = 'unhealthy' and start_time >= now() - interval '90 days'
),
   daily_segments as (
       select id, service_id, status, start_time::date as day,
              greatest(start_time, day::timestamp) as segment_start_time,
              least(end_time, (day + interval '1 day')::timestamp) as segment_end_time
       from (
                select id, service_id, status, start_time, end_time,
                       generate_series(start_time::date, end_time::date, '1 day'::interval) as day
                from healthcheck_filtered) as expanded)

select id, service_id, segment_start_time::date as day, segment_start_time, segment_end_time,
     extract(epoch from segment_end_time - segment_start_time) as downtime_seconds
from daily_segments order by day, segment_start_time
);