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
          .cart-modern-toggle {
            position: fixed;
            bottom: 50px;
            right: 40px;
            z-index: 9999;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          .wa-modern-toggle {
            position: fixed;
            bottom: 40px;
            right: 40px;
            z-index: 9999;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          .toggles-hidden {
            opacity: 0;
            pointer-events: none;
            transform: translateY(30px);
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
          .wa-toggle-btn {
            width: 65px;
            height: 65px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
            transition: all 0.3s;
            text-decoration: none;
          }
          .wa-toggle-btn:hover {
            transform: scale(1.1);
            background: #20ba5a;
          }
          .cart-toggle-btn {
            width: 65px;
            height: 65px;
            background: #2B1717;
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            position: relative;
            transition: transform 0.3s;
          }
          .cart-toggle-btn:hover {
            transform: scale(1.1);
          }
          .cart-count-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #FF6B35;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 0.8rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
          }
          .cart-sidebar-modern {
            position: fixed;
            top: 0;
            right: -450px;
            width: 450px;
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
            padding: 2.5rem;
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
          .close-cart-modern:hover {
            background: #eee;
            transform: rotate(90deg);
          }
          .cart-items-modern {
            flex: 1;
            padding: 2.5rem;
            overflow-y: auto;
          }
          .empty-cart-msg {
            text-align: center;
            margin-top: 4rem;
            color: #999;
          }
          .cart-item-modern {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2rem;
            align-items: center;
          }
          .cart-item-img-modern {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 15px;
          }
          .cart-item-info {
            flex: 1;
          }
          .cart-item-info h4 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #2B1717;
            margin-bottom: 0.3rem;
          }
          .cart-item-info p {
            color: #FF6B35;
            font-weight: 700;
            font-size: 0.95rem;
          }
          .cart-quantity-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #f9f9f9;
            padding: 6px 12px;
            border-radius: 30px;
            width: fit-content;
            margin-top: 10px;
          }
          .cart-quantity-controls button {
            background: none;
            border: none;
            cursor: pointer;
            color: #2B1717;
            font-size: 0.8rem;
          }
          .cart-quantity-controls span {
            font-weight: 800;
            font-size: 0.9rem;
            min-width: 20px;
            text-align: center;
          }
          .remove-item-btn {
            color: #ff4d4d;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            margin-left: auto;
            opacity: 0.5;
            transition: opacity 0.3s;
          }
          .remove-item-btn:hover {
            opacity: 1;
          }
          .cart-footer-modern {
            padding: 2.5rem;
            background: #fafafa;
            border-top: 1px solid #eee;
          }
          .cart-summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            font-size: 1.2rem;
            font-weight: 800;
            color: #2B1717;
          }
          .checkout-btn-modern {
            width: 100%;
            background: #FF6B35;
            color: white;
            border: none;
            padding: 18px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 25px rgba(255,107,53,0.3);
          }
          .checkout-btn-modern:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(255,107,53,0.4);
            filter: brightness(1.05);
          }
          @media (max-width: 576px) {
            .cart-sidebar-modern { width: 100%; right: -100%; }
            .cart-header-modern { padding-top: 80px; }
            .cart-modern-toggle { bottom: 25px !important; right: 25px !important; }
            .wa-modern-toggle { bottom: 20px !important; right: 25px !important; }
            .cart-toggle-btn, .wa-toggle-btn { width: 55px !important; height: 55px !important; font-size: 1.3rem !important; }
            .cart-count-badge { width: 20px !important; height: 20px !important; font-size: 0.7rem !important; }
          }
        `}</style>

      <div className={`cart-overlay ${isActive ? 'active' : ''}`} onClick={() => setIsActive(false)} />

      <div className={`cart-modern-toggle ${isActive ? 'toggles-hidden' : ''}`}>
        <button className="cart-toggle-btn" onClick={() => setIsActive(!isActive)}>
          <i className="fas fa-shopping-cart"></i>
          {isMounted && totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
        </button>
      </div>

      <div className={`wa-modern-toggle ${isActive ? 'toggles-hidden' : ''}`}>
        <a
          href="https://wa.me/6282123149872?text=Halo%20Svarga%20Dimsum%2C%20saya%20ingin%20bertanya%20mengenai%20menu%20dan%20layanan..."
          className="wa-toggle-btn"
          target="_blank"
          rel="noopener noreferrer"
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
            <div className="empty-cart-msg">
              <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.2 }}></i>
              <p>Keranjang Anda masih kosong</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div className="cart-item-modern" key={index}>
                <img src={item.image} alt={item.name} className="cart-item-img-modern" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>Rp {item.price.toLocaleString('id-ID')}</p>
                  <div className="cart-quantity-controls">
                    <button onClick={() => decreaseQuantity(index)}><i className="fas fa-minus"></i></button>
                    <span>{item.quantity}</span>
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
