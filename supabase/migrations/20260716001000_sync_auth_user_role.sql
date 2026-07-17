-- Keep Supabase Auth metadata in sync with the app users table role.
create or replace function public.sync_auth_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_role text;
  resolved_role public.user_role_enum;
  resolved_name text;
begin
  raw_role := lower(coalesce(new.raw_user_meta_data->>'role', ''));
  resolved_role := case
    when raw_role = 'guru' then 'guru'::public.user_role_enum
    else 'siswa'::public.user_role_enum
  end;

  resolved_name := coalesce(
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    split_part(coalesce(new.email, ''), '@', 1)
  );

  update public.users
  set
    username = coalesce(resolved_name, username),
    email = coalesce(new.email, email),
    role = resolved_role,
    updated_at = now()
  where lower(email) = lower(new.email);

  return new;
end;
$$;

drop trigger if exists trg_sync_auth_user_role on auth.users;
create trigger trg_sync_auth_user_role
after insert or update of raw_user_meta_data, email on auth.users
for each row
execute function public.sync_auth_user_role();
