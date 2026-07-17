-- Ensure the auth-facing role enum exists in Supabase as well
do $$
begin
  create type public.user_role_enum as enum ('guru', 'siswa');
exception
  when duplicate_object then null;
end $$;

-- Add role column if the table already existed before this migration
alter table if exists public.users
  add column if not exists role public.user_role_enum not null default 'siswa';

-- Keep any pre-existing rows on the student role unless they were already set
update public.users
set role = coalesce(role, 'siswa')
where role is null;

alter table public.users
  alter column role set default 'siswa';
