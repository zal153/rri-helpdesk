-- Migration: initial schema for users & tickets
-- Run this in Supabase SQL Editor OR via Supabase CLI (supabase db push)

-- USERS TABLE
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  nip varchar(50) unique not null,
  name varchar(255) not null,
  division varchar(255) not null,
  email varchar(255),
  phone varchar(50),
  -- NOTE: Prefer Supabase Auth. If you keep this column, store ONLY a hash, never plain text.
  password varchar(255) not null,
  role varchar(20) not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_users_role on public.users(role);

-- TICKETS TABLE
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  title varchar(500) not null,
  description text not null,
  category varchar(100) not null,
  priority varchar(20) not null,
  status varchar(20) not null default 'open',
  user_id uuid references public.users(id) on delete set null,
  admin_response text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_tickets_user_id on public.tickets(user_id);
create index if not exists idx_tickets_status on public.tickets(status);

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger trg_tickets_updated_at
  before update on public.tickets
  for each row execute function public.set_updated_at();

-- (Optional) Enable Row Level Security
alter table public.users enable row level security;
alter table public.tickets enable row level security;

-- Basic RLS Policies (adjust as needed)
-- Allow users to see their own user row
create policy "Users can select self" on public.users
  for select using ( auth.role() = 'authenticated' and auth.uid()::text = id::text );

-- Allow admins (role stored in users table) to see all users
create policy "Admins can select all users" on public.users
  for select using ( exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin') );

-- Tickets: owner can CRUD own tickets
create policy "Ticket owner select" on public.tickets for select using ( auth.uid() = user_id );
create policy "Ticket owner insert" on public.tickets for insert with check ( auth.uid() = user_id );
create policy "Ticket owner update" on public.tickets for update using ( auth.uid() = user_id );

-- Admin can see & update all tickets
create policy "Admin manage tickets" on public.tickets
  for all using ( exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin') );

-- NOTE: If you are NOT using Supabase Auth yet, you may skip RLS until auth is configured.
