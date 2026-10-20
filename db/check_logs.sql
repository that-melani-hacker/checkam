-- Anonymous check log (contract: CheckLog in lib/types.ts). Written by lib/log/checkLog.ts.
-- Run once in the Supabase SQL editor. Never add columns for the photo, names, phone numbers,
-- location, IP address or device details.
create table if not exists public.check_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  verdict text not null check (verdict in ('no_red_flags', 'mismatch', 'not_found', 'expired', 'unreadable')),
  nafdac_no text,
  product_name text,
  failed_fields text[] not null default '{}',
  tag text check (tag is null or tag ~ '^(T(0[1-9]|1[0-9]|20)|demo)$')
);

-- Only the server's secret key can read or write; the public (publishable) key can't.
alter table public.check_logs enable row level security;

-- Let the Supabase API see the new table straight away.
notify pgrst, 'reload schema';

-- Pitch numbers from Tuesday's user tests, for example:
--   select verdict, count(*) from check_logs where tag like 'T%' group by verdict;
