'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [showNav, setShowNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeNav = () => setShowNav(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Outlet', path: '/outlet' },
    { name: 'Testimoni', path: '/testimoni' },
    { name: 'Kontak', path: '/kontak' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // If it's a separate page link, let Link handle it.
    // If it's an anchor, handle smooth scroll.
    const isAnchor = path.includes('#');
    if (isAnchor && pathname === '/') {
      const targetId = path.split('#')[1];
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
        closeNav();
      }
    } else {
      // For separate pages, we just close the nav and let Next.js navigate
      closeNav();
    }
  };

  return (
    <header className={`original-style-header ${scrolled ? 'scrolled' : ''}`}>
      <style>{`
        .original-style-header {
          background-color: #ffffff;
          color: #2B1717;
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.75rem 2.5rem;
          border-radius: 50px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: calc(100% - 40px);
          max-width: 1100px;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          overflow: visible !important;
        }
        .original-style-header.scrolled {
          top: 10px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .logo-text {
          font-size: 1.6rem;
          font-weight: 900;
          color: #2B1717;
          text-decoration: none;
          letter-spacing: -1px;
        }
        .logo-text span {
          color: #FF6B35;
        }
        .nav-desktop ul {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }
        .nav-desktop ul li a {
          color: #2B1717;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s;
          position: relative;
        }
        .nav-desktop ul li a:hover, .nav-desktop ul li a.active {
          color: #FF6B35;
        }
        .nav-desktop ul li a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          background: #FF6B35;
          transition: width 0.3s;
          border-radius: 10px;
        }
        .nav-desktop ul li a:hover::after, .nav-desktop ul li a.active::after {
          width: 100%;
        }
        .toggle-btn {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
          z-index: 10001;
        }
        .toggle-btn span {
          width: 25px;
          height: 3px;
          background: #2B1717;
          border-radius: 3px;
          transition: 0.3s;
        }
        .toggle-btn.active span:nth-child(1) { transform: rotate(45deg) translate(6px, 6px); }
        .toggle-btn.active span:nth-child(2) { opacity: 0; }
        .toggle-btn.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .nav-mobile {
          display: none;
        }

        @media (max-width: 991px) {
          .nav-desktop { display: none; }
          .toggle-btn { display: flex; }
          .original-style-header { padding: 1rem 2rem; }
          
          .nav-mobile {
            position: fixed;
            top: 100px;
            left: 20px;
            right: 20px;
            background: #ffffff;
            border-radius: 25px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
            padding: 1.5rem;
            visibility: hidden;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            z-index: 20000;
            pointer-events: none;
          }
          .nav-mobile.show {
            visibility: visible;
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
          .nav-mobile ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .nav-mobile ul li a {
            display: block;
            padding: 1rem 1.5rem;
            color: #2B1717;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.1rem;
            border-radius: 15px;
            transition: all 0.3s;
          }
          .nav-mobile ul li a:hover, .nav-mobile ul li a.active {
            background: #FFF5F1;
            color: #FF6B35;
          }
        }
      `}</style>

      <Link href="/" className="logo-text" onClick={closeNav}>
        SVARGA<span>DIMSUM</span>
      </Link>

      <div className={`toggle-btn ${showNav ? 'active' : ''}`} onClick={() => setShowNav(!showNav)}>
        <span></span><span></span><span></span>
      </div>

      <nav className="nav-desktop">
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={pathname === link.path ? 'active' : ''}
                onClick={(e) => handleScroll(e, link.path)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={`nav-mobile ${showNav ? 'show' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={pathname === link.path ? 'active' : ''}
                onClick={(e) => handleScroll(e, link.path)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
