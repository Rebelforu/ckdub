-- CKDub Migration: Add server name fields + DoodStream support
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

ALTER TABLE episodes ADD COLUMN IF NOT EXISTS server_1_name TEXT;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS server_2_name TEXT;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS server_3_name TEXT;

-- Optional: prevent duplicate episode numbers per drama
-- (run this ONLY after deleting any existing duplicates)
-- ALTER TABLE episodes ADD CONSTRAINT episodes_drama_episode_unique UNIQUE (drama_id, episode_number);

-- Confirm columns exist
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'episodes'
ORDER BY ordinal_position;
