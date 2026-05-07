import { Metadata } from 'next';
import MemoryGame from '@/components/MemoryGame';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Memory Game | Svarga Dimsum',
  description: 'Mainkan memory game Svarga Dimsum dan menangkan voucher diskon spesial.',
};

export default function GamePage() {
  return (
    <>
      <h1 className="sr-only">Memory Game Svarga Dimsum</h1>
      <style>{`
        .game-page-container {
          padding: 10rem 5% 6rem;
          background: #FFFDF9;
          min-height: 100vh;
        }
        .back-link-game {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.8rem 1.5rem;
          background: white;
          border-radius: 50px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: all 0.3s;
          margin-bottom: 3rem;
        }
        .back-link-game:hover {
          transform: translateX(-5px);
          color: #FF6B35;
        }
        .game-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .game-header h2 {
          font-size: 3.5rem;
          color: #2B1717;
          font-weight: 900;
          letter-spacing: -1.5px;
          margin-bottom: 1.5rem;
        }
        .game-header h2 span { color: #FF6B35; }
        .game-header p {
          color: #666;
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .guide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 5rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        .guide-card {
          background: white;
          padding: 2.5rem;
          border-radius: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid #eee;
        }
        .guide-card h3 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #2B1717;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .guide-card h3 i { color: #FF6B35; }
        .guide-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .guide-card li {
          margin-bottom: 1rem;
          color: #666;
          display: flex;
          gap: 10px;
          line-height: 1.5;
        }
        .guide-card li::before {
          content: '•';
          color: #FF6B35;
          font-weight: bold;
        }
        @media (max-width: 768px) {
          .game-header h2 { font-size: 2.5rem; }
          .game-page-container { padding-top: 8rem; }
        }
      `}</style>

      <section className="game-page-container">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" className="back-link-game">
            <i className="fas fa-arrow-left"></i> Kembali ke Beranda
          </Link>

          <div className="game-header">
            <h2>Uji Ingatanmu, <span>Dapatkan Diskon!</span></h2>
            <p>
              Cocokkan semua kartu dimsum secepat mungkin untuk memenangkan kode voucher spesial yang bisa kamu gunakan untuk pesanan berikutnya.
            </p>
          </div>

          <MemoryGame />

          <div className="guide-grid">
            <div className="guide-card">
              <h3><i className="fas fa-book-open"></i> Aturan Main</h3>
              <ul>
                <li>Kamu memiliki 3 kesempatan (nyawa) setiap harinya.</li>
                <li>Setiap sesi permainan dibatasi waktu 30 detik.</li>
                <li>Jika waktu habis sebelum semua kartu terbuka, nyawa berkurang 1.</li>
                <li>Jika nyawa habis, kamu harus menunggu besok untuk bermain lagi.</li>
              </ul>
            </div>
            <div className="guide-card">
              <h3><i className="fas fa-gamepad"></i> Cara Bermain</h3>
              <ul>
                <li>Klik pada kartu untuk membukanya.</li>
                <li>Cari pasangan gambar yang sama secara berurutan.</li>
                <li>Jika gambar cocok, kartu akan tetap terbuka.</li>
                <li>Buka semua pasangan kartu sebelum waktu habis untuk menang!</li>
              </ul>
            </div>
            <div className="guide-card">
              <h3><i className="fas fa-ticket-alt"></i> Klaim Voucher</h3>
              <ul>
                <li>Setelah menang, kode voucher otomatis akan muncul di layar.</li>
                <li>Salin atau screenshot kode voucher tersebut.</li>
                <li>Klik tombol WhatsApp untuk mengirimkan kode ke admin kami.</li>
                <li>Voucher berlaku untuk pembelian via WhatsApp atau langsung di outlet.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
