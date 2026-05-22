'use client';

import { useEffect, useState, useCallback } from 'react';

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartSidebar() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('dimsumCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const handleCartUpdate = (e: CustomEvent<CartItem[]>) => {
      setCart(e.detail);
    };

    window.addEventListener('cartUpdated' as any, handleCartUpdate);
    return () => window.removeEventListener('cartUpdated' as any, handleCartUpdate);
  }, []);

  const saveCart = useCallback((newCart: CartItem[]) => {
    localStorage.setItem('dimsumCart', JSON.stringify(newCart));
    setCart(newCart);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: newCart }));
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const increaseQuantity = (index: number) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    saveCart(newCart);
  };

  const decreaseQuantity = (index: number) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    } else {
      newCart.splice(index, 1);
    }
    saveCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  const checkout = () => {
    if (cart.length === 0) return;
    window.dispatchEvent(new CustomEvent('checkoutFromCart'));
    setIsActive(false);
  };

  return (
    <>
      <style>{`
        .floating-toggles-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
          z-index: 10003;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .floating-toggles-container.toggles-hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateY(30px);
        }
        .cart-toggle-btn {
          width: 60px;
          height: 60px;
          background: #2B1717;
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          position: relative;
          transition: transform 0.3s;
        }
        .wa-toggle-btn {
          width: 60px;
          height: 60px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
          transition: all 0.3s;
          text-decoration: none;
        }
        .cart-toggle-btn:hover, .wa-toggle-btn:hover {
          transform: scale(1.1);
        }
        .cart-count-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #FF6B35;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          z-index: 2;
        }
        @media (max-width: 576px) {
          .floating-toggles-container {
            bottom: 20px;
            right: 20px;
            gap: 12px;
          }
          .cart-toggle-btn, .wa-toggle-btn {
            width: 55px;
            height: 55px;
            font-size: 1.3rem;
          }
          .cart-count-badge {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
          }
          .cart-sidebar-modern { width: 100%; right: -100%; }
          .cart-header-modern { padding-top: 80px; }
        }
        @media (max-width: 320px) {
          .floating-toggles-container {
            bottom: 15px;
            right: 15px;
            gap: 10px;
          }
          .cart-header-modern h3 { font-size: 1.2rem; }
        }
        
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 10002;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s;
        }
        .cart-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }
        .cart-sidebar-modern {
          position: fixed;
          top: 0;
          right: -450px;
          width: 450px;
          max-width: 100%;
          height: 100vh;
          background: white;
          z-index: 10005;
          box-shadow: -20px 0 50px rgba(0,0,0,0.1);
          transition: right 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
          display: flex;
          flex-direction: column;
        }
        .cart-sidebar-modern.active {
          right: 0;
        }
        .cart-header-modern {
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        .cart-header-modern h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #2B1717;
        }
        .close-cart-modern {
          background: #f5f5f5;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .cart-items-modern {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        .cart-item-modern {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: center;
        }
        .cart-item-img-modern {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 12px;
        }
        .cart-item-info {
          flex: 1;
        }
        .cart-quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f9f9f9;
          padding: 4px 10px;
          border-radius: 30px;
          width: fit-content;
          margin-top: 8px;
        }
        .cart-quantity-controls button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
        }
        .remove-item-btn {
          color: #ff4d4d;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.5;
        }
        .cart-footer-modern {
          padding: 2rem;
          background: #fafafa;
          border-top: 1px solid #eee;
        }
        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          font-weight: 800;
        }
        .checkout-btn-modern {
          width: 100%;
          background: #FF6B35;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>

      <div className={`cart-overlay ${isActive ? 'active' : ''}`} onClick={() => setIsActive(false)} />

      <div className={`floating-toggles-container ${isActive ? 'toggles-hidden' : ''}`}>
        <button className="cart-toggle-btn" onClick={() => setIsActive(!isActive)} title="Buka Keranjang">
          <i className="fas fa-shopping-cart"></i>
          {isMounted && totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
        </button>

        <a
          href="https://wa.me/6282123149872?text=Halo%20Svarga%20Dimsum%2C%20saya%20ingin%20bertanya%20mengenai%20menu%20dan%20layanan..."
          className="wa-toggle-btn"
          target="_blank"
          rel="noopener noreferrer"
          title="Tanya via WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>

      <div className={`cart-sidebar-modern ${isActive ? 'active' : ''}`}>
        <div className="cart-header-modern">
          <h3>Keranjang Saya</h3>
          <button className="close-cart-modern" onClick={() => setIsActive(false)}>&times;</button>
        </div>

        <div className="cart-items-modern">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: '#999' }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.2 }}></i>
              <p>Keranjang Anda masih kosong</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div className="cart-item-modern" key={index}>
                <img src={item.image} alt={item.name} className="cart-item-img-modern" />
                <div className="cart-item-info">
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{item.name}</h4>
                  <p style={{ margin: '4px 0', color: '#FF6B35', fontWeight: 700 }}>Rp {item.price.toLocaleString('id-ID')}</p>
                  <div className="cart-quantity-controls">
                    <button onClick={() => decreaseQuantity(index)}><i className="fas fa-minus"></i></button>
                    <span style={{ fontWeight: 800 }}>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(index)}><i className="fas fa-plus"></i></button>
                  </div>
                </div>
                <button className="remove-item-btn" onClick={() => removeFromCart(index)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer-modern">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
          </div>
          <button
            className="checkout-btn-modern"
            onClick={checkout}
            disabled={cart.length === 0}
            style={cart.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            Selesaikan Pesanan
          </button>
        </div>
      </div>
    </>
  );
}
