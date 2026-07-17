import { createClient } from '@/utils/supabase/server';
import { adminStyles } from '../styles';

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: pageViews } = await supabase
    .from('page_views')
    .select('id, created_at, page_path, device_type, browser, os')
    .order('created_at', { ascending: false })
    .limit(200);

  const totalViews = pageViews?.length || 0;

  const viewsByPage: Record<string, number> = {};
  pageViews?.forEach(v => { viewsByPage[v.page_path] = (viewsByPage[v.page_path] || 0) + 1; });
  const topPages = Object.entries(viewsByPage).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const deviceTypes: Record<string, number> = {};
  pageViews?.forEach(v => { deviceTypes[v.device_type || 'unknown'] = (deviceTypes[v.device_type || 'unknown'] || 0) + 1; });

  const browserTypes: Record<string, number> = {};
  pageViews?.forEach(v => { browserTypes[v.browser || 'unknown'] = (browserTypes[v.browser || 'unknown'] || 0) + 1; });

  const today = new Date().toISOString().split('T')[0];
  const todayViews = pageViews?.filter(v => v.created_at?.startsWith(today)).length || 0;

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Analytics</h1>
            <p className="admin-page-subtitle">Track visitor activity and page performance</p>
          </div>
        </div>

        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(255,107,53,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </div>
            <div>
              <div className="admin-stat-value">{totalViews}</div>
              <div className="admin-stat-label">Total Page Views</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="admin-stat-value">{todayViews}</div>
              <div className="admin-stat-label">Views Today</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <div>
              <div className="admin-stat-value">{topPages.length}</div>
              <div className="admin-stat-label">Unique Pages</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Top Pages</div>
            </div>
            <div style={{ padding: '0' }}>
              {topPages.length === 0 ? (
                <div className="admin-empty" style={{ padding: '24px' }}>No data yet</div>
              ) : topPages.map(([page, count], idx) => {
                const maxCount = topPages[0]?.[1] || 1;
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={idx} style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{page}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#FF6B35' }}>{count}</span>
                    </div>
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #FF6B35, #FF8F5E)', borderRadius: '2px', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Devices</div>
            </div>
            <div style={{ padding: '20px' }}>
              {Object.entries(deviceTypes).length === 0 ? (
                <div className="admin-empty">No data yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.entries(deviceTypes).sort((a, b) => b[1] - a[1]).map(([device, count]) => {
                    const total = Object.values(deviceTypes).reduce((a, b) => a + b, 0);
                    const pct = Math.round((count / total) * 100);
                    const colors: Record<string, string> = { mobile: '#FF6B35', desktop: '#3b82f6', tablet: '#10b981' };
                    return (
                      <div key={device}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ textTransform: 'capitalize', fontSize: '13px', fontWeight: '500', color: '#334155' }}>{device}</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: colors[device] || '#94a3b8', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Recent Visitor Log</div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Page</th>
                <th>Device</th>
                <th>Browser</th>
                <th>OS</th>
              </tr>
            </thead>
            <tbody>
              {pageViews?.slice(0, 15).map((view) => (
                <tr key={view.id}>
                  <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(view.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                  <td><span className="admin-badge admin-badge-info">{view.page_path}</span></td>
                  <td style={{ textTransform: 'capitalize' }}>{view.device_type}</td>
                  <td>{view.browser}</td>
                  <td>{view.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
