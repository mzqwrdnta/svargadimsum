import { createClient } from '@/utils/supabase/server';
import { adminStyles } from './styles';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: menuCount },
    { count: outletCount },
    { count: reviewCount },
    { count: heroCount },
    { data: recentReviews },
    { data: recentViews },
  ] = await Promise.all([
    supabase.from('menu_items').select('*', { count: 'exact', head: true }),
    supabase.from('outlets').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('hero_slides').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('id, visitor_name, rating, comment, is_visible, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('page_views').select('id, visitor_id, page_path, device_type, created_at').order('created_at', { ascending: false }).limit(20),
  ]);

  const uniqueVisitors = new Set(recentViews?.map(v => v.visitor_id || v.id)).size || 0;

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-subtitle">Overview of your website</p>
          </div>
        </div>

        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(255,107,53,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <div>
              <div className="admin-stat-value">{menuCount || 0}</div>
              <div className="admin-stat-label">Menu Items</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <div className="admin-stat-value">{outletCount || 0}</div>
              <div className="admin-stat-label">Outlets</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <div>
              <div className="admin-stat-value">{reviewCount || 0}</div>
              <div className="admin-stat-label">Total Reviews</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(168,85,247,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </div>
            <div>
              <div className="admin-stat-value">{uniqueVisitors}</div>
              <div className="admin-stat-label">Recent Visitors</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Recent Reviews</div>
            </div>
            <div style={{ padding: '0' }}>
              {(!recentReviews || recentReviews.length === 0) ? (
                <div className="admin-empty" style={{ padding: '32px' }}>
                  <div>No reviews yet</div>
                </div>
              ) : (
                recentReviews.map((review: any) => (
                  <div key={review.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', color: '#64748b', flexShrink: 0 }}>
                      {review.visitor_name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a' }}>{review.visitor_name}</span>
                        <span style={{ color: '#f59e0b', fontSize: '12px' }}>{'★'.repeat(review.rating)}</span>
                        <span className={`admin-badge ${review.is_visible ? 'admin-badge-success' : 'admin-badge-warning'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {review.is_visible ? 'Public' : 'Hidden'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.comment}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Recent Page Views</div>
            </div>
            <div style={{ padding: '0' }}>
              {(!recentViews || recentViews.length === 0) ? (
                <div className="admin-empty" style={{ padding: '32px' }}>
                  <div>No page views yet</div>
                </div>
              ) : (
                recentViews.slice(0, 8).map((view: any) => (
                  <div key={view.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#64748b', textTransform: 'capitalize' }}>{view.device_type || 'unknown'}</span>
                      <span style={{ fontSize: '13px', color: '#334155', fontWeight: '500' }}>{view.page_path}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(view.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
