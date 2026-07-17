-- Migration: Add device tracking to game_players and winner details to game_daily_winners
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Add device tracking columns to game_players
-- ============================================
ALTER TABLE game_players ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE game_players ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE game_players ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE game_players ADD COLUMN IF NOT EXISTS device_type TEXT;

-- ============================================
-- 2. Add device tracking columns to game_daily_winners
-- ============================================
ALTER TABLE game_daily_winners ADD COLUMN IF NOT EXISTS ip TEXT;
ALTER TABLE game_daily_winners ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE game_daily_winners ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE game_daily_winners ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE game_daily_winners ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE game_daily_winners ADD COLUMN IF NOT EXISTS play_duration NUMERIC;

-- ============================================
-- 3. Insert default game settings
-- ============================================
INSERT INTO game_settings (key, value) VALUES
  ('game_active', 'false'),
  ('game_start_hour', '01:00'),
  ('game_end_hour', '05:00'),
  ('game_max_winners', '1'),
  ('game_difficulty', 'medium'),
  ('game_timer', '45'),
  ('game_lives', '3'),
  ('game_pairs', '6')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 4. Add index for faster winner queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_game_daily_winners_tanggal ON game_daily_winners(tanggal);
CREATE INDEX IF NOT EXISTS idx_game_players_status ON game_players(status);
