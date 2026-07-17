'use client';

import { useState } from 'react';
import ImageUpload from '../ImageUpload';

export default function MenuList({ initialItems, deleteMenu, saveMenu }: any) {
  const [items] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [...new Set(items.map((i: any) => i.category))] as string[];
  const filtered = items.filter((item: any) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleEdit = (item: any) => { setEditingItem(item); setShowModal(true); };
  const handleAddNew = () => { setEditingItem(null); setShowModal(true); };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    await deleteMenu(id);
    window.location.reload();
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="text" placeholder="Search menu..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="admin-input" style={{ width: '240px' }} />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="admin-select" style={{ width: '160px' }}>
              <option value="all">All Categories</option>
              {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <button onClick={handleAddNew} className="admin-btn admin-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Menu
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty"><p>No menu items found</p></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id}>
                  <td><img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f1f5f9' }} /></td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>}
                  </td>
                  <td><span className="admin-badge admin-badge-info">{item.category}</span></td>
                  <td style={{ fontWeight: '600' }}>Rp {item.price?.toLocaleString('id-ID')}</td>
                  <td>{item.is_best_seller ? <span className="admin-badge admin-badge-warning">Best Seller</span> : <span className="admin-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Regular</span>}</td>
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
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</div>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form action={async (fd) => { await saveMenu(fd); setShowModal(false); window.location.reload(); }}>
              <input type="hidden" name="id" value={editingItem?.id || ''} />
              <div className="admin-modal-body">
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Name *</label>
                    <input type="text" name="name" defaultValue={editingItem?.name || ''} required className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Category *</label>
                    <select name="category" defaultValue={editingItem?.category || 'Mix'} className="admin-select">
                      <option value="Mentai">Mentai</option>
                      <option value="Tartar">Tartar</option>
                      <option value="Cheese Mayo">Cheese Mayo</option>
                      <option value="Mix">Mix</option>
                    </select>
                  </div>
                </div>
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Price (Rp) *</label>
                    <input type="number" name="price" defaultValue={editingItem?.price || ''} required className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Order Name (WhatsApp)</label>
                    <input type="text" name="order_name" defaultValue={editingItem?.order_name || editingItem?.name || ''} className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <ImageUpload name="image" defaultValue={editingItem?.image || ''} folder="menu" label="Menu Image" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <textarea name="description" defaultValue={editingItem?.description || ''} rows={3} className="admin-textarea" />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="is_best_seller" className="admin-checkbox" defaultChecked={editingItem?.is_best_seller || false} />
                    <span className="admin-label" style={{ margin: 0 }}>Mark as Best Seller</span>
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
