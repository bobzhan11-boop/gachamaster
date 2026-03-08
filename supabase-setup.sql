-- ===================================================================
-- GachaMaster - Supabase Database Setup
-- ===================================================================
-- Run this SQL in your Supabase Dashboard → SQL Editor → New Query
--
-- Setup steps:
-- 1. Go to https://supabase.com → sign up free
-- 2. Create project "gachamaster", pick password, choose Singapore region
-- 3. Go to Settings → API → copy Project URL and anon public key
-- 4. Paste them into supabase-config.js (SUPABASE_URL and SUPABASE_KEY)
-- 5. Go to SQL Editor → paste this entire file → click Run
-- ===================================================================

-- ===== Profiles Table =====
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT '🎮',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ===== Game Saves Table =====
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  save_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);

-- ===== Feedback Table =====
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'suggestion',
  rating INTEGER DEFAULT 0,
  message TEXT NOT NULL,
  stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering by newest
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- ===== Chat Messages Table =====
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT DEFAULT '🎮',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering by newest
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at DESC);

-- ===================================================================
-- Row Level Security (RLS)
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ===== Profiles Policies =====
-- Anyone can read profiles (for chat, leaderboard)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ===== Game Saves Policies =====
-- Users can only see their own saves
CREATE POLICY "Users can view own saves"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saves
CREATE POLICY "Users can insert own saves"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saves
CREATE POLICY "Users can update own saves"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id);

-- ===== Feedback Policies =====
-- Anyone can read feedback (public)
CREATE POLICY "Feedback is viewable by everyone"
  ON feedback FOR SELECT
  USING (true);

-- Authenticated users can post feedback
CREATE POLICY "Authenticated users can post feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===== Chat Messages Policies =====
-- Anyone can read chat messages
CREATE POLICY "Chat messages are viewable by everyone"
  ON chat_messages FOR SELECT
  USING (true);

-- Authenticated users can send chat messages
CREATE POLICY "Authenticated users can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===================================================================
-- Realtime - Enable for chat
-- ===================================================================
-- Enable realtime for chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ===================================================================
-- Auto-create profile when user signs up
-- ===================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || LEFT(NEW.id::text, 8)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ===================================================================
-- Function to update last_seen on profile
-- ===================================================================
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET last_seen = NOW() WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: update last_seen when game is saved
CREATE TRIGGER on_game_save_update_last_seen
  AFTER INSERT OR UPDATE ON game_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_last_seen();

-- ===================================================================
-- Function to count online players (seen in last 15 minutes)
-- ===================================================================
CREATE OR REPLACE FUNCTION get_online_player_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM profiles WHERE last_seen > NOW() - INTERVAL '15 minutes');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- Function to get total player count
-- ===================================================================
CREATE OR REPLACE FUNCTION get_total_player_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM profiles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
