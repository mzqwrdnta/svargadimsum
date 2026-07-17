'use client';

import { useState } from 'react';
import ImageUpload from '../ImageUpload';

export default function HeroList({ initialItems, deleteSlide, saveSlide }: any) {
  const [items] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEdit = (item: any) => { setEditingItem(item); setShowModal(true); };
  const handleAddNew = () => { setEditingItem(null); setShowModal(true); };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    await deleteSlide(id);
    window.location.reload();
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">{items.length} slide(s)</div>
          <button onClick={handleAddNew} className="admin-btn admin-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Slide
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>Image</th>
              <th>Product Name</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id}>
                <td><img src={item.image} alt={item.product_name} style={{ width: '52px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #f1f5f9' }} /></td>
                <td style={{ fontWeight: '600', color: '#0f172a' }}>{item.product_name}</td>
                <td><span className="admin-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>{item.sort_order}</span></td>
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
              <div className="admin-modal-title">{editingItem ? 'Edit Slide' : 'Add New Slide'}</div>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form action={async (fd) => { await saveSlide(fd); setShowModal(false); window.location.reload(); }}>
              <input type="hidden" name="id" value={editingItem?.id || ''} />
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input type="text" name="product_name" defaultValue={editingItem?.product_name || ''} required className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <ImageUpload name="image" defaultValue={editingItem?.image || ''} folder="hero" label="Hero Image" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingItem?.sort_order || 0} className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="is_active" className="admin-checkbox" defaultChecked={editingItem?.is_active ?? true} />
                    <span className="admin-label" style={{ margin: 0 }}>Active Slide</span>
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
