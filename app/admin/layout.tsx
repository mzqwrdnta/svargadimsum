import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/admin/menu', label: 'Menu', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { href: '/admin/outlets', label: 'Outlets', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/admin/hero', label: 'Hero Slides', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { href: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { href: '/admin/game', label: 'Memory Game', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .admin-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
          overflow-y: auto;
        }
        .admin-brand {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FF6B35, #FF8F5E);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          color: white;
        }
        .admin-brand-text {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .admin-brand-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }
        .admin-nav {
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .admin-nav-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: rgba(255,255,255,0.3);
          padding: 16px 12px 8px;
        }
        .admin-nav-item {
          padding: 10px 12px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 8px;
          transition: all 0.15s ease;
          font-size: 14px;
          font-weight: 500;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.9);
        }
        .admin-nav-item.active {
          background: rgba(255,107,53,0.15);
          color: #FF6B35;
        }
        .admin-nav-item svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 260px;
          min-height: 100vh;
        }
        .admin-header {
          height: 64px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .admin-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B35, #FF8F5E);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: white;
        }
        .admin-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
        }
        .admin-user-role {
          font-size: 11px;
          color: #9ca3af;
        }
        .logout-btn {
          background: none;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          cursor: pointer;
          font-weight: 500;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .logout-btn:hover {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }
        .admin-content {
          padding: 32px;
          flex: 1;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .admin-sidebar { width: 60px; }
          .admin-sidebar .admin-brand-text,
          .admin-sidebar .admin-brand-sub,
          .admin-sidebar .admin-nav-label,
          .admin-sidebar .admin-nav-item span { display: none; }
          .admin-nav-item { justify-content: center; padding: 12px; }
          .admin-main { margin-left: 60px; }
          .admin-content { padding: 16px; }
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">S</div>
          <div>
            <div className="admin-brand-text">Svarga Admin</div>
            <div className="admin-brand-sub">Dashboard Panel</div>
          </div>
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-label">Main</div>
          {NAV_ITEMS.slice(0, 1).map(item => (
            <Link key={item.href} href={item.href} className="admin-nav-item">
              <svg viewBox="0 0 24 24"><path d={item.icon}/></svg>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="admin-nav-label">Content</div>
          {NAV_ITEMS.slice(1, 5).map(item => (
            <Link key={item.href} href={item.href} className="admin-nav-item">
              <svg viewBox="0 0 24 24"><path d={item.icon}/></svg>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="admin-nav-label">System</div>
          {NAV_ITEMS.slice(5).map(item => (
            <Link key={item.href} href={item.href} className="admin-nav-item">
              <svg viewBox="0 0 24 24"><path d={item.icon}/></svg>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left" />
          <div className="admin-header-right">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div className="admin-user-name">{user.email?.split('@')[0] || 'Admin'}</div>
                <div className="admin-user-role">Administrator</div>
              </div>
            </div>
            <form action="/api/admin/auth/logout" method="POST">
              <button type="submit" className="logout-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </form>
          </div>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
