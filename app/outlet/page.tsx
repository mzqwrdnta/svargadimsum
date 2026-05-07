import { Metadata } from 'next';
import Link from 'next/link';
import { outlets } from '@/data/outlets';

export const metadata: Metadata = {
  title: 'Daftar Outlet | Svarga Dimsum',
  description: 'Temukan lokasi cabang Svarga Dimsum terdekat dari tempat Anda. Tersedia di Depok, Bogor, dan sekitarnya.',
};

export default function OutletListPage() {
  return (
    <>
      <h1 className="sr-only">Daftar Outlet Cabang Svarga Dimsum</h1>
      <style>{`
        .outlet-card-modern {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0,0,0,0.02);
          height: 100%;
        }
        .outlet-card-modern:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(255, 107, 53, 0.15);
        }
        .btn-modern-primary {
          width: 100%;
          padding: 1rem;
          background: #FF6B35;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.3s ease;
        }
        .btn-modern-primary:hover {
          background: #e85a25;
        }
        .img-wrapper {
          width: 100%;
          height: 260px;
          padding: 1.5rem;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f0f0f0;
        }
      `}</style>
      <section style={{ paddingTop: '8rem', paddingBottom: '6rem', paddingLeft: '5%', paddingRight: '5%', background: '#FFFDF9', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', color: '#2B1717', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Cabang Kami</h2>
          <p style={{ color: '#666', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Kunjungi outlet Svarga Dimsum terdekat untuk menikmati sajian dimsum premium yang hangat dan lezat langsung di tempat.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          {outlets.map((outlet) => (
            <div key={outlet.slug} className="outlet-card-modern">
              <div className="img-wrapper">
                <img 
                  src={outlet.image} 
                  alt={outlet.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} 
                />
              </div>
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.6rem', color: '#2B1717', marginBottom: '0.8rem', fontWeight: 700 }}>{outlet.name}</h3>
                <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '2rem', flex: 1, lineHeight: 1.6 }}>{outlet.description}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem', background: '#fff9f6', padding: '1.2rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#444', fontSize: '0.95rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#FF6B35', marginTop: '4px', width: '16px', textAlign: 'center' }}></i>
                    <span style={{ lineHeight: 1.4 }}>{outlet.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444', fontSize: '0.95rem' }}>
                    <i className="fas fa-clock" style={{ color: '#FF6B35', width: '16px', textAlign: 'center' }}></i>
                    <span>{outlet.hours}</span>
                  </div>
                </div>

                <Link href={`/outlet/${outlet.slug}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                  <button className="btn-modern-primary">
                    Lihat Detail Outlet <i className="fas fa-arrow-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
