-- Run once in the SQL Editor of the dedicated Skolkök Supabase project.
create table public.skolkok_members (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.skolkok_members enable row level security;
create policy member_self on public.skolkok_members for select to authenticated using (user_id=(select auth.uid()));
grant select on public.skolkok_members to authenticated;
revoke all on public.skolkok_members from anon;

create table public.recipes (owner_id uuid not null references auth.users(id) on delete cascade, id uuid not null, data jsonb not null, updated timestamptz not null default now(), primary key(owner_id,id));
create table public.settings (owner_id uuid not null references auth.users(id) on delete cascade, id text not null, data jsonb not null, primary key(owner_id,id));
alter table public.recipes enable row level security;
alter table public.settings enable row level security;
create policy recipe_owner on public.recipes for all to authenticated using (owner_id=(select auth.uid()) and exists(select 1 from public.skolkok_members where user_id=(select auth.uid()))) with check (owner_id=(select auth.uid()) and exists(select 1 from public.skolkok_members where user_id=(select auth.uid())));
create policy settings_owner on public.settings for all to authenticated using (owner_id=(select auth.uid()) and exists(select 1 from public.skolkok_members where user_id=(select auth.uid()))) with check (owner_id=(select auth.uid()) and exists(select 1 from public.skolkok_members where user_id=(select auth.uid())));
grant select,insert,update,delete on public.recipes,public.settings to authenticated;
revoke all on public.recipes,public.settings from anon;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('skolkok-images','skolkok-images',false,10485760,array['image/jpeg','image/png','image/webp']);
create policy skolkok_images_select on storage.objects for select to authenticated using (bucket_id='skolkok-images' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.skolkok_members where user_id=(select auth.uid())));
create policy skolkok_images_insert on storage.objects for insert to authenticated with check (bucket_id='skolkok-images' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.skolkok_members where user_id=(select auth.uid())));

create function public.restore_skolkok(recipe_rows jsonb,school_settings jsonb default null) returns integer language plpgsql security invoker set search_path='' as $$
declare added integer;
begin
 if auth.uid() is null or not exists(select 1 from public.skolkok_members where user_id=auth.uid()) then raise exception 'Unauthorized'; end if;
 if jsonb_typeof(recipe_rows)<>'array' or jsonb_array_length(recipe_rows)>500 then raise exception 'Invalid recipes'; end if;
 insert into public.recipes(owner_id,id,data,updated) select auth.uid(),(r->>'id')::uuid,r,now() from jsonb_array_elements(recipe_rows) r on conflict(owner_id,id) do nothing;
 get diagnostics added=row_count;
 if school_settings is not null then insert into public.settings(owner_id,id,data) values(auth.uid(),'school',school_settings) on conflict(owner_id,id) do update set data=excluded.data; end if;
 return added;
end; $$;
revoke all on function public.restore_skolkok(jsonb,jsonb) from public,anon;
grant execute on function public.restore_skolkok(jsonb,jsonb) to authenticated;
