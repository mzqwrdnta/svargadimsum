'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { outlets } from '@/data/outlets';
import { menuItems } from '@/data/menu';

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function MenuSection({ isDashboard = false }: { isDashboard?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isCartOrder, setIsCartOrder] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Ambil Sendiri');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [selectedOutlet, setSelectedOutlet] = useState('depok');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const cartRef = useRef<CartItem[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.menu-reveal').forEach(el => {
      observer.observe(el);
    });

    const savedCart = localStorage.getItem('dimsumCart');
    if (savedCart) cartRef.current = JSON.parse(savedCart);

    const handleCartUpdate = (e: CustomEvent<CartItem[]>) => {
      cartRef.current = e.detail;
    };

    const handleCheckout = () => {
      openCartOrderModal();
    };

    window.addEventListener('cartUpdated' as any, handleCartUpdate);
    window.addEventListener('checkoutFromCart' as any, handleCheckout);

    return () => {
      window.removeEventListener('cartUpdated' as any, handleCartUpdate);
      window.removeEventListener('checkoutFromCart' as any, handleCheckout);
    };
  }, []);

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:100px;right:20px;background:#2B1717;color:white;padding:16px 24px;border-radius:12px;z-index:20000;transition:opacity 0.3s;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,0.2);';
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '1'; }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const addToCart = (name: string, price: number, image: string) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('dimsumCart') || '[]');
    const existingIdx = cart.findIndex(item => item.name === name);
    if (existingIdx !== -1) {
      cart[existingIdx].quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem('dimsumCart', JSON.stringify(cart));
    cartRef.current = cart;
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    showNotification(`Added to cart: ${name}`);
  };

  const openOrderModal = (menuName: string, price: number) => {
    setCurrentMenu(menuName);
    setCurrentPrice(price);
    setIsCartOrder(false);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNotes('');
    setDeliveryMethod('Ambil Sendiri');
    setPaymentMethod('qris');
    setSelectedOutlet('depok');
    setBookingDate('');
    setBookingTime('');
    setShowModal(true);
  };

  const openCartOrderModal = () => {
    const cart = cartRef.current;
    if (cart.length === 0) { alert('Keranjang Anda kosong'); return; }
    setCurrentMenu('');
    setCurrentPrice(0);
    setIsCartOrder(true);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNotes('');
    setDeliveryMethod('Ambil Sendiri');
    setPaymentMethod('qris');
    setSelectedOutlet('depok');
    setBookingDate('');
    setBookingTime('');
    setShowModal(true);
  };

  const getSummaryMenu = () => {
    if (isCartOrder) {
      return cartRef.current.map(item => `${item.name} (${item.quantity}x)`).join(', ');
    }
    return currentMenu;
  };


  const getSummaryTotal = () => {
    if (isCartOrder) {
      const total = cartRef.current.reduce((t, item) => t + (item.price * item.quantity), 0);
      return `Rp ${total.toLocaleString('id-ID')}`;
    }
    return `Rp ${currentPrice.toLocaleString('id-ID')}`;
  };


  const handleDeliveryChange = (method: string) => {
    setDeliveryMethod(method);
  };

  const submitOrder = () => {
    if (!customerName || !customerPhone) {
      alert('Harap isi nama dan nomor WhatsApp Anda');
      return;
    }
    if (!bookingDate || !bookingTime) {
      alert('Harap pilih tanggal dan jam');
      return;
    }

    const outlet = outlets.find(o => o.slug === selectedOutlet) || outlets[0];
    const cleanPhone = outlet.phone.replace(/[^0-9]/g, '');
    
    let message: string;
    const commonInfo = `\n📅 *Waktu Booking*: ${bookingDate} @ ${bookingTime}\n🏢 *Outlet*: ${outlet.name}\n📍 *Alamat Toko*: ${outlet.address}\n📦 *Metode*: ${deliveryMethod}${deliveryMethod !== 'Ambil Sendiri' ? '\n⚠️ (Ongkir ditanggung & dipesan oleh pembeli)' : ''}\n📝 *Notes*: ${orderNotes || '-'}\n💳 *Bayar*: QRIS (Wajib Kirim Bukti Transfer)\n\n*Pemesan*:\n👤 ${customerName}\n📱 ${customerPhone}`;

    if (isCartOrder) {
      const cart = cartRef.current;
      const totalPrice = cart.reduce((t, item) => t + (item.price * item.quantity), 0);
      let menuList = '';
      cart.forEach(item => { menuList += `- ${item.name} (${item.quantity}x)\n`; });

      message = `Halo Svarga, saya mau order:\n\n📋 *Pesanan*:\n${menuList}${commonInfo}\n💰 *Total*: Rp ${totalPrice.toLocaleString('id-ID')}`;

      localStorage.setItem('dimsumCart', '[]');
      cartRef.current = [];
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
    } else {
      const totalPrice = currentPrice;
      message = `Halo Svarga, saya mau order:\n\n🍽 *Menu*: ${currentMenu}\n🔢 *Jumlah*: 1 Porsi${commonInfo}\n💰 *Total*: Rp ${totalPrice.toLocaleString('id-ID')}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
    setShowModal(false);
  };

  const filteredItems = menuItems.filter(item => {
    if (isDashboard) return item.isBestSeller;
    if (activeCategory === 'Semua') return true;
    return item.category === activeCategory;
  });

  const categories = ['Semua', 'Kukus', 'Goreng'];

  return (
    <section className="menu-modern-section" id="menu" style={{ paddingTop: isDashboard ? '4rem' : '8rem' }}>
      <style>{`
        .menu-modern-section {
          padding-bottom: 6rem;
          background: #fafafa;
        }
        .menu-header-modern {
          text-align: center;
          margin-bottom: 3rem;
        }
        .menu-header-modern h2 {
          font-size: 3rem;
          color: #2B1717;
          margin-bottom: 1rem;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .menu-header-modern p {
          color: #666;
          font-size: 1.15rem;
        }
        .cat-pill {
          padding: 10px 24px;
          border-radius: 30px;
          border: 1px solid #e0e0e0;
          background: white;
          color: #555;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }
        .cat-pill.active {
          background: #2B1717;
          color: white;
          border-color: #2B1717;
        }
        .menu-grid-modern {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 5%;
        }
        .menu-card-modern {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.4s, box-shadow 0.4s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .menu-card-modern:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .menu-img-wrapper {
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: #f4f4f4;
        }
        .menu-img-modern {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .menu-card-modern:hover .menu-img-modern {
          transform: scale(1.08);
        }
        .bestseller-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #FF6B35;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          z-index: 2;
          box-shadow: 0 4px 10px rgba(255, 107, 53, 0.3);
        }
        .menu-content-modern {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .menu-title-modern {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2B1717;
          margin-bottom: 0.5rem;
        }
        .menu-desc-modern {
          color: #777;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        .menu-bottom-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .menu-price-modern {
          font-size: 1.25rem;
          font-weight: 800;
          color: #FF6B35;
        }
        .menu-rating-modern {
          font-size: 0.85rem;
          color: #f39c12;
        }
        .menu-actions-modern {
          display: flex;
          gap: 10px;
        }
        .btn-modern {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .btn-buy-modern {
          background: #2B1717;
          color: white;
        }
        .btn-buy-modern:hover {
          background: #1a0e0e;
        }
        .btn-cart-modern {
          background: #FFF5F0;
          color: #FF6B35;
        }
        .btn-cart-modern:hover {
          background: #FFE1D1;
        }
        
        .menu-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .menu-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Modal Sleek */
        .modal-sleek {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .modal-sleek.active {
          opacity: 1;
          pointer-events: auto;
        }
        .modal-sleek-content {
          background: white;
          width: 90%;
          max-width: 500px;
          border-radius: 24px;
          overflow: hidden;
          transform: translateY(20px);
          transition: transform 0.3s;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .modal-sleek.active .modal-sleek-content {
          transform: translateY(0);
        }
        .modal-sleek-header {
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-sleek-header h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #2B1717;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #888;
        }
        .modal-sleek-body {
          padding: 1.5rem;
          overflow-y: auto;
        }
        .sleek-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 12px;
          font-size: 1rem;
          margin-top: 5px;
          background: #fcfcfc;
          transition: border 0.3s;
        }
        .sleek-input:focus {
          border-color: #FF6B35;
          outline: none;
        }
        .sleek-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #444;
        }
        .sleek-group {
          margin-bottom: 1.2rem;
        }
        .btn-submit-sleek {
          width: 100%;
          padding: 15px;
          background: #FF6B35;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 1rem;
          transition: background 0.3s;
        }
        .btn-submit-sleek:hover {
          background: #e85a25;
        }
        .sleek-summary {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="menu-header-modern">
        <h2>{isDashboard ? 'Best Sellers' : 'Eksplor Menu Kami'}</h2>
        <p>Pilihan premium dengan rasa otentik</p>
      </div>
      
      {!isDashboard && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="menu-grid-modern">
        {filteredItems.map((item, idx) => (
          <div className="menu-card-modern menu-reveal" key={idx} style={{ transitionDelay: `${(idx % 4) * 0.1}s` }}>
            {item.isBestSeller && <div className="bestseller-badge">🔥 Best Seller</div>}
            <div className="menu-img-wrapper">
              <img src={item.image} alt={item.name} className="menu-img-modern" />
            </div>
            <div className="menu-content-modern">
              <h3 className="menu-title-modern">{item.name}</h3>
              <div className="menu-rating-modern" style={{ marginBottom: '0.8rem' }}>
                <i className="fas fa-star"></i> {item.stars.filter(s=>s).length + (item.halfStar?0.5:0)} ({item.reviews})
              </div>
              <p className="menu-desc-modern">{item.desc}</p>
              
              <div className="menu-bottom-modern">
                <span className="menu-price-modern">Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="menu-actions-modern">
                <button className="btn-modern btn-buy-modern" onClick={() => openOrderModal(item.orderName || item.name, item.price)}>
                  Beli
                </button>
                <button className="btn-modern btn-cart-modern" onClick={() => addToCart(item.orderName || item.name, item.price, item.image)}>
                  <i className="fas fa-plus"></i> Cart
                </button>
              </div>
            </div>
          </div>
        ))}

        {!isDashboard && [1].map(i => (
          <div className="menu-card-modern" key={`soon-${i}`} style={{ opacity: 0.7 }}>
            <div className="menu-img-wrapper" style={{ background: '#eee' }}>
              <img src="/img/bot.jpg" alt="Coming Soon" className="menu-img-modern" style={{ filter: 'grayscale(100%)' }} />
            </div>
            <div className="menu-content-modern">
              <h3 className="menu-title-modern">Menu Spesial Baru</h3>
              <p className="menu-desc-modern">Sedang kami persiapkan! Tunggu kelezatan menu baru dari Svarga.</p>
              <div className="menu-actions-modern" style={{ marginTop: 'auto' }}>
                <button className="btn-modern btn-buy-modern" style={{ background: '#ccc', cursor: 'not-allowed' }} disabled>
                  Segera Hadir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isDashboard && (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/menu" style={{
            display: 'inline-block',
            padding: '14px 35px',
            background: 'white',
            color: '#2B1717',
            border: '2px solid #2B1717',
            textDecoration: 'none',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#2B1717'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#2B1717'; }}
          >
            Lihat Semua Menu
          </Link>
        </div>
      )}

      {/* Modal Sleek */}
      <div className={`modal-sleek ${showModal ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
        <div className="modal-sleek-content">
          <div className="modal-sleek-header">
            <h3>{isCartOrder ? 'Checkout Keranjang' : `Pesan ${currentMenu}`}</h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
          </div>
          <div className="modal-sleek-body">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="sleek-group">
                <label className="sleek-label">Nama Lengkap</label>
                <input type="text" className="sleek-input" placeholder="Masukkan nama Anda" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
              </div>
              <div className="sleek-group">
                <label className="sleek-label">WhatsApp</label>
                <input type="tel" className="sleek-input" placeholder="08..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))} required />
              </div>
              <div className="sleek-group" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="sleek-label">Pilih Outlet</label>
                  <select className="sleek-input" value={selectedOutlet} onChange={e => setSelectedOutlet(e.target.value)}>
                    {outlets.map(o => <option key={o.slug} value={o.slug}>{o.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="sleek-label">Pengiriman</label>
                  <select className="sleek-input" value={deliveryMethod} onChange={e => handleDeliveryChange(e.target.value)}>
                    <option value="Ambil Sendiri">Ambil Sendiri</option>
                    <option value="Delivery Lain">Delivery Lain</option>
                  </select>
                </div>
              </div>

              {deliveryMethod !== 'Ambil Sendiri' && (
                <div style={{ background: '#FFF5F0', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', color: '#FF6B35', marginBottom: '1rem', fontWeight: 600 }}>
                  <i className="fas fa-info-circle"></i> Biaya delivery ditanggung customer. Customer memesan sendiri via Grab/Gojek/Lalamove.
                </div>
              )}

              <div className="sleek-group" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="sleek-label">Tanggal Booking</label>
                  <input type="date" className="sleek-input" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="sleek-label">Jam Booking</label>
                  <input type="time" className="sleek-input" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required />
                </div>
              </div>

              <div className="sleek-group">
                <label className="sleek-label">Pembayaran</label>
                <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #ddd', marginTop: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-qrcode" style={{ color: '#FF6B35' }}></i>
                    <strong>QRIS</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                    *Wajib mengirimkan bukti transfer saat di WhatsApp.
                  </p>
                </div>
              </div>

              <div className="sleek-summary">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#666' }}>Pesanan:</span>
                  <strong style={{ textAlign: 'right' }}>{getSummaryMenu() || '-'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#666' }}>Pengiriman:</span>
                  <strong>{deliveryMethod}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd', fontSize: '1.1rem' }}>
                  <span style={{ color: '#2B1717', fontWeight: 'bold' }}>Total:</span>
                  <strong style={{ color: '#FF6B35' }}>{getSummaryTotal()}</strong>
                </div>
              </div>

              <button type="button" className="btn-submit-sleek" onClick={submitOrder}>
                Lanjut ke WhatsApp <i className="fas fa-paper-plane" style={{ marginLeft: '5px' }}></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
