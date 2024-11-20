create or replace function get_uptime(
    p_service_id bigint
) returns text as $$
declare
    last_record record;
    result int;
begin
    -- Get the last record of the specified service_id
    select id, service_id, start_time, end_time, status, version into last_record
    from healthcheck
    where service_id = p_service_id
    -- ORDER BY id DESC
    order by id desc
    limit 1;

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