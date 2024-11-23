drop function if exists update_healthcheck(p_service_id bigint, p_status text);
drop index if exists idx_healthcheck_status_service_start;
drop table if exists  healthcheck;
