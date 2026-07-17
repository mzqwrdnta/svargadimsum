import { Metadata } from 'next';
import MemoryGame from '@/components/MemoryGame';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Memory Game | Svarga Dimsum',
  description: 'Mainkan memory game Svarga Dimsum dan menangkan voucher diskon spesial.',
};

export const dynamic = 'force-dynamic';

export default async function GamePage() {
  const supabase = await createClient();

  const { data: settings } = await supabase.from('game_settings').select('*');
  const settingsObj = settings?.reduce((acc: any, s: any) => { acc[s.key] = s.value; return acc; }, {}) || {};

  const gameActive = settingsObj.game_active === 'true';
  const difficulty = settingsObj.game_difficulty || 'medium';
  const maxWinners = settingsObj.game_max_winners || '1';
  const startHour = settingsObj.game_start_hour || '01:00';
  const endHour = settingsObj.game_end_hour || '05:00';
  const timer = settingsObj.game_timer || (difficulty === 'easy' ? '60' : difficulty === 'hard' ? '30' : '45');
  const lives = settingsObj.game_lives || '3';
  const pairs = settingsObj.game_pairs || (difficulty === 'easy' ? '4' : difficulty === 'hard' ? '8' : '6');

  const diffLabel = difficulty === 'easy' ? 'Mudah' : difficulty === 'hard' ? 'Sulit' : 'Sedang';
  const diffColor = difficulty === 'easy' ? '#10b981' : difficulty === 'hard' ? '#ef4444' : '#f59e0b';

  return (
    <>
      <h1 className="sr-only">Memory Game Svarga Dimsum</h1>
      <style>{`
        .game-page-container { padding: 10rem 5% 6rem; background: #FFFDF9; min-height: 100vh; }
        .back-link-game {
          display: inline-flex; align-items: center; gap: 8px; color: #666; text-decoration: none;
          font-size: 1rem; font-weight: 600; padding: 0.8rem 1.5rem; background: white;
          border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s; margin-bottom: 3rem;
        }
        .back-link-game:hover { transform: translateX(-5px); color: #FF6B35; }
        .game-header { text-align: center; margin-bottom: 4rem; }
        .game-header h2 { font-size: 3.5rem; color: #2B1717; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 1.5rem; }
        .game-header h2 span { color: #FF6B35; }
        .game-header p { color: #666; font-size: 1.2rem; max-width: 700px; margin: 0 auto; line-height: 1.7; }
        .game-meta-bar {
          display: flex; justify-content: center; gap: 24px; margin-top: 2rem; flex-wrap: wrap;
        }
        .meta-chip {
          display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
          background: white; border-radius: 50px; font-size: 0.85rem; font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .guide-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem; margin-top: 5rem; max-width: 1200px; margin-left: auto; margin-right: auto;
        }
        .guide-card {
          background: white; padding: 2.5rem; border-radius: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #eee;
        }
        .guide-card h3 { font-size: 1.3rem; font-weight: 800; color: #2B1717; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 12px; }
        .guide-card h3 i { color: #FF6B35; }
        .guide-card ul { list-style: none; padding: 0; margin: 0; }
        .guide-card li { margin-bottom: 1rem; color: #666; display: flex; gap: 10px; line-height: 1.5; }
        .guide-card li::before { content: '•'; color: #FF6B35; font-weight: bold; }
        @media (max-width: 768px) {
          .game-header h2 { font-size: 2.5rem; }
          .game-page-container { padding-top: 8rem; }
          .game-meta-bar { gap: 10px; }
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
              Cocokkan semua kartu dimsum secepat mungkin untuk memenangkan kode voucher spesial!
            </p>
            <div className="game-meta-bar">
              <div className="meta-chip">
                <i className="fas fa-signal" style={{ color: diffColor }}></i>
                Level: <span style={{ color: diffColor }}>{diffLabel}</span>
              </div>
              <div className="meta-chip">
                <i className="fas fa-clock" style={{ color: '#3b82f6' }}></i>
                {timer}s / ronde
              </div>
              <div className="meta-chip">
                <i className="fas fa-heart" style={{ color: '#ef4444' }}></i>
                {lives} nyawa
              </div>
              <div className="meta-chip">
                <i className="fas fa-trophy" style={{ color: '#f59e0b' }}></i>
                {maxWinners} pemenang/hari
              </div>
              <div className="meta-chip">
                <i className="fas fa-calendar" style={{ color: '#8b5cf6' }}></i>
                {startHour} - {endHour} WIB
              </div>
            </div>
          </div>

          <MemoryGame />

          <div className="guide-grid">
            <div className="guide-card">
              <h3><i className="fas fa-book-open"></i> Aturan Main</h3>
              <ul>
                <li>Kamu memiliki {lives} kesempatan (nyawa) setiap harinya.</li>
                <li>Setiap sesi permainan dibatasi waktu {timer} detik.</li>
                <li>Jika waktu habis sebelum semua kartu terbuka, nyawa berkurang 1.</li>
                <li>Jika nyawa habis, kamu harus menunggu besok untuk bermain lagi.</li>
                <li>Hanya {maxWinners} pemenang yang bisa menang setiap hari.</li>
              </ul>
            </div>
            <div className="guide-card">
              <h3><i className="fas fa-gamepad"></i> Cara Bermain</h3>
              <ul>
                <li>Klik pada kartu untuk membukanya.</li>
                <li>Cari pasangan gambar yang sama secara berurutan.</li>
                <li>Jika gambar cocok, kartu akan tetap terbuka.</li>
                <li>Buka semua {pairs} pasangan kartu sebelum waktu habis untuk menang!</li>
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
