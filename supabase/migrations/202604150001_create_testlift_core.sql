-- TestLift core schema
create extension if not exists "pgcrypto";

create table if not exists public.test_cases (
  id uuid primary key default gen_random_uuid(),
  user_id text null,
  file_name text not null,
  upload_date timestamptz not null default now(),
  status text not null default 'uploaded'
    check (status in ('uploaded', 'parsing', 'review', 'approved', 'generated', 'pushed', 'failed'))
);

create table if not exists public.parsed_results (
  id uuid primary key default gen_random_uuid(),
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  title text not null,
  steps text not null,
  expected_result text not null,
  priority text not null default 'Medium'
);

create table if not exists public.generated_scripts (
  id uuid primary key default gen_random_uuid(),
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  selenium_code text not null,
  language text not null check (language in ('python', 'java')),
  created_at timestamptz not null default now()
);

alter table public.test_cases enable row level security;
alter table public.parsed_results enable row level security;
alter table public.generated_scripts enable row level security;

-- MVP policies for anon clients; tighten with auth/user ownership in production.
drop policy if exists "anon can read test_cases" on public.test_cases;
create policy "anon can read test_cases"
  on public.test_cases for select using (true);

drop policy if exists "anon can write test_cases" on public.test_cases;
create policy "anon can write test_cases"
  on public.test_cases for all using (true) with check (true);

drop policy if exists "anon can read parsed_results" on public.parsed_results;
create policy "anon can read parsed_results"
  on public.parsed_results for select using (true);

drop policy if exists "anon can write parsed_results" on public.parsed_results;
create policy "anon can write parsed_results"
  on public.parsed_results for all using (true) with check (true);

drop policy if exists "anon can read generated_scripts" on public.generated_scripts;
create policy "anon can read generated_scripts"
  on public.generated_scripts for select using (true);

drop policy if exists "anon can write generated_scripts" on public.generated_scripts;
create policy "anon can write generated_scripts"
  on public.generated_scripts for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('test-case-files', 'test-case-files', false)
on conflict (id) do nothing;

drop policy if exists "anon can upload test files" on storage.objects;
create policy "anon can upload test files"
  on storage.objects for insert
  with check (bucket_id = 'test-case-files');

drop policy if exists "anon can read test files" on storage.objects;
create policy "anon can read test files"
  on storage.objects for select
  using (bucket_id = 'test-case-files');
