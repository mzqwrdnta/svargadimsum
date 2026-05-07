'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function MemoryGame() {
  const [chances, setChances] = useState(3);
  const [timer, setTimer] = useState(30);
  const [result, setResult] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const chancesRef = useRef(3);
  const timerRef = useRef(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const flippedRef = useRef<number[]>([]);
  const matchedRef = useRef<number[]>([]);

  const iconList = [
    'twemoji:sushi', 'twemoji:rice-ball', 'twemoji:oden', 'twemoji:fish-cake-with-swirl',
    'twemoji:shrimp', 'twemoji:curry-rice', 'twemoji:rice-cracker', 'twemoji:dango'
  ];

  const shuffleSymbols = useCallback(() => {
    const doubled = [...iconList, ...iconList];
    return doubled.sort(() => 0.5 - Math.random());
  }, []);

  const endGame = () => {
    setGameOver(true);
  };

  const showWinPopup = () => {
    let kode = localStorage.getItem('voucherCode');
    if (!kode) {
      kode = 'SVRGA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('voucherCode', kode);
      localStorage.setItem('voucherDate', new Date().toLocaleDateString());
    }
    setVoucherCode(kode);
    setShowPopup(true);
  };

  const resetGame = useCallback(() => {
    flippedRef.current = [];
    matchedRef.current = [];
    setFlipped([]);
    setMatched([]);
    setGameOver(false);
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
          const nextTime = new Date().getTime() + 24 * 60 * 60 * 1000;
          localStorage.setItem('playedUntil', String(nextTime));
          localStorage.setItem('lastStatus', 'lose');
          endGame();
        }
      }
    }, 1000);
  }, [shuffleSymbols]);

  const flipCard = useCallback((index: number, symbol: string) => {
    if (flippedRef.current.length >= 2 || flippedRef.current.includes(index) || matchedRef.current.includes(index) || gameOver) return;

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
          const nextTime = new Date().getTime() + 24 * 60 * 60 * 1000;
          localStorage.setItem('playedUntil', String(nextTime));
          localStorage.setItem('lastStatus', 'win');
          setResult('🎉 Selamat! Kamu Menang!');
          showWinPopup();

          const score = 30 - timerRef.current;
          const best = parseInt(localStorage.getItem('highScore') || '99');
          if (score < best) {
            localStorage.setItem('highScore', String(score));
            setHighScore(score);
          }
        }
      } else {
        setTimeout(() => {
          flippedRef.current = [];
          setFlipped([]);
        }, 800);
      }
    }
  }, [symbols, gameOver]);

  const startGame = useCallback(() => {
    const playedUntil = localStorage.getItem('playedUntil');
    const lastStatus = localStorage.getItem('lastStatus');
    const now = new Date().getTime();

    if (playedUntil && now < parseInt(playedUntil)) {
      if (lastStatus === 'win') {
        setResult("✅ Sudah menang hari ini. Main lagi besok!");
      } else {
        setResult("⛔ Kesempatan habis. Coba lagi besok.");
      }
      return;
    }

    localStorage.removeItem('lastStatus');
    localStorage.removeItem('playedUntil');
    resetGame();
  }, [resetGame]);

  const handlePlay = () => {
    setShowPlayButton(false);
    setGameStarted(true);
    chancesRef.current = 3;
    setChances(3);
    startGame();
  };

  useEffect(() => {
    const playedUntil = localStorage.getItem('playedUntil');
    const now = new Date().getTime();
    if (playedUntil && now < parseInt(playedUntil)) {
      setShowPlayButton(false);
      setGameStarted(true);
      startGame();
    }
    const high = parseInt(localStorage.getItem('highScore') || '0');
    setHighScore(high);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startGame]);

  const shareWhatsApp = () => {
    const kode = localStorage.getItem('voucherCode') || 'Voucher belum tersedia';
    const pesan = `Saya menang di Memory Game Svarga Dimsum! Kode voucher: ${kode}`;
    window.open(`https://wa.me/6285213963005?text=${encodeURIComponent(pesan)}`, '_blank');
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
        }
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
          gap: 15px;
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
          font-size: 2.5rem;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
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
          font-size: 1.2rem;
          font-weight: 800;
          color: #FF6B35;
          margin: 1.5rem 0;
          min-height: 1.8rem;
        }
        .start-btn-modern {
          background: #2B1717;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .start-btn-modern:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        .win-popup-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        .win-popup-content {
          background: white;
          padding: 3rem;
          border-radius: 40px;
          text-align: center;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        }
        .win-popup-content h3 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; color: #2B1717; }
        .voucher-box {
          background: #FFF5F1;
          border: 2px dashed #FF6B35;
          padding: 1.5rem;
          border-radius: 20px;
          margin: 2rem 0;
        }
        .voucher-box p { color: #FF6B35; font-weight: 600; font-size: 0.9rem; margin-bottom: 5px; }
        .voucher-box strong { font-size: 1.8rem; color: #2B1717; letter-spacing: 2px; }
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
        @media (max-width: 480px) {
          .memory-game-wrap { padding: 1.5rem; }
          .card-modern { font-size: 1.8rem; }
        }
      `}</style>

      <div className="game-stats">
        <div className="stat-box">
          <h5>Waktu</h5>
          <p>{timer}s</p>
        </div>
        <div className="stat-box">
          <h5>Nyawa</h5>
          <p>{'❤️'.repeat(Math.max(0, chances)) || '💀'}</p>
        </div>
        <div className="stat-box">
          <h5>High Score</h5>
          <p>{highScore}</p>
        </div>
      </div>

      <div className="game-grid-modern">
        {(gameStarted ? symbols : Array(16).fill('')).map((symbol, idx) => (
          <div
            key={idx}
            className={`card-modern ${flipped.includes(idx) ? 'open' : ''} ${matched.includes(idx) ? 'matched' : ''}`}
            onClick={() => flipCard(idx, symbol)}
          >
            {(flipped.includes(idx) || matched.includes(idx)) && (
               /* @ts-ignore */
               <iconify-icon icon={symbol}></iconify-icon>
            )}
          </div>
        ))}
      </div>

      {showPlayButton && (
        <button className="start-btn-modern" onClick={handlePlay}>Mulai Sekarang</button>
      )}

      <div className="game-result-text">{result}</div>

      {showPopup && (
        <div className="win-popup-overlay">
          <div className="win-popup-content">
            <h3>🎊 WINNER!</h3>
            <p>Kamu berhasil menyelesaikan tantangan tepat waktu!</p>
            <div className="voucher-box">
              <p>GUNAKAN KODE VOUCHER:</p>
              <strong>{voucherCode}</strong>
            </div>
            <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>Screenshot kode ini atau bagikan ke WhatsApp kami untuk klaim diskon.</p>
            <button className="wa-share-btn" onClick={shareWhatsApp}>
              <i className="fab fa-whatsapp"></i> Klaim via WhatsApp
            </button>
            <button 
              onClick={() => setShowPopup(false)}
              style={{ background: 'none', border: 'none', marginTop: '1.5rem', color: '#999', cursor: 'pointer', fontWeight: 600 }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

