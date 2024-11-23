create table if not exists events (
      id bigserial primary key,
      service_id bigint not null references services on delete cascade,
      type text not null,
      source text not null,
      severity text not null,
      layer text not null,
      text text not null,
      status text not null,
      created_at timestamp(0) with time zone not null
);

create table if not exists audiences (
     id bigserial primary key,
     title text not null unique,
     description text,
     version integer not null default 1,
     created_at timestamp(0) with time zone not null default now()
);

create table if not exists contacts (
    id bigserial primary key,
    phone_number text not null unique,
    full_name text,
    version integer not null default 1,
    created_at timestamp(0) with time zone not null default now()
);

create table if not exists audiences_contacts (
      audience_id bigint not null references audiences on delete cascade,
      contact_id bigint not null references contacts on delete cascade,
      version integer not null default 1,
      created_at timestamp(0) with time zone not null default now(),
      primary key (audience_id, contact_id)
);

create table if not exists rules (
   id bigserial primary key,
   source text not null,
   type text not null,
   version integer not null default 1,
   created_at timestamp(0) with time zone not null default now()
);

create table if not exists actions (
     id bigserial primary key,
     title text not null,
     version integer not null default 1,
     created_at timestamp(0) with time zone not null default now()
);

insert into actions (id, title) values (1, 'sms') on conflict (id) do nothing;

create table if not exists rules_audiences (
     rule_id bigint not null references rules on delete cascade,
     audience_id bigint not null references audiences on delete cascade,
     primary key(rule_id, audience_id)
);

create table if not exists rules_actions (
   rule_id bigint not null references rules on delete cascade,
   action_id bigint not null references actions on delete cascade,
   primary key(rule_id, action_id)
);
