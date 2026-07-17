'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LinksPageClient({ socialLinks, menuItems }: { socialLinks: any[], menuItems: any[] }) {
  const [activeTab, setActiveTab] = useState<'links' | 'menu'>('links');
  const [menuFilter, setMenuFilter] = useState('Semua');

  const menuCategories = ['Semua', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredMenu = menuFilter === 'Semua' 
    ? menuItems 
    : menuItems.filter(item => item.category === menuFilter);

  return (
    <div className="links-container">
      <style>{`
        /* Hide global layout elements */
        .original-style-header, 
        .modern-footer, 
        .cart-modern-toggle, 
        .wa-modern-toggle,
        .promo-overlay {
          display: none !important;
        }

        .links-container {
          min-height: 100vh;
          background: #FFFDF9;
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Inter', sans-serif;
        }
        .profile-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        .profile-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.2rem;
          padding: 12px;
          border: 2px solid #FF6B35;
        }
        .profile-img img {
          width: 100%;
          height: auto;
        }
        .profile-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: #2B1717;
          margin-bottom: 0.5rem;
        }
        .profile-bio {
          color: #666;
          font-size: 0.95rem;
          max-width: 320px;
          line-height: 1.5;
        }

        /* Tab System */
        .tab-container {
          display: flex;
          background: #eee;
          padding: 4px;
          border-radius: 50px;
          margin-bottom: 2.5rem;
          width: 100%;
          max-width: 300px;
        }
        .tab-btn {
          flex: 1;
          padding: 10px 20px;
          border: none;
          background: transparent;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
          color: #666;
          cursor: pointer;
          transition: all 0.3s;
        }
        .tab-btn.active {
          background: white;
          color: #FF6B35;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        /* Filter System */
        .filter-bar {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          width: 100%;
          max-width: 450px;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-chip {
          white-space: nowrap;
          padding: 8px 16px;
          background: #f0f0f0;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #666;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid transparent;
        }
        .filter-chip.active {
          background: #FFF5F0;
          color: #FF6B35;
          border-color: #FF6B35;
        }
        
        .social-buttons {
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          animation: slideUp 0.4s ease;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 1.1rem;
          background: white;
          border-radius: 18px;
          text-decoration: none;
          color: #2B1717;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(0,0,0,0.01);
        }
        .social-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.12);
          border-color: #FF6B35;
          color: #FF6B35;
        }
        
        .menu-list {
          width: 100%;
          max-width: 450px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          animation: slideUp 0.4s ease;
        }
        .menu-link-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }
        .menu-link-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.06);
        }
        .menu-link-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }
        .menu-link-info {
          padding: 0.8rem;
          text-align: center;
        }
        .menu-link-name {
          font-weight: 700;
          font-size: 0.85rem;
          color: #2B1717;
          margin-bottom: 4px;
          display: block;
        }
        .menu-link-price {
          color: #FF6B35;
          font-weight: 800;
          font-size: 0.95rem;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .links-footer {
          margin-top: auto;
          padding-top: 3rem;
          color: #bbb;
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>

      <div className="profile-section">
        <div className="profile-img">
          <img src="/logo-loading.svg" alt="Svarga Logo" />
        </div>
        <h1 className="profile-name">Svarga Dimsum</h1>
        <p className="profile-bio">Dimsum Premium dengan cita rasa autentik. Dibuat dengan bahan pilihan terbaik.</p>
      </div>

      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          Links
        </button>
        <button 
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
      </div>

      {activeTab === 'links' ? (
        <div className="social-buttons">
          {socialLinks.map((link) => (
            <a key={link.name} href={link.url} className="social-btn">
              <i className={`fas ${link.icon}`} style={{ color: link.color }}></i>
              {link.name}
            </a>
          ))}
        </div>
      ) : (
        <>
          <div className="filter-bar">
            {menuCategories.map(cat => (
              <div 
                key={cat} 
                className={`filter-chip ${menuFilter === cat ? 'active' : ''}`}
                onClick={() => setMenuFilter(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
          <div className="menu-list">
            {filteredMenu.map((item) => (
              <Link key={item.name} href="/menu" className="menu-link-card">
                <img src={item.image} alt={item.name} className="menu-link-img" />
                <div className="menu-link-info">
                  <span className="menu-link-name">{item.name}</span>
                  <span className="menu-link-price">Rp {item.price.toLocaleString('id-ID')}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="links-footer">
        <p>&copy; 2025 Svarga Dimsum</p>
      </div>
    </div>
  );
}
