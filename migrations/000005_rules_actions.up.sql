create table rules (
  id bigserial primary key,
  source text not null,
  type text not null,
  version integer NOT NULL DEFAULT 1,
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

create table actions (
     id bigserial primary key,
     title text not null,
     version integer NOT NULL DEFAULT 1,
     created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

insert into actions (id, title) values (1, 'sms');

create table rules_audiences (
    rule_id bigint not null references rules on delete cascade,
    audience_id bigint not null references audiences on delete cascade,
    primary key(rule_id, audience_id)
);

create table rules_actions (
   rule_id bigint not null references rules on delete cascade,
   action_id bigint not null references actions on delete cascade,
   primary key(rule_id, action_id)
);

