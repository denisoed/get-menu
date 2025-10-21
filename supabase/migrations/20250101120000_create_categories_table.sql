create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  position integer default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint categories_name_not_empty check (char_length(btrim(name)) > 0)
);

create unique index if not exists categories_name_unique on public.categories (lower(btrim(name)));

create or replace function public.handle_categories_updated_at()
returns trigger as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.handle_categories_updated_at();
