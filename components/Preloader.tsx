'use client';

import { useEffect, useRef } from 'react';

declare const gsap: any;

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const skippedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.4;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log('Audio playback prevented');
        });
      }
    }

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      
      tl.from(".modern-preloader", {
        opacity: 0,
        duration: 0.5
      })
      .from(".preloader-logo-wrap", {
        scale: 0.5,
        opacity: 0,
        rotate: -20,
        duration: 1.2,
        ease: "back.out(1.7)"
      })
      .from(".preloader-brand", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .from(".loading-bar-wrap", {
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3");

      // Floating animation
      gsap.to(".preloader-logo-wrap", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Glow pulse
      gsap.to(".preloader-glow", {
        opacity: 0.6,
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    const skipPreloader = () => {
      if (skippedRef.current) return;
      skippedRef.current = true;

      const preloader = preloaderRef.current;
      if (!preloader) return;

      if (typeof gsap !== 'undefined') {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            preloader.style.display = 'none';
            document.body.classList.add('loaded');
          }
        });
      } else {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.classList.add('loaded');
        }, 800);
      }

      if (audio && !audio.paused) {
        if (typeof gsap !== 'undefined') {
          gsap.to(audio, {
            volume: 0,
            duration: 1,
            onComplete: () => audio.pause()
          });
        } else {
          audio.pause();
        }
      }
    };

    document.addEventListener('click', skipPreloader, { once: true });

    const timeout = setTimeout(() => {
      if (!skippedRef.current) skipPreloader();
    }, 4500);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', skipPreloader);
    };
  }, []);

  return (
    <div className="modern-preloader" ref={preloaderRef}>
      <style>{`
        .modern-preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, #ffffff 0%, #FFF5F0 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 99999;
        }
        .preloader-logo-wrap {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
        }
        .preloader-glow {
          position: absolute;
          width: 150px;
          height: 150px;
          background: #FF6B35;
          filter: blur(50px);
          border-radius: 50%;
          opacity: 0.3;
          z-index: 1;
        }
        .preloader-logo {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 15px 30px rgba(255,107,53,0.2));
        }
        .preloader-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .preloader-brand {
          font-family: 'Titan One', cursive;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 3px;
          color: #2B1717;
          text-align: center;
          text-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .preloader-brand span {
          color: #FF6B35;
        }
        .loading-bar-wrap {
          width: 250px;
          height: 6px;
          background: rgba(255,107,53,0.1);
          border-radius: 20px;
          margin-top: 2.5rem;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }
        .loading-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #FF6B35, #ff9d7d);
          width: 0%;
          border-radius: 20px;
          animation: fill 4s forwards cubic-bezier(0.645, 0.045, 0.355, 1);
          box-shadow: 0 0 15px rgba(255,107,53,0.5);
        }
        @keyframes fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
      <audio ref={audioRef} id="intro-audio">
        <source src="/sound/3dsound.mp3" type="audio/mpeg" />
      </audio>
      <div className="preloader-logo-wrap">
        <div className="preloader-glow"></div>
        <div className="preloader-logo">
          <img src="/logo-loading.svg" alt="Svarga Loading" />
        </div>
      </div>
      <div className="preloader-brand">
        SVARGA<span>DIMSUM</span>
      </div>
      <div className="loading-bar-wrap">
        <div className="loading-bar-fill"></div>
      </div>
    </div>
  );
}
