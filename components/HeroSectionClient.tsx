'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

declare const gsap: any;

export default function HeroSectionClient({ slides }: { slides: any[] }) {
  const images = slides.map(s => s.image);
  const productNames = slides.map(s => s.product_name);

  const [index, setIndex] = useState(0);
  const [productName, setProductName] = useState(productNames[0] || 'Loading...');
  const [animationFinished, setAnimationFinished] = useState(false);
  const isAnimatingRef = useRef(false);
  const indexRef = useRef(0);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const thumbsRef = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToOrder = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const changeImage = useCallback((idx: number) => {
    if (isAnimatingRef.current || idx === indexRef.current) return;
    isAnimatingRef.current = true;

    const mainImage = mainImageRef.current;
    if (!mainImage) return;

    const newImg = new Image();
    newImg.src = images[idx];

    newImg.onload = () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(mainImage, {
          rotate: 360,
          opacity: 0,
          scale: 0.6,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            mainImage.src = newImg.src;
            setProductName(productNames[idx]);

            thumbsRef.current.forEach(t => t?.classList.remove('active'));
            thumbsRef.current[idx]?.classList.add('active');

            gsap.fromTo(mainImage, {
              rotate: -180,
              opacity: 0,
              scale: 0.6
            }, {
              rotate: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                indexRef.current = idx;
                setIndex(idx);
                isAnimatingRef.current = false;
              }
            });
          }
        });
      } else {
        mainImage.src = newImg.src;
        setProductName(productNames[idx]);
        thumbsRef.current.forEach(t => t?.classList.remove('active'));
        thumbsRef.current[idx]?.classList.add('active');
        indexRef.current = idx;
        setIndex(idx);
        isAnimatingRef.current = false;
      }
    };
  }, [images, productNames]);

  useEffect(() => {
    // Start GSAP entry animations
    const startGSAPAnimation = () => {
      if (typeof gsap === 'undefined') {
        setAnimationFinished(true);
        return;
      }

      gsap.from("nav", { y: -100, opacity: 0, duration: 1, ease: "power2.out" });
      gsap.from(".hero-modern-content h1", { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: "power2.out" });
      gsap.from(".hero-modern-content p", { opacity: 0, y: 30, duration: 1, delay: 0.5, ease: "power2.out" });
      gsap.from("#product-name", { scale: 0.8, opacity: 0, duration: 0.8, delay: 0.7, ease: "back.out(1.7)" });
      gsap.from(".hero-cta-group", { y: 30, opacity: 0, duration: 0.8, delay: 0.9, ease: "power2.out" });
      gsap.from(".hero-trust-indicators", { opacity: 0, y: 20, duration: 0.8, delay: 1.1, ease: "power2.out" });

      const mainImage = mainImageRef.current;
      if (mainImage) {
        gsap.fromTo(mainImage, { opacity: 0, scale: 0.8, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 1.2, ease: "power2.out" });
      }

      thumbsRef.current.forEach((thumb, i) => {
        if (thumb) {
          gsap.fromTo(thumb, { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: 1.5 + i * 0.15, ease: "power2.out" });
        }
      });

      setTimeout(() => setAnimationFinished(true), 2500);
    };

    const checkGsap = setInterval(() => {
      if (typeof gsap !== 'undefined') {
        clearInterval(checkGsap);
        setTimeout(startGSAPAnimation, 1000); 
      }
    }, 100);

    const fallback = setTimeout(() => {
      clearInterval(checkGsap);
      setAnimationFinished(true);
    }, 8000);

    return () => {
      clearInterval(checkGsap);
      clearTimeout(fallback);
    };
  }, []);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animationFinished || isAnimatingRef.current) return;
      const nextIdx = (indexRef.current + 1) % images.length;
      changeImage(nextIdx);
    }, 6000);

    return () => clearInterval(interval);
  }, [animationFinished, changeImage, images.length]);

  // Scroll-based rotation
  useEffect(() => {
    const handleScroll = () => {
      const image = mainImageRef.current;
      if (!image) return;
      const scrollY = window.scrollY;
      const rotateValue = scrollY * 0.15;
      image.style.transform = `rotate(${rotateValue}deg)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-modern" id="home">
      <style>{`
        .hero-modern {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: #FFFDF9;
          padding-top: 60px;
        }
        .hero-modern-container {
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }
        .hero-modern-content {
          flex: 1;
          max-width: 600px;
          padding-right: 2rem;
        }
        .hero-badge-new {
          display: inline-block;
          background: #FFF5F0;
          color: #FF6B35;
          padding: 8px 16px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          letter-spacing: 1px;
        }
        .hero-modern-content h1 {
          font-size: 4.5rem;
          color: #2B1717;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -2px;
          margin-bottom: 1.5rem;
        }
        .hero-modern-content h1 span {
          color: #FF6B35;
        }
        .hero-modern-content p {
          font-size: 1.2rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 500px;
        }
        .btn-modern-hero {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #FF6B35;
          color: white;
          padding: 18px 40px;
          border-radius: 50px;
          font-size: 1.15rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
          white-space: nowrap;
        }
        .btn-modern-hero:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4);
          background: #ff7d4d;
        }
        .btn-secondary-hero {
          background: transparent;
          color: #2B1717;
          border: 2px solid #2B1717;
          box-shadow: none;
        }
        .btn-secondary-hero:hover {
          background: #2B1717;
          color: white;
          box-shadow: 0 10px 20px rgba(43, 23, 23, 0.1);
        }
        .hero-cta-group {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 20;
        }
        .hero-trust-indicators {
          display: flex;
          gap: 25px;
          margin-top: 1rem;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #666;
          font-weight: 600;
        }
        .trust-item i {
          color: #FF6B35;
          font-size: 1rem;
        }
        .hero-modern-visual {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .hero-image-wrapper {
          position: relative;
          width: 500px;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-circle-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0) 70%);
          border-radius: 50%;
          z-index: 1;
        }
        .hero-main-img {
          width: 90%;
          height: 90%;
          object-fit: contain;
          z-index: 2;
          filter: drop-shadow(0 30px 40px rgba(0,0,0,0.2));
        }
        .hero-product-label {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: white;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.2rem;
          color: #2B1717;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          z-index: 3;
        }
        .hero-thumbs-modern {
          display: flex;
          gap: 15px;
          margin-top: 2rem;
          z-index: 3;
        }
        .hero-thumb-item {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        .hero-thumb-item img {
          width: 70%;
          height: 70%;
          object-fit: contain;
          transition: transform 0.3s;
        }
        .hero-thumb-item.active {
          border-color: #FF6B35;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(255,107,53,0.2);
        }
        .hero-thumb-item:hover img {
          transform: scale(1.1);
        }
        @media (max-width: 991px) {
          .hero-modern-container {
            flex-direction: column;
            text-align: center;
            padding-top: 3rem;
            padding-bottom: 4rem;
          }
          .hero-modern-content {
            padding-right: 0;
            margin-bottom: 3rem;
          }
          .hero-modern-content h1 { font-size: clamp(2rem, 8vw, 2.8rem); }
          .hero-modern-content p { font-size: 1rem; margin: 0 auto 1.5rem; }
          .btn-modern-hero {
            padding: 14px 28px;
            font-size: 1rem;
            width: 100%;
            justify-content: center;
          }
          .hero-cta-group {
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 320px;
            margin: 0 auto 1.5rem;
          }
          .hero-image-wrapper {
            width: 280px;
            height: 280px;
          }
          .hero-product-label {
            bottom: 0px;
            right: 0px;
            font-size: 0.9rem;
            padding: 8px 16px;
          }
          .hero-trust-indicators {
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 0.5rem;
          }
          .trust-item {
            font-size: 0.8rem;
          }
        }
        @media (max-width: 480px) {
          .hero-modern {
            padding-top: 80px;
            min-height: auto;
          }
          .hero-modern-content h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .hero-image-wrapper {
            width: 220px;
            height: 220px;
          }
          .hero-thumbs-modern {
            gap: 10px;
            margin-top: 1.5rem;
          }
          .hero-thumb-item {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>

      <div className="hero-modern-container">
        <div className="hero-modern-content">
          <div className="hero-badge-new">🥟 Pilihan Terbaik Anda</div>
          <h1>
            Kelezatan Otentik<br/>
            <span>Svarga Dimsum</span>
          </h1>
          <p>Rasakan pengalaman menyantap dimsum premium dengan bahan pilihan berkualitas. Setiap gigitan adalah cerita kenikmatan yang tak terlupakan.</p>
          
          <div className="hero-cta-group">
            <button className="btn-modern-hero" onClick={scrollToOrder}>
              Pesan Sekarang <i className="fas fa-shopping-bag"></i>
            </button>
            <Link href="/game" className="btn-modern-hero btn-secondary-hero">
              Cek Promo Game <i className="fas fa-gamepad"></i>
            </Link>
          </div>

          <div className="hero-trust-indicators">
            <div className="trust-item">
              <i className="fas fa-star"></i>
              <span>4.9/5 Rating Kepuasan</span>
            </div>
            <div className="trust-item">
              <i className="fas fa-check-circle"></i>
              <span>100% Bahan Alami</span>
            </div>
            <div className="trust-item">
              <i className="fas fa-truck"></i>
              <span>Pengiriman Cepat</span>
            </div>
          </div>
        </div>

        <div className="hero-modern-visual">
          <div className="hero-image-wrapper">
            <div className="hero-circle-bg"></div>
            <img
              ref={mainImageRef}
              src={images[0]}
              alt="Main Dimsum"
              className="hero-main-img"
            />
            <div className="hero-product-label" id="product-name">
              {productName}
            </div>
          </div>
          
          <div className="hero-thumbs-modern">
            {images.map((src, i) => (
              <div 
                key={i} 
                className={`hero-thumb-item ${i === 0 ? 'active' : ''}`}
                ref={el => { thumbsRef.current[i] = el; }}
                onClick={() => changeImage(i)}
              >
                <img src={src} alt={`Dimsum ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
