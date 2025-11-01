create extension if not exists "pgcrypto";

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint tags_name_not_empty check (char_length(btrim(name)) > 0)
);

create unique index if not exists tags_name_unique on public.tags (lower(btrim(name)));

create or replace function public.handle_tags_updated_at()
returns trigger as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger tags_set_updated_at
before update on public.tags
for each row
execute function public.handle_tags_updated_at();

create or replace function public.array_has_duplicates(values uuid[])
returns boolean as $$
declare
  distinct_values uuid[];
begin
  if values is null then
    return false;
  end if;

  select array_agg(distinct v) into distinct_values from unnest(values) as v;

  return cardinality(distinct_values) <> cardinality(values);
end;
$$ language plpgsql immutable;

alter table if exists public.menu_items
  add column if not exists tag_ids uuid[] not null default '{}'::uuid[];

alter table if exists public.menu_items
  add constraint menu_items_tag_ids_no_duplicates check (not public.array_has_duplicates(tag_ids));

alter table if exists public.menu_items
  alter column updated_at set default timezone('utc', now());

create or replace function public.remove_tag_references()
returns trigger as $$
begin
  update public.menu_items
  set tag_ids = array_remove(coalesce(tag_ids, '{}'::uuid[]), old.id)
  where array_position(coalesce(tag_ids, '{}'::uuid[]), old.id) is not null;

  return old;
end;
$$ language plpgsql;

create trigger tags_cleanup_menu_items
before delete on public.tags
for each row
execute function public.remove_tag_references();

create or replace function public.remove_tag_from_menu_items(tag_id uuid)
returns void as $$
begin
  update public.menu_items
  set tag_ids = array_remove(coalesce(tag_ids, '{}'::uuid[]), tag_id)
  where array_position(coalesce(tag_ids, '{}'::uuid[]), tag_id) is not null;
end;
$$ language plpgsql security definer;
