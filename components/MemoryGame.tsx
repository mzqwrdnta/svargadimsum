'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const PLAYER_KEY = 'svarga_player';

type GameState = 'LOADING' | 'CLOSED' | 'WINNER_EXISTS' | 'ALREADY_PLAYED' | 'REGISTER' | 'PLAYING' | 'WON' | 'LOST';

interface GameConfig {
  difficulty: string;
  timer: number;
  lives: number;
  pairs: number;
  maxWinners: number;
  currentWinners: number;
}

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
  const [todayWinners, setTodayWinners] = useState<{ nama: string; waktu: string; voucher_code: string }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [closedMessage, setClosedMessage] = useState('');
  const [allWinners, setAllWinners] = useState<{ nama: string; waktu: string; voucher_code: string; tanggal: string }[]>([]);

  const chancesRef = useRef(3);
  const timerRef = useRef(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const flippedRef = useRef<number[]>([]);
  const matchedRef = useRef<number[]>([]);

  const iconList = [
    'twemoji:sushi', 'twemoji:rice-ball', 'twemoji:oden', 'twemoji:fish-cake-with-swirl',
    'twemoji:shrimp', 'twemoji:curry-rice', 'twemoji:rice-cracker', 'twemoji:dango'
  ];

  const getDeviceData = () => {
    const ua = navigator.userAgent;
    const browser = ua.includes('Firefox') ? 'Firefox' : ua.includes('Edg') ? 'Edge' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Other';
    const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Linux') ? 'Linux' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' : 'Other';
    const deviceType = /Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';
    return { browser, os, deviceType, userAgent: ua };
  };

  const fetchWinners = async () => {
    try {
      const res = await fetch('/api/game/winner');
      const data = await res.json();
      setTodayWinners(data.winners || []);
    } catch (err) {
      console.error('Winner fetch error:', err);
    }
  };

  const fetchAllWinners = async () => {
    try {
      const res = await fetch('/api/game/winners');
      const data = await res.json();
      setAllWinners(data.winners || []);
    } catch (err) {
      console.error('All winners fetch error:', err);
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
    fetchAllWinners();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const checkStatusBackground = async (wa?: string) => {
    try {
      const url = wa ? `/api/game/status?wa=${wa}` : '/api/game/status';
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'closed') {
        setGameState('CLOSED');
        setClosedMessage(data.message || 'Game sedang tidak aktif.');
      } else if (data.status === 'winner_exists') {
        setGameState('WINNER_EXISTS');
        setTodayWinners([{ nama: data.winner, waktu: data.waktu || '', voucher_code: '' }]);
      } else if (data.status === 'already_played') {
        setGameState('ALREADY_PLAYED');
      } else if (data.status === 'open') {
        setGameConfig({
          difficulty: data.difficulty || 'medium',
          timer: data.timer || 45,
          lives: data.lives || 3,
          pairs: data.pairs || 6,
          maxWinners: data.maxWinners || 1,
          currentWinners: data.currentWinners || 0,
        });
        setGameState('REGISTER');
      }

      fetchWinners();
    } catch (err) {
      console.error('Status check error:', err);
    }
  };

  const getIconCount = useCallback(() => {
    return gameConfig?.pairs || 6;
  }, [gameConfig]);

  const shuffleSymbols = useCallback(() => {
    const count = getIconCount();
    const selectedIcons = iconList.slice(0, count);
    const doubled = [...selectedIcons, ...selectedIcons];
    return doubled.sort(() => 0.5 - Math.random());
  }, [getIconCount]);

  const resetGame = useCallback(() => {
    flippedRef.current = [];
    matchedRef.current = [];
    setFlipped([]);
    setMatched([]);

    const gameTimer = gameConfig?.timer || 45;
    timerRef.current = gameTimer;
    setTimer(gameTimer);

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
  }, [shuffleSymbols, gameConfig]);

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
        setGameConfig({
          difficulty: data.difficulty || 'medium',
          timer: data.timer || 45,
          lives: data.lives || 3,
          pairs: data.pairs || 6,
          maxWinners: gameConfig?.maxWinners || 1,
          currentWinners: gameConfig?.currentWinners || 0,
        });
        setChances(data.lives || 3);
        chancesRef.current = data.lives || 3;
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
          const device = getDeviceData();

          try {
            const res = await fetch('/api/game/finish', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...formData,
                duration,
                ...device,
                ip: 'client',
              }),
            });
            const data = await res.json();

            if (data.success) {
              setVoucherCode(data.voucher);
              setGameState('WON');
              clearPlayer();
              setResult('🎉 Selamat! Kamu Menang!');
              fetchWinners();
              fetchAllWinners();
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

  const getDifficultyLabel = (d: string) => {
    if (d === 'easy') return { label: 'Mudah', color: '#10b981', emoji: '🟢' };
    if (d === 'hard') return { label: 'Sulit', color: '#ef4444', emoji: '🔴' };
    return { label: 'Sedang', color: '#f59e0b', emoji: '🟡' };
  };

  const renderContent = () => {
    switch (gameState) {
      case 'LOADING':
        return (
          <div className="game-message">
            <div className="game-spinner"></div>
            <p>Memuat data permainan...</p>
          </div>
        );

      case 'CLOSED':
        return (
          <div className="game-message">
            <div className="game-icon-circle" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <i className="fas fa-lock" style={{ color: '#ef4444' }}></i>
            </div>
            <h3>Game Ditutup</h3>
            <p>{closedMessage}</p>
          </div>
        );

      case 'WINNER_EXISTS':
        return (
          <div className="game-message">
            <div className="game-icon-circle" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <i className="fas fa-trophy" style={{ color: '#f59e0b' }}></i>
            </div>
            <h3>Sudah Ada Pemenang Hari Ini</h3>
            {todayWinners.map((w, i) => (
              <div key={i} className="winner-badge">
                <i className="fas fa-medal" style={{ color: '#FFD700' }}></i>
                <span>{w.nama}</span>
              </div>
            ))}
            <p>Kesempatanmu kembali terbuka besok!</p>
          </div>
        );

      case 'ALREADY_PLAYED':
        return (
          <div className="game-message">
            <div className="game-icon-circle" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <i className="fas fa-user-check" style={{ color: '#3b82f6' }}></i>
            </div>
            <h3>Sudah Bermain</h3>
            <p>Kamu sudah menggunakan kesempatanmu hari ini.</p>
          </div>
        );

      case 'REGISTER':
        return (
          <form className="register-form" onSubmit={handleStartGame}>
            <h3>Daftar untuk Bermain</h3>
            <p>Masukkan data diri kamu untuk mulai bermain dan mengklaim voucher.</p>
            {gameConfig && (
              <div className="game-info-bar">
                <div className="info-item">
                  <span className="info-label">Level</span>
                  <span className="info-value" style={{ color: getDifficultyLabel(gameConfig.difficulty).color }}>
                    {getDifficultyLabel(gameConfig.difficulty).emoji} {getDifficultyLabel(gameConfig.difficulty).label}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Pemenang</span>
                  <span className="info-value">{gameConfig.currentWinners}/{gameConfig.maxWinners}</span>
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" required placeholder="Contoh: Budi Santoso" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div className="form-group">
              <label>No. WhatsApp</label>
              <input type="tel" required placeholder="Contoh: 08123456789" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            </div>
            <div className="form-group optional-field">
              <label>Kota</label>
              <input type="text" placeholder="Contoh: Depok" value={formData.kota} onChange={e => setFormData({...formData, kota: e.target.value})} />
            </div>
            <div className="form-group optional-field">
              <label>Instagram</label>
              <input type="text" placeholder="@username" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
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
                <p className={timer <= 10 ? 'timer-warning' : ''}>{timer}s</p>
              </div>
              <div className="stat-box">
                <h5>Nyawa</h5>
                <p>{'❤️'.repeat(Math.max(0, chances)) || '💀'}</p>
              </div>
              <div className="stat-box">
                <h5>Level</h5>
                <p style={{ fontSize: '1rem' }}>{getDifficultyLabel(gameConfig?.difficulty || 'medium').emoji}</p>
              </div>
            </div>
            <div className={`game-grid-modern grid-${gameConfig?.pairs || 6}`}>
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
            <div className="confetti-container">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, background: ['#FF6B35', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'][i % 5] }} />
              ))}
            </div>
            <h3>🎊 SELAMAT!</h3>
            <p>Kamu berhasil memenangkan voucher diskon!</p>
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
            <p className="voucher-note">Voucher berlaku hari ini. Screenshot dan kirim ke WhatsApp admin!</p>
          </div>
        );

      case 'LOST':
        return (
          <div className="game-message">
            <div className="game-icon-circle" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>
            </div>
            <h3>Yah, Belum Berhasil</h3>
            <p>{result || 'Waktu kamu habis atau nyawa telah habis.'}</p>
            <p>Jangan menyerah! Coba lagi besok.</p>
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
          position: relative;
          overflow: hidden;
        }
        .game-spinner {
          width: 48px; height: 48px;
          border: 4px solid #f1f5f9;
          border-top-color: #FF6B35;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1.5rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .game-icon-circle {
          width: 80px; height: 80px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .game-icon-circle i { font-size: 2rem; }
        .game-message h3 { font-size: 1.8rem; font-weight: 900; color: #2B1717; margin-bottom: 1rem; }
        .game-message p { color: #666; font-size: 1rem; line-height: 1.6; margin-bottom: 0.5rem; }
        .winner-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #FFF5F1; padding: 8px 16px; border-radius: 20px;
          margin: 8px 4px; font-weight: 700; color: #2B1717; font-size: 0.9rem;
        }
        .register-form { text-align: left; }
        .register-form h3 { font-size: 1.8rem; font-weight: 900; color: #2B1717; margin-bottom: 0.5rem; }
        .register-form > p { color: #666; margin-bottom: 1.5rem; }
        .game-info-bar {
          display: flex; gap: 16px; padding: 12px 16px; background: #f8fafc;
          border-radius: 12px; margin-bottom: 1.5rem;
        }
        .info-item { flex: 1; text-align: center; }
        .info-label { display: block; font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; margin-bottom: 2px; }
        .info-value { font-weight: 800; font-size: 0.95rem; color: #2B1717; }
        .form-group { margin-bottom: 1.2rem; }
        .form-group label { display: block; font-weight: 700; color: #2B1717; margin-bottom: 6px; font-size: 0.85rem; }
        .form-group input {
          width: 100%; padding: 14px 18px; border-radius: 12px; border: 1px solid #eee;
          background: #fcfcfc; font-size: 0.95rem; transition: all 0.3s;
        }
        .form-group input:focus { border-color: #FF6B35; outline: none; background: white; box-shadow: 0 0 0 4px rgba(255,107,53,0.1); }
        .optional-field label::after { content: ' (opsional)'; font-weight: 400; color: #999; font-size: 0.75rem; }
        .game-stats {
          display: flex; justify-content: space-around; margin-bottom: 1.5rem;
          padding: 1rem; background: #fafafa; border-radius: 16px;
        }
        .stat-box h5 { font-size: 0.7rem; text-transform: uppercase; color: #999; margin-bottom: 4px; }
        .stat-box p { font-size: 1.3rem; font-weight: 900; color: #2B1717; }
        .timer-warning { color: #ef4444 !important; animation: pulse 0.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .game-grid-modern { display: grid; gap: 10px; margin-bottom: 1.5rem; }
        .game-grid-modern.grid-4 { grid-template-columns: repeat(4, 1fr); max-width: 340px; margin-left: auto; margin-right: auto; }
        .game-grid-modern.grid-6 { grid-template-columns: repeat(4, 1fr); max-width: 400px; margin-left: auto; margin-right: auto; }
        .game-grid-modern.grid-8 { grid-template-columns: repeat(4, 1fr); max-width: 440px; margin-left: auto; margin-right: auto; }
        .card-modern {
          aspect-ratio: 1/1; background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid transparent;
        }
        .card-modern:hover:not(.open):not(.matched) { border-color: #FF6B35; transform: translateY(-2px); }
        .card-modern.open, .card-modern.matched {
          background: linear-gradient(135deg, #FF6B35, #FF8F5E);
          transform: rotateY(180deg); box-shadow: 0 6px 16px rgba(255,107,53,0.3);
        }
        .card-modern.matched { opacity: 0.5; cursor: default; }
        .game-result-text { font-size: 1rem; font-weight: 800; color: #FF6B35; min-height: 1.5rem; }
        .start-btn-modern {
          width: 100%; background: linear-gradient(135deg, #2B1717, #3D2424); color: white;
          border: none; padding: 16px; border-radius: 50px; font-weight: 800; font-size: 1rem;
          cursor: pointer; transition: all 0.3s; margin-top: 0.5rem;
        }
        .start-btn-modern:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .win-content { position: relative; }
        .win-content h3 { font-size: 2.2rem; font-weight: 900; color: #2B1717; margin-bottom: 0.5rem; }
        .win-content > p { color: #666; margin-bottom: 1rem; }
        .confetti-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .confetti {
          position: absolute; width: 8px; height: 8px; top: -10px; border-radius: 2px;
          animation: confetti-fall 3s ease-in-out forwards;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
        }
        .voucher-box {
          background: #FFF5F1; border: 2px dashed #FF6B35; padding: 1.5rem;
          border-radius: 16px; margin: 1.5rem 0;
        }
        .voucher-box p { color: #FF6B35; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px; }
        .voucher-box strong { font-size: 1.8rem; color: #2B1717; letter-spacing: 2px; display: block; margin-bottom: 1rem; }
        .copy-btn {
          background: transparent; border: 2px solid #FF6B35; color: #FF6B35;
          padding: 8px 20px; border-radius: 50px; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; transition: all 0.3s;
        }
        .copy-btn:hover { background: #FF6B35; color: white; }
        .wa-share-btn {
          width: 100%; background: #25D366; color: white; border: none;
          padding: 16px; border-radius: 50px; font-weight: 800; font-size: 1rem;
          cursor: pointer; transition: all 0.3s;
        }
        .wa-share-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,211,102,0.3); }
        .voucher-note { margin-top: 1rem; font-size: 0.8rem; color: #999; }
        @media (max-width: 480px) {
          .memory-game-wrap { padding: 2rem 1.5rem; border-radius: 24px; }
          .card-modern { font-size: 1.4rem; }
          .game-message h3 { font-size: 1.4rem; }
          .voucher-box strong { font-size: 1.3rem; }
        }
      `}</style>

      {renderContent()}

      {todayWinners.length > 0 && gameState !== 'PLAYING' && gameState !== 'WON' && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '8px' }}>Pemenang Hari Ini:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {todayWinners.map((w, i) => (
              <div key={i} className="winner-badge">
                <i className="fas fa-medal" style={{ color: '#FFD700' }}></i>
                <span>{w.nama}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {allWinners.length > 0 && (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderTop: '1px solid #eee' }}>
          <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>Daftar Pemenang</p>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {allWinners.map((w, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: i % 2 === 0 ? '#fafafa' : 'transparent', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '700', color: '#2B1717' }}>{w.nama}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#999', fontSize: '0.75rem' }}>
                  <span>{w.tanggal}</span>
                  <span style={{ fontFamily: 'monospace', color: '#10b981', fontWeight: '600' }}>{w.voucher_code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
