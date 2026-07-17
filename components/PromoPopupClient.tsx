'use client';

import { useState, useEffect } from 'react';

export default function PromoPopupClient({ imageUrl }: { imageUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('promoPopupSeen');
    
    if (!hasSeenPopup) {
      // Delay showing the popup for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('promoPopupSeen', 'true');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="promo-overlay">
      <style>{`
        .promo-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.4s ease-out;
        }
        
        .promo-content {
          position: relative;
          background: transparent;
          max-width: 500px;
          width: 100%;
          animation: popUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .promo-close {
          position: absolute;
          top: -15px;
          right: -15px;
          background: #FF6B35;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        
        .promo-close:hover {
          transform: scale(1.1);
        }
        
        .promo-image {
          width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          display: block;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes popUp {
          from { opacity: 0; transform: scale(0.8) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      
      <div className="promo-content">
        <button 
          className="promo-close" 
          onClick={() => setIsOpen(false)}
          aria-label="Close promotion"
        >
          &times;
        </button>
        <img 
          src={imageUrl} 
          alt="Promo Spesial Svarga Dimsum" 
          className="promo-image"
        />
      </div>
    </div>
  );
}
