Supabase Setup Guide
Ikuti langkah-langkah berikut untuk setup project Supabase baru:

Buka Supabase dan buat akun/login.
Klik New Project dan buat project baru (simpan password database Anda).
Setelah project selesai dibuat, masuk ke menu Project Settings -> API.
Salin Project URL, anon public key, dan service_role secret key.
Buka file .env.local di project Anda dan masukkan nilai tersebut (saya sudah update template-nya).
Buka menu SQL Editor di Supabase, buat query baru, paste seluruh kode SQL di bawah ini, dan klik Run.
Storage Setup
Masuk ke menu Storage di Supabase.
Buat bucket baru bernama svarga-images (huruf kecil semua).
Pastikan bucket diatur sebagai Public.
Authentication Setup
Masuk ke menu Authentication -> Providers.
Pastikan Email enabled.
Masuk ke menu Authentication -> Users.
Klik Add User -> Create new user.
Masukkan email admin (contoh: admin@svargadimsum.com) dan password yang aman.
User ini akan digunakan untuk login ke Admin Dashboard.
SQL Schema
sql
-- ============================================
-- 1. SITE SETTINGS (social links, contact info, hero content)
-- ============================================
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 2. MENU ITEMS
-- ============================================
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  is_best_seller BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  stars BOOLEAN[] DEFAULT '{true,true,true,true,true}',
  half_star BOOLEAN DEFAULT false,
  reviews INTEGER DEFAULT 0,
  order_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 3. OUTLETS
-- ============================================
CREATE TABLE outlets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  hours TEXT NOT NULL,
  phone TEXT NOT NULL,
  map_url TEXT,
  image TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 4. HERO SLIDES
-- ============================================
CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT NOT NULL,
  product_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 5. TESTIMONIALS (hardcoded ones, admin-managed)
-- ============================================
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating TEXT NOT NULL, -- e.g. '★★★★★'
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 6. RATINGS/REVIEWS (user-submitted, public)
-- ============================================
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 7. ANALYTICS - PAGE VIEWS
-- ============================================
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  referrer TEXT,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 8. ANALYTICS - EVENTS (clicks, interactions)
-- ============================================
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB,
  page_path TEXT,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 9. GAME - PLAYERS (migrated from Google Sheets)
-- ============================================
CREATE TABLE game_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  ip TEXT,
  status TEXT DEFAULT 'playing',
  play_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 10. GAME - VOUCHERS
-- ============================================
CREATE TABLE game_vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'unused',
  claimed_by TEXT,
  claimed_at TIMESTAMPTZ,
  player_ip TEXT
);
-- ============================================
-- 11. GAME - DAILY WINNERS
-- ============================================
CREATE TABLE game_daily_winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL,
  nama TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  voucher_code TEXT NOT NULL,
  waktu_menang TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 12. GAME - SETTINGS
-- ============================================
CREATE TABLE game_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);
-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_reviews_is_visible ON reviews(is_visible);
CREATE INDEX idx_game_players_play_date ON game_players(play_date);
CREATE INDEX idx_game_players_whatsapp ON game_players(whatsapp);
-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_daily_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;
-- Public read access (anon users can read)
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read outlets" ON outlets FOR SELECT USING (true);
CREATE POLICY "Public read hero" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
-- Public insert for analytics & reviews (anon users can insert, but not read back other's data easily)
CREATE POLICY "Public insert pageviews" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
-- Game policies (users can insert players)
CREATE POLICY "Public insert players" ON game_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read players" ON game_players FOR SELECT USING (true);
CREATE POLICY "Public update players" ON game_players FOR UPDATE USING (true);
CREATE POLICY "Public read winners" ON game_daily_winners FOR SELECT USING (true);
CREATE POLICY "Public read game settings" ON game_settings FOR SELECT USING (true);
-- Admins (authenticated users) can do everything on all tables
-- We use a generic policy for authenticated users
CREATE POLICY "Admin all access menu" ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access outlets" ON outlets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access hero" ON hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access reviews" ON reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access page_views" ON page_views FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access analytics_events" ON analytics_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access game_players" ON game_players FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access game_vouchers" ON game_vouchers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access game_daily_winners" ON game_daily_winners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all access game_settings" ON game_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Storage Policy
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'svarga-images' );
-- Allow authenticated users to upload/update/delete
CREATE POLICY "Admin Access" ON storage.objects FOR ALL TO authenticated USING ( bucket_id = 'svarga-images' ) WITH CHECK ( bucket_id = 'svarga-images' );
-- Enable Realtime for reviews
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
