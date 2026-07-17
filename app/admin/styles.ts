export const adminStyles = `
  .admin-page { max-width: 1200px; }
  .admin-page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }
  .admin-page-title {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.3px;
  }
  .admin-page-subtitle {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }
  .admin-card {
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }
  .admin-card-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .admin-card-title {
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
  }
  .admin-card-body { padding: 24px; }
  .admin-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    text-decoration: none;
  }
  .admin-btn-primary {
    background: linear-gradient(135deg, #FF6B35, #FF8F5E);
    color: white;
    box-shadow: 0 2px 8px rgba(255,107,53,0.3);
  }
  .admin-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,107,53,0.4); }
  .admin-btn-success { background: #10b981; color: white; }
  .admin-btn-success:hover { background: #059669; }
  .admin-btn-danger { background: #fee2e2; color: #dc2626; }
  .admin-btn-danger:hover { background: #fecaca; }
  .admin-btn-ghost { background: transparent; color: #64748b; border: 1px solid #e5e7eb; }
  .admin-btn-ghost:hover { background: #f8fafc; border-color: #cbd5e1; }
  .admin-btn-sm { padding: 6px 12px; font-size: 12px; }
  .admin-table {
    width: 100%;
    border-collapse: collapse;
  }
  .admin-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }
  .admin-table td {
    padding: 14px 16px;
    font-size: 13px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
  .admin-table tr:hover td { background: #fafbfc; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 13px;
    color: #1f2937;
    background: white;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
  }
  .admin-input:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }
  .admin-input::placeholder { color: #9ca3af; }
  .admin-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
  }
  .admin-form-group { margin-bottom: 16px; }
  .admin-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  .admin-badge-success { background: #dcfce7; color: #166534; }
  .admin-badge-warning { background: #fef3c7; color: #92400e; }
  .admin-badge-danger { background: #fee2e2; color: #dc2626; }
  .admin-badge-info { background: #dbeafe; color: #1e40af; }
  .admin-empty {
    padding: 48px;
    text-align: center;
    color: #94a3b8;
  }
  .admin-empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.3;
  }
  .admin-stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }
  .admin-stat-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .admin-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .admin-stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1;
  }
  .admin-stat-label {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
  }
  .admin-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
  }
  .admin-modal {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .admin-modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .admin-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
  }
  .admin-modal-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #94a3b8;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .admin-modal-close:hover { background: #f1f5f9; color: #475569; }
  .admin-modal-body { padding: 24px; }
  .admin-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .admin-toggle {
    position: relative;
    width: 44px;
    height: 24px;
    background: #d1d5db;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .admin-toggle.active { background: #10b981; }
  .admin-toggle::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  .admin-toggle.active::after { transform: translateX(20px); }
  .admin-select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 13px;
    color: #1f2937;
    background: white;
    outline: none;
    cursor: pointer;
  }
  .admin-select:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }
  .admin-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #FF6B35;
    cursor: pointer;
  }
  .admin-textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 13px;
    color: #1f2937;
    background: white;
    resize: vertical;
    outline: none;
    font-family: inherit;
  }
  .admin-textarea:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }
  .admin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .admin-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .admin-divider { height: 1px; background: #f1f5f9; margin: 20px 0; }
  .admin-section-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f5f9;
  }
  @media (max-width: 768px) {
    .admin-grid-2, .admin-grid-3 { grid-template-columns: 1fr; }
    .admin-stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;
