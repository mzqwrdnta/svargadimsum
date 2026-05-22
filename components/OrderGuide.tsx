export default function OrderGuide() {
  const steps = [
    { icon: 'fa-clipboard-list', title: 'Pilih Menu', desc: 'Pilih dimsum favoritmu dari menu.' },
    { icon: 'fa-box-open', title: 'Tentukan Paket', desc: 'Tentukan porsi dan level kepedasan.' },
    { icon: 'fa-whatsapp', title: 'Pesan via WA', desc: 'Klik beli untuk terhubung ke WhatsApp.' },
    { icon: 'fa-motorcycle', title: 'Diantar', desc: 'Pesanan segera dikirim ke alamatmu.' }
  ];

  return (
    <section className="order-modern-section" id="guide">
      <style>{`
        .order-modern-section {
          padding: 6rem 5%;
          background: #ffffff;
        }
        .order-modern-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .order-modern-header h4 {
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.9rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .order-modern-header h2 {
          font-size: clamp(2rem, 8vw, 3rem);
          color: #2B1717;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .order-modern-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .order-step-card {
          text-align: center;
          padding: 1.5rem;
          background: #fafafa;
          border-radius: 24px;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }
        .order-step-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          background: #ffffff;
        }
        .order-step-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 1.2rem;
          background: #FFF5F0;
          color: #FF6B35;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          transition: all 0.3s;
        }
        .order-step-card:hover .order-step-icon {
          background: #FF6B35;
          color: white;
          transform: scale(1.1);
        }
        .order-step-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #2B1717;
          margin-bottom: 0.6rem;
        }
        .order-step-desc {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
        }
        @media (max-width: 991px) {
          .order-modern-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .order-modern-grid { 
            grid-template-columns: 1fr; 
            max-width: 320px;
          }
          .order-modern-header h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="order-modern-header">
        <h4>Panduan Pemesanan</h4>
        <h2>Cara Order di Svarga</h2>
      </div>

      <div className="order-modern-grid">
        {steps.map((step, idx) => (
          <div className="order-step-card" key={idx}>
            <div className="order-step-icon">
              <i className={`fas ${step.icon}`}></i>
            </div>
            <h3 className="order-step-title">{step.title}</h3>
            <p className="order-step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
