import Link from 'next/link';

export default function GameGuide() {
  return (
    <section className="promo-banner-section">
      <style>{`
        .promo-banner-section {
          padding: 4rem 5%;
          background: #ffffff;
        }
        .promo-banner-container {
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(135deg, #2B1717 0%, #4A2B2B 100%);
          border-radius: 32px;
          padding: 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(43, 23, 23, 0.2);
        }
        .promo-banner-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }
        .promo-banner-content h4 {
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 800;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .promo-banner-content h2 {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .promo-banner-content p {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .promo-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #FF6B35;
          color: white;
          padding: 16px 36px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.4);
        }
        .promo-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 107, 53, 0.5);
          background: #ff7d4d;
        }
        .promo-banner-image {
          position: relative;
          z-index: 2;
          width: 400px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .promo-banner-image img {
          width: 100%;
          max-width: 350px;
          animation: float 6s ease-in-out infinite;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.3));
        }
        .promo-circle-bg {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0) 70%);
          right: -100px;
          top: -100px;
          border-radius: 50%;
          z-index: 1;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @media (max-width: 991px) {
          .promo-banner-container {
            flex-direction: column;
            text-align: center;
            padding: 3rem 2rem;
            gap: 3rem;
          }
          .promo-banner-content h2 {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div className="promo-banner-container">
        <div className="promo-circle-bg"></div>
        
        <div className="promo-banner-content">
          <h4>Spesial Promo</h4>
          <h2>Main Game & Dapatkan Voucher!</h2>
          <p>
            Tantang ingatanmu dengan mencocokkan kartu dimsum kami. Selesaikan secepat mungkin dan klaim diskon spesial untuk pesananmu hari ini.
          </p>
          <Link href="/game" className="promo-btn">
            Mulai Bermain Sekarang <i className="fas fa-gamepad"></i>
          </Link>
        </div>

        <div className="promo-banner-image">
          <img src="/img/maskot2.png" alt="Svarga Mascot" />
        </div>
      </div>
    </section>
  );
}
