Task: Migrasi ke Supabase + Admin Dashboard
Phase 1: Foundation
 Supabase client setup (lib/supabase.ts)
 SQL schema file
 Update .env.local
 Admin auth helpers
Phase 2: API Routes
 Public: reviews, analytics tracking
 Admin: auth, menu, outlets, settings, hero, testimonials, reviews, analytics
 Game: migrate to Supabase
Phase 3: Admin Dashboard
 Admin layout (sidebar, topbar)
 Admin login page
 Dashboard overview
 Menu CRUD page
 Outlets CRUD page
 Hero slides page
 Settings page (social links, contact, promo)
 Testimonials page
 Reviews moderation page
 Analytics page
 Game management page
Phase 4: Landing Page Dynamic Data
 HeroSection → Supabase
 MenuSection → Supabase
 Footer → Supabase
 TestimonialSlider → Supabase
 PromoPopup → Supabase
 Link page → Supabase
 AnalyticsTracker component
 ReviewSection component
Phase 5: Cleanup
 Delete old GAS files
 Delete hardcoded data files
Phase 6: Testing
 Build check
 Connection test
 Feature testing
