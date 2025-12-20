'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkStyle = (path: string) => `
    text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300
    ${pathname === path ? 'text-red-600' : 'text-zinc-400 hover:text-black'}
  `;

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-md py-4' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="group">
          <h1 className="text-2xl font-black italic tracking-tighter transition-transform group-hover:skew-x-[-10deg]">
            RABBIY<span className="text-red-600">.</span>
          </h1>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/news" className={navLinkStyle('/news')}>News</Link>
          <Link href="/biography" className={navLinkStyle('/biography')}>Biography</Link>
          <Link href="/products" className={navLinkStyle('/products')}>Goods</Link>
          <Link href="/video" className={navLinkStyle('/video')}>Video</Link>
          <Link href="/contact" className={navLinkStyle('/contact')}>Contact</Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center space-x-8">
          <Link 
            href="/login" 
            className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors"
          >
            Login_
          </Link>

          {/* カートアイコン（元のシンプルな状態） */}
          <Link href="/cart" className="relative group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="stroke-zinc-400 group-hover:stroke-black transition-colors">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" />
              <path d="M3 6H21" />
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}