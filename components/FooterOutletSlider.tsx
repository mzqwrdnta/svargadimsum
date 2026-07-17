"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FooterOutletSlider({ outlets }: { outlets: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  if (!outlets || outlets.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? outlets.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === outlets.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentOutlet = outlets[currentIndex];

  const handleImageClick = () => {
    router.push(`/outlet/${currentOutlet.slug}`);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '160px', 
          borderRadius: '15px', 
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
        onClick={handleImageClick}
        title={`Lihat detail cabang ${currentOutlet.name}`}
      >
        <img 
          src={currentOutlet.image} 
          alt={currentOutlet.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'opacity 0.3s'
          }} 
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
          color: 'white',
          padding: '12px 10px 10px 10px',
          textAlign: 'center',
        }}>
          <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{currentOutlet.name}</h5>
        </div>
      </div>
      
      {/* Controls below image */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={handlePrev}
          style={{
            background: '#FF6B35',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s, background 0.2s'
          }}
          aria-label="Cabang Sebelumnya"
        >
          <i className="fas fa-chevron-left" style={{ fontSize: '0.8rem' }}></i>
        </button>
        
        <div style={{ display: 'flex', gap: '6px' }}>
          {outlets.map((_, idx) => (
            <div 
              key={idx} 
              style={{
                width: idx === currentIndex ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: idx === currentIndex ? '#FF6B35' : '#E0E0E0',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          style={{
            background: '#FF6B35',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s, background 0.2s'
          }}
          aria-label="Cabang Selanjutnya"
        >
          <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
        </button>
      </div>
    </div>
  );
}
