'use client';

import { useState, useEffect } from 'react';

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000); // 2 seconds total to account for preloader

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="promo-overlay" onClick={closePopup}>
      <style>{`
        .promo-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          cursor: pointer;
          animation: promoFadeIn 0.5s ease;
        }
        .promo-content {
          position: relative;
          max-width: 450px;
          width: 100%;
          background: white;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          cursor: default;
          animation: promoPopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .promo-img {
          width: 100%;
          height: auto;
          display: block;
        }
        .close-promo {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 45px;
          height: 45px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          color: #2B1717;
          font-size: 1.3rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 20;
        }
        .close-promo:hover {
          transform: rotate(90deg) scale(1.1);
          background: #FF6B35;
          color: white;
        }
        @keyframes promoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes promoPopIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 576px) {
          .promo-content { border-radius: 20px; }
          .close-promo { width: 35px; height: 35px; font-size: 1rem; top: 10px; right: 10px; }
        }
      `}</style>
      <div className="promo-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-promo" onClick={closePopup}>
          <i className="fas fa-times"></i>
        </button>
        <img src="/img/poster.jpg" alt="Promo Spesial Svarga" className="promo-img" />
      </div>
    </div>
  );
}
