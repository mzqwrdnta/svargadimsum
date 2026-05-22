'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const PLAYER_KEY = 'svarga_player';

type GameState = 'LOADING' | 'CLOSED' | 'WINNER_EXISTS' | 'ALREADY_PLAYED' | 'REGISTER' | 'PLAYING' | 'WON' | 'LOST';

export default function MemoryGame() {
  const [gameState, setGameState] = useState<GameState>('REGISTER');
  const [formData, setFormData] = useState({ nama: '', whatsapp: '', kota: '', instagram: '' });
  const [chances, setChances] = useState(3);
  const [timer, setTimer] = useState(30);
  const [result, setResult] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [symbols, setSymbols] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [todayWinner, setTodayWinner] = useState<{ nama: string; waktu: string } | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const chancesRef = useRef(3);
  const timerRef = useRef(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const flippedRef = useRef<number[]>([]);
  const matchedRef = useRef<number[]>([]);

  const iconList = [
    'twemoji:sushi', 'twemoji:rice-ball', 'twemoji:oden', 'twemoji:fish-cake-with-swirl',
    'twemoji:shrimp', 'twemoji:curry-rice', 'twemoji:rice-cracker', 'twemoji:dango'
  ];

  const fetchWinner = async () => {
    try {
      const res = await fetch('/api/game/winner');
      const data = await res.json();
      if (data.winner) setTodayWinner(data.winner);
    } catch (err) {
      console.error('Winner fetch error:', err);
    }
  };

  const savePlayer = (data: typeof formData) => {
    try { sessionStorage.setItem(PLAYER_KEY, JSON.stringify(data)); } catch {}
  };

  const getSavedPlayer = () => {
    try {
      const raw = sessionStorage.getItem(PLAYER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const clearPlayer = () => {
    try { sessionStorage.removeItem(PLAYER_KEY); } catch {}
  };

  useEffect(() => {
    const saved = getSavedPlayer();
    if (saved?.whatsapp) setFormData(saved);
    checkStatusBackground(saved?.whatsapp);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const checkStatusBackground = async (wa?: string) => {
    try {
      const url = wa ? `/api/game/status?wa=${wa}` : '/api/game/status';
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'closed') setGameState('CLOSED');
      else if (data.status === 'winner_exists') {
        setGameState('WINNER_EXISTS');
        setTodayWinner({ nama: data.winner, waktu: data.waktu || '' });
      }
      else if (data.status === 'already_played') setGameState('ALREADY_PLAYED');

      fetchWinner();
    } catch (err) {
      console.error('Status check error:', err);
    }
  };

  const shuffleSymbols = useCallback(() => {
    const doubled = [...iconList, ...iconList];
    return doubled.sort(() => 0.5 - Math.random());
  }, []);

  const resetGame = useCallback(() => {
    flippedRef.current = [];
    matchedRef.current = [];
    setFlipped([]);
    setMatched([]);
    timerRef.current = 30;
    setTimer(30);

    const newSymbols = shuffleSymbols();
    setSymbols(newSymbols);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      timerRef.current--;
      setTimer(timerRef.current);

      if (timerRef.current <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        chancesRef.current--;
        setChances(chancesRef.current);

        if (chancesRef.current > 0) {
          setResult(`⏰ Waktu habis! Sisa nyawa: ${chancesRef.current}`);
          setTimeout(() => resetGame(), 1500);
        } else {
          setResult('💀 Game Over! Coba lagi besok.');
          clearPlayer();
          setGameState('LOST');
        }
      }
    }, 1000);
  }, [shuffleSymbols]);

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.whatsapp) return;

    try {
      setGameState('LOADING');
      const res = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        savePlayer(formData);
        setGameState('PLAYING');
        setStartTime(Date.now());
        resetGame();
      } else {
        setResult(data.message);
        setGameState('ALREADY_PLAYED');
      }
    } catch (err) {
      console.error('Start game error:', err);
      setResult('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const flipCard = useCallback(async (index: number) => {
    if (flippedRef.current.length >= 2 || flippedRef.current.includes(index) || matchedRef.current.includes(index) || gameState !== 'PLAYING') return;

    const newFlipped = [...flippedRef.current, index];
    flippedRef.current = newFlipped;
    setFlipped([...newFlipped]);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const firstSymbol = symbols[firstIdx];
      const secondSymbol = symbols[secondIdx];

      if (firstSymbol === secondSymbol) {
        const newMatched = [...matchedRef.current, firstIdx, secondIdx];
        matchedRef.current = newMatched;
        setMatched([...newMatched]);
        flippedRef.current = [];
        setFlipped([]);

        if (newMatched.length === symbols.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          const duration = (Date.now() - (startTime || 0)) / 1000;
          
          // Submit win to server
          try {
            const res = await fetch('/api/game/finish', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...formData, duration }),
            });
            const data = await res.json();
            
            if (data.success) {
              setVoucherCode(data.voucher);
              setGameState('WON');
              clearPlayer();
              setResult('🎉 Selamat! Kamu Menang!');
            } else {
              setResult(data.message);
              setGameState('LOST');
            }
          } catch (err) {
            console.error('Finish game error:', err);
          }
        }
      } else {
        setTimeout(() => {
          flippedRef.current = [];
          setFlipped([]);
        }, 800);
      }
    }
  }, [symbols, gameState, formData, startTime]);

  const shareWhatsApp = () => {
    const pesan = `Saya menang di Memory Game Svarga Dimsum! Kode voucher: ${voucherCode}`;
    window.open(`https://wa.me/6285213963005?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'LOADING':
        return (
          <div className="game-message">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Memuat data permainan...</p>
          </div>
        );

      case 'CLOSED':
        return (
          <div className="game-message">
            <i className="fas fa-clock"></i>
            <h3>Game Ditutup</h3>
            <p>Mainkan Memory Game setiap hari pukul 13:00 - 17:00 WIB.</p>
          </div>
        );

      case 'WINNER_EXISTS':
        return (
          <div className="game-message">
            <i className="fas fa-trophy"></i>
            <h3>Sudah Ada Pemenang</h3>
            <p>Pemenang hari ini: <strong>{todayWinner?.nama}</strong></p>
            <p>Kesempatan kamu kembali terbuka besok jam 13:00 WIB!</p>
          </div>
        );

      case 'ALREADY_PLAYED':
        return (
          <div className="game-message">
            <i className="fas fa-user-check"></i>
            <h3>Sudah Bermain</h3>
            <p>Kamu sudah menggunakan kesempatanmu hari ini. Coba lagi besok ya!</p>
          </div>
        );

      case 'REGISTER':
        return (
          <form className="register-form" onSubmit={handleStartGame}>
            <h3>Daftar untuk Bermain</h3>
            <p>Masukkan data diri kamu untuk mulai bermain dan mengklaim voucher.</p>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: Budi Santoso"
                value={formData.nama}
                onChange={e => setFormData({...formData, nama: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>No. WhatsApp</label>
              <input 
                type="tel" 
                required 
                placeholder="Contoh: 08123456789"
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
            <div className="form-group optional-field">
              <label>Kota</label>
              <input 
                type="text" 
                placeholder="Contoh: Depok"
                value={formData.kota}
                onChange={e => setFormData({...formData, kota: e.target.value})}
              />
            </div>
            <div className="form-group optional-field">
              <label>Instagram</label>
              <input 
                type="text" 
                placeholder="@username (opsional)"
                value={formData.instagram}
                onChange={e => setFormData({...formData, instagram: e.target.value})}
              />
            </div>
            <button type="submit" className="start-btn-modern">Mulai Sekarang</button>
          </form>
        );

      case 'PLAYING':
        return (
          <>
            <div className="game-stats">
              <div className="stat-box">
                <h5>Waktu</h5>
                <p>{timer}s</p>
              </div>
              <div className="stat-box">
                <h5>Nyawa</h5>
                <p>{'❤️'.repeat(Math.max(0, chances)) || '💀'}</p>
              </div>
            </div>
            <div className="game-grid-modern">
              {symbols.map((symbol, idx) => (
                <div
                  key={idx}
                  className={`card-modern ${flipped.includes(idx) ? 'open' : ''} ${matched.includes(idx) ? 'matched' : ''}`}
                  onClick={() => flipCard(idx)}
                >
                  {(flipped.includes(idx) || matched.includes(idx)) && (
                     /* @ts-ignore */
                     <iconify-icon icon={symbol}></iconify-icon>
                  )}
                </div>
              ))}
            </div>
            <div className="game-result-text">{result}</div>
          </>
        );

      case 'WON':
        return (
          <div className="win-content">
            <h3>🎊 SELAMAT!</h3>
            <p>Kamu berhasil memenangkan voucher diskon hari ini!</p>
            <div className="voucher-box">
              <p>KODE VOUCHER KAMU:</p>
              <strong>{voucherCode}</strong>
              <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(voucherCode); alert('Kode voucher disalin!'); }}>
                <i className="fas fa-copy"></i> Salin Kode
              </button>
            </div>
            <button className="wa-share-btn" onClick={shareWhatsApp}>
              <i className="fab fa-whatsapp"></i> Klaim via WhatsApp
            </button>
            <p className="voucher-note">Voucher ini hanya berlaku untuk hari ini. Jangan lupa screenshot!</p>
          </div>
        );

      case 'LOST':
        return (
          <div className="game-message">
            <i className="fas fa-times-circle" style={{ color: '#ff4d4d' }}></i>
            <h3>Yah, Belum Berhasil</h3>
            <p>{result || 'Waktu kamu habis atau nyawa telah habis.'}</p>
            <p>Jangan menyerah! Coba lagi besok jam 13:00 WIB.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="memory-game-wrap">
      <style>{`
        .memory-game-wrap {
          background: white;
          padding: 3rem;
          border-radius: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.05);
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .game-message i { font-size: 4rem; color: #FF6B35; margin-bottom: 1.5rem; }
        .game-message h3 { font-size: 2rem; font-weight: 900; color: #2B1717; margin-bottom: 1rem; }
        .game-message p { color: #666; font-size: 1.1rem; line-height: 1.6; }
        
        .register-form { text-align: left; }
        .register-form h3 { font-size: 1.8rem; font-weight: 900; color: #2B1717; margin-bottom: 0.5rem; }
        .register-form p { color: #666; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-weight: 700; color: #2B1717; margin-bottom: 8px; font-size: 0.9rem; }
        .form-group input { 
          width: 100%; padding: 15px 20px; border-radius: 15px; border: 1px solid #eee; 
          background: #fcfcfc; font-size: 1rem; transition: all 0.3s;
        }
        .form-group input:focus { border-color: #FF6B35; outline: none; background: white; box-shadow: 0 0 0 4px rgba(255,107,53,0.1); }
        .optional-field label::after { content: ' (opsional)'; font-weight: 400; color: #999; font-size: 0.8rem; }
        
        .game-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #fafafa;
          border-radius: 20px;
        }
        .stat-box h5 { font-size: 0.8rem; text-transform: uppercase; color: #999; margin-bottom: 5px; }
        .stat-box p { font-size: 1.5rem; font-weight: 900; color: #2B1717; }
        .game-grid-modern {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 2rem;
        }
        .card-modern {
          aspect-ratio: 1/1;
          background: #f0f0f0;
          border-radius: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card-modern.open, .card-modern.matched {
          background: #FF6B35;
          transform: rotateY(180deg);
          box-shadow: 0 8px 20px rgba(255,107,53,0.3);
        }
        .card-modern.matched {
          opacity: 0.6;
          cursor: default;
        }
        .game-result-text {
          font-size: 1.1rem;
          font-weight: 800;
          color: #FF6B35;
          min-height: 1.5rem;
        }
        .start-btn-modern {
          width: 100%;
          background: #2B1717;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .start-btn-modern:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        .win-content h3 { font-size: 2.5rem; font-weight: 900; color: #2B1717; margin-bottom: 1rem; }
        .voucher-box {
          background: #FFF5F1;
          border: 2px dashed #FF6B35;
          padding: 1.5rem;
          border-radius: 20px;
          margin: 2rem 0;
        }
        .voucher-box p { color: #FF6B35; font-weight: 600; font-size: 0.9rem; margin-bottom: 5px; }
        .voucher-box strong { font-size: 2rem; color: #2B1717; letter-spacing: 2px; display: block; margin-bottom: 1rem; }
        .copy-btn {
          background: transparent;
          border: 2px solid #FF6B35;
          color: #FF6B35;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .copy-btn:hover { background: #FF6B35; color: white; }
        .wa-share-btn {
          width: 100%;
          background: #25D366;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .voucher-note { margin-top: 1.5rem; font-size: 0.85rem; color: #999; }
        
        @media (max-width: 480px) {
          .memory-game-wrap { padding: 2rem 1.5rem; }
          .card-modern { font-size: 1.8rem; }
          .game-message h3 { font-size: 1.5rem; }
          .voucher-box strong { font-size: 1.5rem; }
        }
      `}</style>

      {renderContent()}

      {todayWinner && gameState !== 'PLAYING' && (
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          borderTop: '1px solid #eee',
          textAlign: 'center' 
        }}>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '8px' }}>Pemenang Hari Ini:</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <i className="fas fa-medal" style={{ color: '#FFD700' }}></i>
            <span style={{ fontWeight: 800, color: '#2B1717' }}>{todayWinner.nama}</span>
            <span style={{ color: '#999', fontSize: '0.8rem' }}>• {todayWinner.waktu} WIB</span>
          </div>
        </div>
      )}
    </div>
  );
}
