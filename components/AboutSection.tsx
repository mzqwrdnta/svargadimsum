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
          }
        }
        .about-modern-image {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.08);
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
          top: 30px;
          right: 30px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 700;
          color: #FF6B35;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          z-index: 2;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
        }
        .about-modern-content h4 {
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.9rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          display: block;
        }
        .about-modern-content h2 {
          font-size: 3.5rem;
          color: #2B1717;
          line-height: 1.15;
          margin-bottom: 2rem;
          font-weight: 800;
          letter-spacing: -1.5px;
        }
        @media (max-width: 768px) {
          .about-modern-content h2 { font-size: 2.5rem; letter-spacing: -1px; }
        }
        .about-modern-content p {
          font-size: 1.15rem;
          color: #555;
          line-height: 1.8;
          margin-bottom: 3rem;
        }
        .about-modern-stats {
          display: flex;
          gap: 4rem;
          border-top: 1px solid #f0f0f0;
          padding-top: 2.5rem;
        }
        @media (max-width: 991px) {
          .about-modern-stats { justify-content: center; gap: 3rem; }
        }
        .stat-modern-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stat-modern-number {
          font-size: 3rem;
          font-weight: 800;
          color: #FF6B35;
          line-height: 1;
          letter-spacing: -1px;
        }
        .stat-modern-label {
          font-size: 1rem;
          color: #888;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
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
