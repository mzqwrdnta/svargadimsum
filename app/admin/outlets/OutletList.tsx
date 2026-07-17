'use client';

import { useState } from 'react';
import ImageUpload from '../ImageUpload';

export default function OutletList({ initialItems, deleteOutlet, saveOutlet }: any) {
  const [items] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEdit = (item: any) => { setEditingItem(item); setShowModal(true); };
  const handleAddNew = () => { setEditingItem(null); setShowModal(true); };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this outlet?')) return;
    await deleteOutlet(id);
    window.location.reload();
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">{items.length} outlet(s)</div>
          <button onClick={handleAddNew} className="admin-btn admin-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Outlet
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Outlet</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Hours</th>
              <th>Status</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f1f5f9' }} />}
                    <div>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>/{item.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ maxWidth: '200px' }}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{item.address}</span></td>
                <td>{item.phone}</td>
                <td style={{ fontSize: '12px' }}>{item.hours}</td>
                <td><span className={`admin-badge ${item.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleEdit(item)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ marginRight: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{editingItem ? 'Edit Outlet' : 'Add New Outlet'}</div>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form action={async (fd) => { await saveOutlet(fd); setShowModal(false); window.location.reload(); }}>
              <input type="hidden" name="id" value={editingItem?.id || ''} />
              <div className="admin-modal-body">
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Name *</label>
                    <input type="text" name="name" defaultValue={editingItem?.name || ''} required className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Slug (URL) *</label>
                    <input type="text" name="slug" defaultValue={editingItem?.slug || ''} required className="admin-input" placeholder="depok" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Address *</label>
                  <textarea name="address" defaultValue={editingItem?.address || ''} required rows={2} className="admin-textarea" />
                </div>
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Hours *</label>
                    <input type="text" name="hours" defaultValue={editingItem?.hours || 'Setiap Hari: 10.00 - 21.00 WIB'} required className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Phone *</label>
                    <input type="text" name="phone" defaultValue={editingItem?.phone || ''} required className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <ImageUpload name="image" defaultValue={editingItem?.image || ''} folder="outlets" label="Outlet Image" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <textarea name="description" defaultValue={editingItem?.description || ''} rows={2} className="admin-textarea" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Google Maps Embed URL</label>
                  <textarea name="map_url" defaultValue={editingItem?.map_url || ''} rows={2} className="admin-textarea" placeholder="https://www.google.com/maps/embed?..." />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="is_active" className="admin-checkbox" defaultChecked={editingItem?.is_active ?? true} />
                    <span className="admin-label" style={{ margin: 0 }}>Active Outlet</span>
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-ghost">Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editingItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
