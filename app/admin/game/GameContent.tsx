'use client';

import { useState } from 'react';

export default function GameContent({
  allPlayers, winnersCount, unusedCount, usedCount,
  recentWinners, vouchers, settings,
  addVoucher, deleteVoucher, updateGameSetting, toggleGameActive,
  deleteWinner, deletePlayer
}: any) {
  const [tab, setTab] = useState<'overview' | 'settings' | 'vouchers' | 'players' | 'winners'>('overview');
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [gameActive, setGameActive] = useState(settings.game_active === 'true');
  const [saving, setSaving] = useState('');

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'settings' as const, label: 'Settings' },
    { id: 'vouchers' as const, label: 'Vouchers' },
    { id: 'players' as const, label: 'Players' },
    { id: 'winners' as const, label: 'Winners' },
  ];

  const today = new Date().toISOString().split('T')[0];
  const todayPlayers = allPlayers.filter((p: any) => p.play_date === today);
  const todayWinnersList = recentWinners.filter((w: any) => w.tanggal === today);

  const handleSave = async (key: string, value: string) => {
    setSaving(key);
    const fd = new FormData();
    fd.append('key', key);
    fd.append('value', value);
    await updateGameSetting(fd);
    setSaving('');
    window.location.reload();
  };

  const handleToggle = async () => {
    const newVal = !gameActive;
    setGameActive(newVal);
    const fd = new FormData();
    fd.append('value', newVal ? 'true' : 'false');
    await toggleGameActive(fd);
    window.location.reload();
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', background: '#f8fafc', borderRadius: '8px', padding: '4px' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px',
              background: tab === t.id ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: tab === t.id ? '#FF6B35' : '#64748b',
              fontWeight: tab === t.id ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div>
                <div className="admin-stat-value">{todayPlayers.length}</div>
                <div className="admin-stat-label">Players Today</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <div className="admin-stat-value">{todayWinnersList.length} / {settings.game_max_winners || '1'}</div>
                <div className="admin-stat-label">Winners Today</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: 'rgba(255,107,53,0.1)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
              </div>
              <div>
                <div className="admin-stat-value">{unusedCount}</div>
                <div className="admin-stat-label">Available Vouchers</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: gameActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={gameActive ? '#10b981' : '#ef4444'} strokeWidth="2">
                  {gameActive ? <path d="M5 13l4 4L19 7"/> : <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>}
                </svg>
              </div>
              <div>
                <div className="admin-stat-value" style={{ color: gameActive ? '#10b981' : '#ef4444' }}>{gameActive ? 'Active' : 'Disabled'}</div>
                <div className="admin-stat-label">Game Status</div>
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ marginBottom: '20px' }}>
            <div className="admin-card-header">
              <div className="admin-card-title">Quick Toggle</div>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: gameActive ? '#f0fdf4' : '#fef2f2', borderRadius: '10px', border: `1px solid ${gameActive ? '#bbf7d0' : '#fecaca'}` }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>Game Feature</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{gameActive ? 'Game is currently active' : 'Game is currently disabled'}</div>
                </div>
                <button onClick={handleToggle} className={`admin-toggle ${gameActive ? 'active' : ''}`} />
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'settings' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Game Settings</div>
          </div>
          <div className="admin-card-body">
            <div className="admin-section-title">Schedule</div>

            <div className="admin-grid-2" style={{ marginBottom: '20px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Start Time</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="time" defaultValue={settings.game_start_hour || '01:00'} className="admin-input" id="start-time" />
                  <button onClick={() => handleSave('game_start_hour', (document.getElementById('start-time') as HTMLInputElement).value)} className="admin-btn admin-btn-primary admin-btn-sm" disabled={saving === 'game_start_hour'}>
                    {saving === 'game_start_hour' ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">End Time</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="time" defaultValue={settings.game_end_hour || '05:00'} className="admin-input" id="end-time" />
                  <button onClick={() => handleSave('game_end_hour', (document.getElementById('end-time') as HTMLInputElement).value)} className="admin-btn admin-btn-primary admin-btn-sm" disabled={saving === 'game_end_hour'}>
                    {saving === 'game_end_hour' ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Game hanya aktif pada jam yang ditentukan. Di luar jam tersebut, user tidak bisa bermain.</p>

            <div className="admin-divider" />
            <div className="admin-section-title">Game Rules</div>

            <div className="admin-grid-2" style={{ marginBottom: '20px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Max Winners Per Day</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" min="1" max="100" defaultValue={settings.game_max_winners || '1'} className="admin-input" id="max-winners" />
                  <button onClick={() => handleSave('game_max_winners', (document.getElementById('max-winners') as HTMLInputElement).value)} className="admin-btn admin-btn-primary admin-btn-sm" disabled={saving === 'game_max_winners'}>
                    {saving === 'game_max_winners' ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Game otomatis tutup jika kuota pemenang tercapai</p>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Difficulty Level</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select defaultValue={settings.game_difficulty || 'medium'} className="admin-select" id="difficulty" style={{ flex: 1 }}>
                    <option value="easy">Mudah (4 pairs, 60s)</option>
                    <option value="medium">Sedang (6 pairs, 45s)</option>
                    <option value="hard">Sulit (8 pairs, 30s)</option>
                  </select>
                  <button onClick={() => handleSave('game_difficulty', (document.getElementById('difficulty') as HTMLSelectElement).value)} className="admin-btn admin-btn-primary admin-btn-sm" disabled={saving === 'game_difficulty'}>
                    {saving === 'game_difficulty' ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-grid-3" style={{ marginBottom: '20px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Timer (seconds)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" min="10" max="120" defaultValue={settings.game_timer || '45'} className="admin-input" id="timer-val" />
                  <button onClick={() => handleSave('game_timer', (document.getElementById('timer-val') as HTMLInputElement).value)} className="admin-btn admin-btn-primary admin-btn-sm" disabled={saving === 'game_timer'}>
                    {saving === 'game_timer' ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Lives (nyawa)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" min="1" max="10" defaultValue={settings.game_lives || '3'} className="admin-input" id="lives-val" />
                  <button onClick={() => handleSave('game_lives', (document.getElementById('lives-val') as HTMLInputElement).value)} className="admin-btn admin-btn-primary admin-btn-sm" disabled={saving === 'game_lives'}>
                    {saving === 'game_lives' ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Card Pairs</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" min="2" max="8" defaultValue={settings.game_pairs || '6'} className="admin-input" id="pairs-val" />
                  <button onClick={() => handleSave('game_pairs', (document.getElementById('pairs-val') as HTMLInputElement).value)} className="admin-btn admin-btn-primary admin-btn-sm" disabled={saving === 'game_pairs'}>
                    {saving === 'game_pairs' ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-divider" />
            <div className="admin-section-title">Current Configuration</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {[
                { label: 'Active', value: gameActive ? 'Yes' : 'No', color: gameActive ? '#10b981' : '#ef4444' },
                { label: 'Schedule', value: `${settings.game_start_hour || '01:00'}-${settings.game_end_hour || '05:00'}`, color: '#3b82f6' },
                { label: 'Max Winners', value: settings.game_max_winners || '1', color: '#FF6B35' },
                { label: 'Difficulty', value: settings.game_difficulty || 'medium', color: '#f59e0b' },
                { label: 'Timer', value: `${settings.game_timer || '45'}s`, color: '#8b5cf6' },
                { label: 'Lives', value: settings.game_lives || '3', color: '#ec4899' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: item.color, textTransform: 'capitalize' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'vouchers' && (
        <>
          <div className="admin-card" style={{ marginBottom: '20px' }}>
            <div className="admin-card-header">
              <div className="admin-card-title">Add Vouchers</div>
              <button onClick={() => setShowAddVoucher(!showAddVoucher)} className="admin-btn admin-btn-primary admin-btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Vouchers
              </button>
            </div>
            {showAddVoucher && (
              <div className="admin-card-body" style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                <form action={async (fd) => { await addVoucher(fd); setShowAddVoucher(false); window.location.reload(); }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Voucher Codes (one per line)</label>
                    <textarea name="codes" rows={5} className="admin-textarea" placeholder={"DIMSUM01\nDIMSUM02\nDIMSUM03"} style={{ fontFamily: 'monospace', fontSize: '13px' }} required />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="admin-btn admin-btn-success admin-btn-sm">Save</button>
                    <button type="button" onClick={() => setShowAddVoucher(false)} className="admin-btn admin-btn-ghost admin-btn-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="admin-badge admin-badge-success">{unusedCount} unused</span>
                <span className="admin-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>{usedCount} used</span>
              </div>
            </div>
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Status</th><th>Claimed By</th><th>Time</th><th style={{ width: '60px', textAlign: 'right' }}></th></tr></thead>
              <tbody>
                {vouchers.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No vouchers yet</td></tr>
                ) : vouchers.slice(0, 50).map((v: any) => (
                  <tr key={v.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{v.code}</td>
                    <td><span className={`admin-badge ${v.status === 'unused' ? 'admin-badge-success' : 'admin-badge-warning'}`}>{v.status}</span></td>
                    <td style={{ color: '#64748b' }}>{v.claimed_by || '-'}</td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>{v.claimed_at ? new Date(v.claimed_at).toLocaleString('id-ID') : '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {v.status === 'unused' && (
                        <button onClick={() => { if (confirm('Delete?')) { deleteVoucher(v.id); window.location.reload(); } }} className="admin-btn admin-btn-danger admin-btn-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'players' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">All Players ({allPlayers.length})</div>
          </div>
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Name</th><th>WhatsApp</th><th>IP</th><th>Device</th><th>Browser</th><th>OS</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {allPlayers.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No players yet</td></tr>
              ) : allPlayers.map((p: any) => (
                <tr key={p.id}>
                  <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                  <td style={{ fontWeight: '600' }}>{p.nama}</td>
                  <td>{p.whatsapp}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{p.ip || '-'}</td>
                  <td><span className="admin-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>{p.device_type || '-'}</span></td>
                  <td style={{ fontSize: '12px' }}>{p.browser || '-'}</td>
                  <td style={{ fontSize: '12px' }}>{p.os || '-'}</td>
                  <td>
                    <span className={`admin-badge ${p.status === 'won' ? 'admin-badge-success' : p.status === 'playing' ? 'admin-badge-info' : 'admin-badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => { if (confirm('Delete player record?')) { deletePlayer(p.id); window.location.reload(); } }} className="admin-btn admin-btn-danger admin-btn-sm">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'winners' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">All Winners ({winnersCount})</div>
          </div>
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Name</th><th>WhatsApp</th><th>Voucher</th><th>Duration</th><th>IP</th><th>Device</th><th></th></tr></thead>
            <tbody>
              {recentWinners.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No winners yet</td></tr>
              ) : recentWinners.map((w: any) => (
                <tr key={w.id}>
                  <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{new Date(w.waktu_menang).toLocaleDateString('id-ID')}</td>
                  <td style={{ fontWeight: '600' }}>{w.nama}</td>
                  <td>{w.whatsapp}</td>
                  <td><span className="admin-badge admin-badge-success" style={{ fontFamily: 'monospace' }}>{w.voucher_code}</span></td>
                  <td style={{ fontSize: '12px' }}>{w.play_duration ? `${Math.round(w.play_duration)}s` : '-'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{w.ip || '-'}</td>
                  <td style={{ fontSize: '12px' }}>{w.device_type || '-'}</td>
                  <td>
                    <button onClick={() => { if (confirm('Delete this winner record?')) { deleteWinner(w.id); window.location.reload(); } }} className="admin-btn admin-btn-danger admin-btn-sm">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
