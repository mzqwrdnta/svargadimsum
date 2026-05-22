'use client';

import { useEffect } from 'react';

export default function AboutSection() {
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

    document.querySelectorAll('.modern-reveal').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-modern-section" id="about">
      <style>{`
        .about-modern-section {
          padding: 8rem 5%;
          background: #ffffff;
          overflow: hidden;
        }
        .about-modern-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        @media (max-width: 991px) {
          .about-modern-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
            padding: 0 1rem;
          }
          .about-modern-stats { 
            flex-direction: column; 
            gap: 2rem; 
            align-items: center; 
          }
        }
        .about-modern-image {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.08);
          max-width: 500px;
          margin: 0 auto;
        }
        .about-modern-image img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.8s ease;
        }
        .about-modern-image:hover img {
          transform: scale(1.05);
        }
        .about-modern-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 700;
          color: #FF6B35;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          z-index: 2;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }
        .about-modern-content h4 {
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          font-weight: 800;
          margin-bottom: 1rem;
          display: block;
        }
        .about-modern-content h2 {
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          color: #2B1717;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          font-weight: 800;
          letter-spacing: -1.5px;
        }
        .about-modern-content p {
          font-size: 1.05rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .about-modern-stats {
          display: flex;
          gap: 3rem;
          border-top: 1px solid #f0f0f0;
          padding-top: 2rem;
        }
        .stat-modern-box {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .stat-modern-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FF6B35;
          line-height: 1;
          letter-spacing: -1px;
        }
        .stat-modern-label {
          font-size: 0.9rem;
          color: #888;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        @media (max-width: 480px) {
          .about-modern-section {
            padding: 4rem 1rem;
          }
          .about-modern-content h2 {
            font-size: 1.8rem;
          }
          .stat-modern-number {
            font-size: 2rem;
          }
        }
        .modern-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .modern-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="about-modern-container">
        <div className="about-modern-image modern-reveal">
          <div className="about-modern-badge">✨ Premium Quality</div>
          <img src="/img/svarga.jpg" alt="Svarga Dimsum Premium" />
        </div>

        <div className="about-modern-content modern-reveal" style={{ transitionDelay: '0.2s' }}>
          <h4>Tentang Kami</h4>
          <h2>Kami Bukan Sekadar Jual Dimsum.</h2>
          <p>
            Svarga Dimsum lahir dari dapur rumahan dengan satu misi: membuat orang bahagia lewat makanan sederhana yang
            rasanya luar biasa. Dibuat dari bahan pilihan, tanpa pengawet, dan dimasak dengan penuh cinta.
          </p>

          <div className="about-modern-stats modern-reveal" style={{ transitionDelay: '0.4s' }}>
            <div className="stat-modern-box">
              <span className="stat-modern-number">12.000+</span>
              <span className="stat-modern-label">Pelanggan Setia</span>
            </div>
            <div className="stat-modern-box">
              <span className="stat-modern-number">4.9/5</span>
              <span className="stat-modern-label">Rating Review</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
