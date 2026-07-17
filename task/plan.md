Migrasi Backend ke Supabase + Admin Dashboard + Analytics + Rating System
Background
Saat ini Svarga Dimsum menggunakan Google Apps Script + Google Spreadsheet sebagai backend (hanya untuk fitur Memory Game). Semua konten landing page (menu, outlet, social links, hero images, testimonials) disimpan secara hardcoded di file TypeScript (data/menu.ts, data/outlets.ts, komponen JSX).

Tujuan Perubahan:
Ganti backend ke Supabase — hapus Google Apps Script, semua data dinamis dari Supabase
Admin Dashboard — CRUD untuk semua konten landing page (menu, outlet, social links, hero, testimonial, promo)
User Analytics — tracking pageview, visitor unik, device info, realtime dashboard
Rating/Review System — user bisa memberi rating & komentar, realtime, admin bisa hapus
User Review Required
IMPORTANT

Supabase Project: Anda perlu membuat project Supabase baru di supabase.com dan memberikan SUPABASE_URL dan SUPABASE_ANON_KEY (juga SUPABASE_SERVICE_ROLE_KEY untuk admin operations). Saya akan menyiapkan SQL schema yang tinggal di-paste ke SQL Editor Supabase.

IMPORTANT

Admin Authentication: Rencana saya menggunakan Supabase Auth dengan email/password untuk login admin. Anda perlu mendaftarkan email admin setelah setup. Alternatifnya bisa menggunakan simple password-based auth tanpa Supabase Auth — mana yang Anda prefer?

WARNING

Breaking Changes: Semua data yang sebelumnya hardcoded (menu, outlets, social links) akan dipindahkan ke database Supabase. File data/menu.ts dan data/outlets.ts akan dihapus dan diganti dengan data dari Supabase. Pastikan Anda siap untuk setup data awal di Supabase.

CAUTION

Google Apps Script Game: Fitur Memory Game yang saat ini menggunakan Google Apps Script juga akan dimigrasikan ke Supabase. Pastikan tidak ada proses game yang sedang berjalan saat migrasi.

Open Questions
IMPORTANT

Apakah sudah punya Supabase project? Atau perlu saya bantu guide pembuatannya?
Admin login: Mau pakai Supabase Auth (email/password) atau simple admin password via environment variable?
Image upload: Apakah mau upload gambar menu/promo langsung via admin dashboard ke Supabase Storage, atau tetap manual taruh di /public/img/?
Domain: Apakah admin dashboard diakses via /admin path atau subdomain terpisah?
Proposed Changes
Phase 1: Supabase Foundation & Database Schema
Supabase Database Tables
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
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
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
-- Public read access
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read outlets" ON outlets FOR SELECT USING (true);
CREATE POLICY "Public read hero" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
-- Public insert for analytics & reviews
CREATE POLICY "Public insert pageviews" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
-- Enable Realtime for reviews
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
[NEW] 
supabase.ts
Supabase client initialization — dua client: supabase (public/anon) dan supabaseAdmin (service role untuk admin operations).

typescript
import { createClient } from '@supabase/supabase-js';
// Public client (for frontend, uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// Admin client (server-side only, uses service role key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
[MODIFY] 
.env.local
Ganti Google Apps Script env vars dengan Supabase credentials:

diff
- GAME_API_URL=https://script.google.com/macros/s/...
- GAME_SECRET=svarga_secret_2026
+ NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
+ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
+ SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
+ ADMIN_PASSWORD=your_secure_admin_password
  ADMIN_WHATSAPP=6285213963005
[DELETE] 
apps-script.gs
[DELETE] 
apps-script-setup.gs
[DELETE] 
game-api.ts
Phase 2: API Routes (Server-Side)
[NEW] app/api/admin/auth/route.ts
Admin login endpoint — verifies password, returns JWT session token.

[NEW] app/api/admin/menu/route.ts
CRUD for menu items: GET (list all), POST (create), PUT (update), DELETE.

[NEW] app/api/admin/outlets/route.ts
CRUD for outlets.

[NEW] app/api/admin/settings/route.ts
CRUD for site settings (social links, hero content, contact info).

[NEW] app/api/admin/hero/route.ts
CRUD for hero slides.

