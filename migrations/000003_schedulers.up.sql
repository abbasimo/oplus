create table if not exists schedulers (
      service_id bigint not null references services on delete cascade,
      job_id uuid,
      primary key (service_id)
);


create or replace function update_scheduler(p_service_id bigint, p_job_id uuid) returns text as $$
declare
    record record;
    result text;
begin
    -- Get the record of the specified service_id
    select service_id, job_id into record from schedulers where service_id = p_service_id;

    -- If no record exists for the service_id, insert a new record
    if record is null then
        insert into schedulers (service_id, job_id) values (p_service_id, p_job_id);
        result = 'inserted';
    else
        -- Update existing record to new job_id
        update schedulers set job_id = p_job_id where service_id = p_service_id;
        result = 'updated';
    end if;
    return result;
end;
$$ language plpgsql;






