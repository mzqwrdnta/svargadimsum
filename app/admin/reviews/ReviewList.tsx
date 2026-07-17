'use client';

import { useState } from 'react';

export default function ReviewList({ initialItems, deleteReview, toggleVisibility }: any) {
  const [items] = useState(initialItems);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  const filtered = items.filter((item: any) => {
    if (filter === 'visible') return item.is_visible;
    if (filter === 'hidden') return !item.is_visible;
    return true;
  });

  const visibleCount = items.filter((i: any) => i.is_visible).length;
  const hiddenCount = items.filter((i: any) => !i.is_visible).length;

  const avgRating = items.length > 0
    ? (items.reduce((sum: number, i: any) => sum + i.rating, 0) / items.length).toFixed(1)
    : '0.0';

  return (
    <>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(255,107,53,0.1)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <div>
            <div className="admin-stat-value">{items.length}</div>
            <div className="admin-stat-label">Total Reviews</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <div className="admin-stat-value">{visibleCount}</div>
            <div className="admin-stat-label">Visible</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </div>
          <div>
            <div className="admin-stat-value">{hiddenCount}</div>
            <div className="admin-stat-label">Hidden</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </div>
          <div>
            <div className="admin-stat-value">{avgRating}</div>
            <div className="admin-stat-label">Avg Rating</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'visible', 'hidden'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`admin-btn admin-btn-sm ${filter === f ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="admin-card-title">{filtered.length} review(s)</div>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div style={{ fontSize: '40px', marginBottom: '8px', opacity: 0.2 }}>&#128172;</div>
            <p>No reviews found</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Visitor</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th style={{ width: '180px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id}>
                  <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #FF8F5E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px', color: 'white', flexShrink: 0 }}>
                        {item.visitor_name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>{item.visitor_name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#f59e0b', fontSize: '14px' }}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</td>
                  <td style={{ maxWidth: '280px' }}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', color: '#475569' }}>{item.comment || '-'}</span></td>
                  <td>
                    <span className={`admin-badge ${item.is_visible ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {item.is_visible ? 'Public' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => toggleVisibility(item.id, item.is_visible)} className={`admin-btn admin-btn-sm ${item.is_visible ? 'admin-btn-ghost' : 'admin-btn-ghost'}`} style={{ marginRight: '6px' }}>
                      {item.is_visible ? (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg> Hide</>
                      ) : (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> Show</>
                      )}
                    </button>
                    <button onClick={() => { if (confirm('Delete this review permanently?')) { deleteReview(item.id); window.location.reload(); } }} className="admin-btn admin-btn-danger admin-btn-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
