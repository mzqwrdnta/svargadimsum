import FooterOutletSlider from './FooterOutletSlider';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="modern-footer" id="kontak">
      <style>{`
        .modern-footer {
          background: #ffffff;
          padding: 6rem 5% 2rem;
          border-top: 1px solid #eee;
          color: #2B1717;
        }
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 1.2fr 1fr;
          gap: 3rem;
        }
        .footer-brand h2 {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -1px;
          margin-bottom: 1.5rem;
        }
        .footer-brand h2 span {
          color: #FF6B35;
        }
        .footer-brand p {
          color: #666;
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        .footer-socials {
          display: flex;
          gap: 12px;
        }
        .social-icon {
          width: 40px;
          height: 40px;
          background: #fafafa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2B1717;
          text-decoration: none;
          transition: all 0.3s;
          font-size: 1.1rem;
        }
        .social-icon:hover {
          background: #FF6B35;
          color: white;
          transform: translateY(-3px);
        }
        .footer-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #2B1717;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 0.8rem;
        }
        .footer-links a {
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
          font-weight: 500;
          font-size: 0.95rem;
        }
        .footer-links a:hover {
          color: #FF6B35;
        }
        .footer-contact-item {
          display: flex;
          gap: 12px;
          margin-bottom: 1.2rem;
          color: #666;
          line-height: 1.5;
          font-size: 0.95rem;
        }
        .footer-contact-item i {
          color: #FF6B35;
          margin-top: 4px;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 4rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #999;
          font-size: 0.85rem;
        }
        @media (max-width: 1200px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; text-align: center; gap: 3rem; }
          .footer-brand { margin: 0 auto; max-width: 400px; }
          .footer-socials { justify-content: center; }
          .footer-contact-item { justify-content: center; text-align: center; }
          .footer-bottom { 
            flex-direction: column; 
            gap: 1rem; 
            text-align: center; 
            padding: 2rem 1rem;
          }
          .modern-footer { padding: 4rem 1rem 2rem; }
        }
        @media (max-width: 480px) {
          .footer-brand h2 { font-size: 1.5rem; }
          .footer-title { font-size: 1rem; margin-bottom: 1.2rem; }
          .footer-bottom p { font-size: 0.8rem; margin: 0; }
        }
      `}</style>

      <div className="footer-grid">
        <div className="footer-brand">
          <h2>SVARGA<span>DIMSUM</span></h2>
          <p>Dimsum premium dengan cita rasa autentik. Dibuat dengan bahan berkualitas untuk kepuasan Anda.</p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/svarga.foodies/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://wa.me/6285213963005" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div className="footer-nav">
          <h4 className="footer-title">Navigasi</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/outlet">Outlet</Link></li>
            <li><Link href="/kontak">Kontak</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-title">Kontak</h4>
          <div className="footer-contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Jl. Raya Abdul Gani No.2 Blok B, Depok</span>
          </div>
          <div className="footer-contact-item">
            <i className="fas fa-phone-alt"></i>
            <span>+62 852-1396-3005</span>
          </div>
          <div className="footer-contact-item">
            <i className="fas fa-envelope"></i>
            <span>hello@svargadimsum.com</span>
          </div>
        </div>

        <div className="footer-outlets" id="outlet">
          <h4 className="footer-title">Cabang Kami</h4>
          <FooterOutletSlider />
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Svarga Dimsum. All rights reserved.</p>
        <p>Premium Quality Dimsum</p>
      </div>
    </footer>
  );
}
