-- Create a table for public profiles
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users not null
);

-- Set up Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Policy: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
on bookmarks for select
using ( auth.uid() = user_id );

-- Policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
on bookmarks for insert
with check ( auth.uid() = user_id );

-- Policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
on bookmarks for delete
using ( auth.uid() = user_id );

-- Realtime
alter publication supabase_realtime add table bookmarks;
