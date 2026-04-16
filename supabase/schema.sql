-- 初版占位 schema，后续按业务补充

create table if not exists projects (
  id text primary key,
  name text not null,
  status text not null,
  progress_percent int not null default 0,
  updated_at timestamptz not null default now()
);
