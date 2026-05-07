import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak Kami | Svarga Dimsum',
  description: 'Hubungi Svarga Dimsum untuk pemesanan, pertanyaan, atau umpan balik. Temukan lokasi kami di peta dan kontak WhatsApp.',
};

export default function KontakPage() {
  return (
    <>
      <h1 className="sr-only">Kontak Svarga Dimsum</h1>
      <section className="contact-modern-page">
        <style>{`
          .contact-modern-page {
            padding: 10rem 5% 6rem;
            background: #FFFDF9;
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .contact-container {
            max-width: 800px;
            width: 100%;
            text-align: center;
            background: white;
            padding: 4rem;
            border-radius: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.05);
          }
          .contact-container h4 {
            color: #FF6B35;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-weight: 800;
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          .contact-container h2 {
            font-size: 3.5rem;
            color: #2B1717;
            margin-bottom: 1.5rem;
            font-weight: 800;
            letter-spacing: -1.5px;
          }
          .contact-container p {
            font-size: 1.2rem;
            color: #666;
            line-height: 1.7;
            margin-bottom: 3rem;
          }
          .wa-btn-large {
            display: inline-flex;
            align-items: center;
            gap: 15px;
            background: #25D366;
            color: white;
            padding: 20px 45px;
            border-radius: 60px;
            font-size: 1.3rem;
            font-weight: 800;
            text-decoration: none;
            transition: all 0.3s;
            box-shadow: 0 15px 30px rgba(37, 211, 102, 0.3);
          }
          .wa-btn-large:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(37, 211, 102, 0.4);
            filter: brightness(1.05);
          }
          .contact-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-top: 4rem;
            border-top: 1px solid #eee;
            padding-top: 3rem;
          }
          .contact-item h5 {
            font-size: 1rem;
            color: #2B1717;
            margin-bottom: 0.5rem;
            font-weight: 700;
          }
          .contact-item p {
            font-size: 0.95rem;
            margin-bottom: 0;
          }
          @media (max-width: 768px) {
            .contact-container { padding: 3rem 1.5rem; }
            .contact-container h2 { font-size: 2.5rem; }
            .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
          }
        `}</style>

        <div className="contact-container">
          <h4>Get In Touch</h4>
          <h2>Ada Pertanyaan? Kami Siap Membantu!</h2>
          <p>
            Baik itu pesanan partai besar, pertanyaan tentang menu, atau sekadar ingin memberikan masukan, tim Svarga Dimsum selalu siap melayani Anda dengan sepenuh hati.
          </p>
          
          <a href="https://wa.me/6285213963005" target="_blank" rel="noopener noreferrer" className="wa-btn-large">
            <i className="fab fa-whatsapp"></i> Chat via WhatsApp
          </a>

          <div className="contact-grid">
            <div className="contact-item">
              <h5>Email</h5>
              <p>halo@svargadimsum.com</p>
            </div>
            <div className="contact-item">
              <h5>Lokasi Utama</h5>
              <p>Depok, Jawa Barat</p>
            </div>
            <div className="contact-item">
              <h5>Jam Operasional</h5>
              <p>Setiap Hari: 10:00 - 21:00</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
