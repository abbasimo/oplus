create table if not exists events (
    id bigserial primary key,
    service_id bigint not null references service on delete cascade,
    type text not null,
    source text not null,
    severity text not null,
    layer text not null,
    text text not null,
    status text not null,
    created_at timestamp(0) with time zone not null
);