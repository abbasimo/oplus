drop table if exists schedulers;

drop function if exists update_scheduler(p_service_id bigint, p_job_id uuid);