[NEW] app/api/admin/testimonials/route.ts
CRUD for testimonials.

[NEW] app/api/admin/reviews/route.ts
GET all reviews (including hidden), DELETE review, toggle visibility.

[NEW] app/api/admin/analytics/route.ts
GET analytics data with filters (date range, grouping).

[NEW] app/api/reviews/route.ts
Public: GET visible reviews, POST new review.

[NEW] app/api/analytics/track/route.ts
Public: POST pageview/event tracking data.

[MODIFY] app/api/game/*/route.ts
Refactor all 4 game API routes to use Supabase instead of Google Apps Script.

Phase 3: Admin Dashboard (Frontend)
Admin dashboard di route /admin dengan layout terpisah (tanpa header/footer landing page).

File Structure:
app/admin/
  ├── layout.tsx          # Admin layout (sidebar + topbar)
  ├── page.tsx            # Dashboard overview (stats + analytics)
  ├── login/
  │   └── page.tsx        # Admin login page
  ├── menu/
  │   └── page.tsx        # Menu CRUD
  ├── outlets/
  │   └── page.tsx        # Outlets CRUD
  ├── hero/
  │   └── page.tsx        # Hero slides management
  ├── settings/
  │   └── page.tsx        # Social links, contact info, promo
  ├── testimonials/
  │   └── page.tsx        # Testimonials management
  ├── reviews/
  │   └── page.tsx        # User reviews moderation
  ├── analytics/
  │   └── page.tsx        # Detailed analytics
  └── game/
      └── page.tsx        # Game management (players, vouchers, settings)
Admin Dashboard Features:
Halaman	Fitur
Dashboard	Overview stats (total visitor hari ini, total review, total menu), grafik pageview 7 hari terakhir, review terbaru
Menu	Tabel menu + form tambah/edit (nama, kategori, harga, gambar, deskripsi, best seller toggle), hapus menu
Outlets	CRUD outlet (nama, alamat, jam, telepon, google maps embed, foto)
Hero	Kelola slider hero (upload gambar, nama produk, urutan)
Settings	Edit social media URLs (Instagram, WhatsApp, GoFood, GrabFood, ShopeeFood), contact info, promo popup image
Testimonials	Kelola testimonial yang ditampilkan di landing page
Reviews	Lihat semua review user, hapus review, toggle visibility
Analytics	Grafik visitor, device breakdown, top pages, referrer, timeline
Game	Kelola game settings, lihat players, vouchers, daily winners
Admin UI Design:
Dark sidebar dengan navigasi icon + label
Topbar dengan admin name dan logout
Card-based dashboard dengan gradient stats cards
Modal forms untuk create/edit
Confirmation dialog untuk delete
Real-time badge untuk review count
Color palette: Dark navy sidebar (#1a1f36), accent orange (#FF6B35), white cards
Phase 4: Landing Page — Dynamic Data dari Supabase
[MODIFY] 
HeroSection.tsx
Fetch hero slides dari Supabase (via API route atau direct client)
Replace hardcoded images[] dan productNames[]
[MODIFY] 
MenuSection.tsx
Fetch menu items dari Supabase instead of import { menuItems } from '@/data/menu'
Categories juga dinamis dari data
[MODIFY] 
Footer.tsx
Fetch social media URLs dari site_settings table
Fetch contact info dari site_settings
[MODIFY] 
TestimonialSlider.tsx
Fetch testimonials dari Supabase
Replace hardcoded array
[MODIFY] 
link/page.tsx
Fetch social links dari site_settings
Menu items dari Supabase
[MODIFY] 
PromoPopup.tsx
Fetch promo image URL dari site_settings
Admin bisa ganti gambar promo
[DELETE] 
data/menu.ts
[DELETE] 
data/outlets.ts
Phase 5: Analytics Tracking
[NEW] components/AnalyticsTracker.tsx
Client component yang otomatis:

Generate visitor_id (persistent di localStorage)
Generate session_id (per session, sessionStorage)
Detect device type, browser, OS dari user agent
Track pageview on mount + route change
Send data ke /api/analytics/track
[MODIFY] 
layout.tsx
Add <AnalyticsTracker /> component
Phase 6: Public Rating/Review System
[NEW] components/ReviewSection.tsx
Komponen baru di landing page:

Form: nama, rating (1-5 stars interactive), komentar
List review dari semua user (realtime via Supabase Realtime subscription)
Rata-rata rating
Sort by newest
Animasi masuk untuk review baru
[MODIFY] 
page.tsx
Add <ReviewSection /> antara TestimonialSlider dan Footer
Phase 7: Game Migration to Supabase
[MODIFY] app/api/game/status/route.ts
[MODIFY] app/api/game/start/route.ts
[MODIFY] app/api/game/finish/route.ts
[MODIFY] app/api/game/winner/route.ts
Semua game API routes akan menggunakan supabaseAdmin client langsung, menggantikan fetchFromGameApi() dan postToGameApi().

Summary of All Changes
Action	File	Description
NEW	lib/supabase.ts	Supabase client setup
NEW	app/admin/layout.tsx	Admin layout (sidebar, topbar)
NEW	app/admin/page.tsx	Admin dashboard overview
NEW	app/admin/login/page.tsx	Admin login
NEW	app/admin/menu/page.tsx	Menu CRUD
NEW	app/admin/outlets/page.tsx	Outlets CRUD
NEW	app/admin/hero/page.tsx	Hero slides management
NEW	app/admin/settings/page.tsx	Settings (social, contact, promo)
NEW	app/admin/testimonials/page.tsx	Testimonials CRUD
NEW	app/admin/reviews/page.tsx	Review moderation
NEW	app/admin/analytics/page.tsx	Analytics dashboard
NEW	app/admin/game/page.tsx	Game management
NEW	app/api/admin/auth/route.ts	Admin auth API
NEW	app/api/admin/menu/route.ts	Menu CRUD API
NEW	app/api/admin/outlets/route.ts	Outlets CRUD API
NEW	app/api/admin/settings/route.ts	Settings API
NEW	app/api/admin/hero/route.ts	Hero slides API
NEW	app/api/admin/testimonials/route.ts	Testimonials API
NEW	app/api/admin/reviews/route.ts	Reviews admin API
NEW	app/api/admin/analytics/route.ts	Analytics API
NEW	app/api/reviews/route.ts	Public reviews API
NEW	app/api/analytics/track/route.ts	Analytics tracking API
NEW	components/AnalyticsTracker.tsx	Client-side analytics
NEW	components/ReviewSection.tsx	Public review/rating UI
NEW	lib/admin-auth.ts	Admin auth helpers
MODIFY	.env.local	Supabase credentials
MODIFY	app/layout.tsx	Add AnalyticsTracker
MODIFY	app/page.tsx	Add ReviewSection
MODIFY	components/HeroSection.tsx	Dynamic hero from DB
MODIFY	components/MenuSection.tsx	Dynamic menu from DB
MODIFY	components/Footer.tsx	Dynamic social links
MODIFY	components/TestimonialSlider.tsx	Dynamic testimonials
MODIFY	components/PromoPopup.tsx	Dynamic promo image
MODIFY	app/link/page.tsx	Dynamic social links
MODIFY	app/api/game/*/route.ts	Migrate to Supabase
DELETE	lib/apps-script.gs	Remove GAS backend
DELETE	lib/apps-script-setup.gs	Remove GAS setup
DELETE	lib/game-api.ts	Remove GAS API client
DELETE	data/menu.ts	Replaced by Supabase
DELETE	data/outlets.ts	Replaced by Supabase
Verification Plan
Automated Tests
Build check: npm run build — memastikan tidak ada error TypeScript atau import yang broken
Dev server: npm run dev — pastikan landing page load dengan data dari Supabase
Browser tests (via browser tool):
Landing page: hero slides, menu, testimonials, footer social links load dari DB
Review system: submit review, lihat review muncul realtime
Admin login: login dengan password, akses dashboard
Admin CRUD: tambah menu item, edit, hapus — verify perubahan muncul di landing page
Analytics: buka beberapa halaman, cek data muncul di admin analytics
Manual Verification
Pastikan admin bisa login dan semua CRUD berfungsi
Pastikan review baru dari user muncul realtime
Pastikan analytics tracking data akurat
Pastikan game feature masih berfungsi setelah migrasi
