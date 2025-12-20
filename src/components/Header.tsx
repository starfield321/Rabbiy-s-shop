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
        <Link href="/">
          <h1 className="text-2xl font-black italic tracking-tighter">
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
            Login
          </Link>

          <Link href="/cart" className="group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-zinc-400 group-hover:stroke-black transition-colors">
              <path d="M6 2L3 6V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}