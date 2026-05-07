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
          font-size: 3rem;
          color: #2B1717;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .order-modern-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .order-step-card {
          text-align: center;
          padding: 2rem;
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
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: #FFF5F0;
          color: #FF6B35;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          transition: all 0.3s;
        }
        .order-step-card:hover .order-step-icon {
          background: #FF6B35;
          color: white;
          transform: scale(1.1);
        }
        .order-step-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2B1717;
          margin-bottom: 0.8rem;
        }
        .order-step-desc {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.6;
        }
        @media (max-width: 991px) {
          .order-modern-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 576px) {
          .order-modern-grid { grid-template-columns: 1fr; }
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
