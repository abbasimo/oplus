drop view if exists outages_90days_view;
drop table if exists healthcheck;
drop table if exists services;
drop table if exists environments;
drop function if exists update_healthcheck(p_service_id bigint, p_status text);
drop function if exists get_uptime(p_service_id bigint);
drop index if exists idx_healthcheck_status_service_start;

