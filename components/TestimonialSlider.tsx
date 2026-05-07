export default function TestimonialSlider() {
  const testimonials = [
    { name: '@rina_kuliner', rating: '★★★★★', text: '"Pelayanan cepat dan ramah, rasanya otentik! Sangat direkomendasikan untuk pecinta dimsum."' },
    { name: '@dimas_foodie', rating: '★★★★★', text: '"Dimsum kejunya lumer dan juicy banget! Pasti bakal pesen lagi buat acara keluarga minggu depan."' },
    { name: '@sari_momlife', rating: '★★★★★', text: '"Cocok buat bekal anak-anak, pasti habis. Pilihan sehat dan praktis yang selalu ditunggu-tunggu."' },
    { name: '@andi_jkt', rating: '★★★★', text: '"Pengiriman cepat, packing sangat rapi dan aman. Dimsum masih hangat saat sampai. Recommended!"' }
  ];

  return (
    <section className="testi-modern-section" id="testi">
      <style>{`
        .testi-modern-section {
          padding: 6rem 5%;
          background: #fafafa;
          overflow: hidden;
        }
        .testi-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .testi-header h4 {
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.9rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .testi-header h2 {
          font-size: 3rem;
          color: #2B1717;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .testi-scroll-container {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 2rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .testi-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .testi-card-modern {
          flex: 0 0 350px;
          scroll-snap-align: center;
          background: white;
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: transform 0.3s;
        }
        .testi-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }
        .testi-rating {
          color: #f39c12;
          font-size: 1.2rem;
          letter-spacing: 2px;
        }
        .testi-text {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.7;
          font-style: italic;
          flex: 1;
        }
        .testi-author {
          font-weight: 700;
          color: #2B1717;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .testi-author-avatar {
          width: 40px;
          height: 40px;
          background: #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 1.2rem;
        }
        @media (max-width: 768px) {
          .testi-card-modern {
            flex: 0 0 85%;
          }
        }
      `}</style>

      <div className="testi-header">
        <h4>Testimonial</h4>
        <h2>Apa Kata Mereka?</h2>
      </div>

      <div className="testi-scroll-container">
        {testimonials.map((t, idx) => (
          <div className="testi-card-modern" key={idx}>
            <div className="testi-rating">{t.rating}</div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-author">
              <div className="testi-author-avatar">
                <i className="fas fa-user"></i>
              </div>
              {t.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
