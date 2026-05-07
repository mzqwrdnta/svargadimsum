import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { outlets } from '@/data/outlets';
import Link from 'next/link';

export async function generateStaticParams() {
  return outlets.map((outlet) => ({
    slug: outlet.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const outlet = outlets.find((o) => o.slug === resolvedParams.slug);
  
  if (!outlet) {
    return { title: 'Outlet Tidak Ditemukan' };
  }

  const keywords = [
    `dimsum ${outlet.slug}`,
    `dimsum dekat ${outlet.name}`,
    `svarga dimsum ${outlet.slug}`,
    'dimsum mentai depok',
    'dimsum premium',
    'outlet dimsum svarga'
  ];

  return {
    title: `${outlet.name}`,
    description: `${outlet.description} Berlokasi di ${outlet.address}. Nikmati dimsum premium terbaik di kawasan ${outlet.slug}.`,
    keywords: keywords.join(', '),
    openGraph: {
      title: `${outlet.name} | Svarga Dimsum`,
      description: outlet.description,
      images: [outlet.image],
    }
  };
}

export default async function OutletDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const outlet = outlets.find((o) => o.slug === resolvedParams.slug);

  if (!outlet) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": outlet.name,
    "description": outlet.description,
    "image": `https://svargadimsum.com${outlet.image}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": outlet.address,
      "addressLocality": outlet.slug,
      "addressRegion": "Jawa Barat",
      "addressCountry": "ID"
    },
    "telephone": outlet.phone,
    "openingHours": "Mo-Su 10:00-21:00",
    "url": `https://svargadimsum.com/outlet/${outlet.slug}`,
    "menu": "https://svargadimsum.com/menu",
    "servesCuisine": "Dimsum, Asian",
    "priceRange": "$$"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Detail Outlet {outlet.name}</h1>
      <style>{`
        .detail-card {
          max-width: 1100px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
        }
        .detail-grid {
          display: flex;
          flex-wrap: wrap;
        }
        .image-container {
          flex: 1 1 500px;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border-right: 1px solid #f0f0f0;
        }
        .info-container {
          flex: 1 1 400px;
          padding: 3.5rem;
          display: flex;
          flex-direction: column;
        }
        .detail-btn {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          text-decoration: none;
          flex: 1;
          text-align: center;
        }
        .btn-primary {
          background: #FF6B35;
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
        }
        .btn-primary:hover {
          background: #e85a25;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }
        .btn-secondary {
          background: #FFF5F0;
          color: #FF6B35;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }
        .btn-secondary:hover {
          background: #FFEBE1;
          transform: translateY(-2px);
        }
        .info-item {
          display: flex;
          gap: 15px;
          padding: 1.2rem;
          background: #fff9f6;
          border-radius: 16px;
          margin-bottom: 1rem;
          transition: transform 0.2s ease;
        }
        .info-item:hover {
          transform: translateX(5px);
        }
        .info-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF6B35;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          font-size: 1.2rem;
        }
        @media (max-width: 768px) {
          .image-container {
            border-right: none;
            border-bottom: 1px solid #f0f0f0;
            padding: 1rem;
          }
          .info-container {
            padding: 2rem;
          }
          .action-buttons {
            flex-direction: column;
          }
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          background: white;
          border-radius: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        .back-link:hover {
          transform: translateX(-5px);
        }
      `}</style>
      <section style={{ paddingTop: '8rem', paddingBottom: '6rem', paddingLeft: '5%', paddingRight: '5%', background: '#FFFDF9', minHeight: '80vh' }}>
        
        <div style={{ maxWidth: '1100px', margin: '0 auto', marginBottom: '2rem' }}>
          <Link href="/outlet" className="back-link">
            <i className="fas fa-arrow-left"></i> Kembali ke Daftar Outlet
          </Link>
        </div>

        <div className="detail-card">
          <div className="detail-grid">
            <div className="image-container">
              <img 
                src={outlet.image} 
                alt={outlet.name} 
                style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', borderRadius: '16px' }} 
              />
            </div>
            
            <div className="info-container">
              <div style={{ display: 'inline-block', background: '#FFF5F0', color: '#FF6B35', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.2rem', alignSelf: 'flex-start', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Detail Cabang
              </div>
              
              <h2 style={{ fontSize: '2.5rem', color: '#2B1717', marginBottom: '1.5rem', lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.5px' }}>{outlet.name}</h2>
              <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                {outlet.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#2B1717', marginBottom: '4px', fontSize: '1.05rem' }}>Alamat Lengkap</strong>
                    <span style={{ color: '#555', lineHeight: 1.5 }}>{outlet.address}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#2B1717', marginBottom: '4px', fontSize: '1.05rem' }}>Jam Operasional</strong>
                    <span style={{ color: '#555' }}>{outlet.hours}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#2B1717', marginBottom: '4px', fontSize: '1.05rem' }}>Telepon / WhatsApp</strong>
                    <span style={{ color: '#555' }}>{outlet.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons CTA */}
              <div className="action-buttons" style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(outlet.name + ' ' + outlet.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="detail-btn btn-primary" 
                  title="Buka rute di Google Maps"
                >
                  <i className="fas fa-directions"></i> Petunjuk Arah
                </a>
                <a 
                  href={`https://wa.me/${outlet.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="detail-btn btn-secondary" 
                  title="Hubungi via WhatsApp"
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }}></i> Hubungi
                </a>
              </div>
            </div>
          </div>
          
          <div style={{ width: '100%', height: '450px', borderTop: '1px solid #f0f0f0' }}>
            <iframe 
              src={outlet.mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
