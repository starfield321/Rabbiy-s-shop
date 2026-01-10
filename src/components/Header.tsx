'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Lock, Menu, X, Instagram, Twitter, Youtube } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const isTransparent = pathname === '/' && !isScrolled;
  const themeColor = isTransparent ? 'text-white' : 'text-black';
  const logoSrc = isTransparent ? '/logo-white.svg' : '/logo-black.svg';
  const linkBaseStyle = `text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-red-600 cursor-pointer ${themeColor}`;

  const navLinks = [
    { label: 'News', href: '/news' },
    { label: 'Biography', href: '/biography' },
    { label: 'Video', href: '/video' },
    { label: 'Goods', href: '/goods' },
    { label: 'Contact', href: '/contact' },
  ];

  const snsLinks = [
    { id: 'Instagram', icon: <Instagram size={24} />, url: 'https://www.instagram.com/sato321_rabbiy/' },
    { id: 'X', icon: <Twitter size={24} />, url: 'https://twitter.com/@sato321_rabbiy' },
    { id: 'YouTube', icon: <Youtube size={24} />, url: 'https://www.youtube.com/@Rabbiychannel' },
    { 
        id: 'Spotify', 
        icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.491 17.293c-.215.351-.673.461-1.024.246-2.868-1.752-6.478-2.149-10.732-1.176-.401.093-.804-.159-.897-.56-.093-.401.159-.804.56-.897 4.655-1.064 8.636-.612 11.848 1.348.351.214.461.673.245 1.039zm1.465-3.268c-.271.439-.844.582-1.284.311-3.279-2.016-8.281-2.603-12.16-1.424-.492.15-1.018-.129-1.168-.621-.15-.492.129-1.018.621-1.168 4.436-1.348 9.944-.683 13.68 1.613.439.271.583.845.311 1.289zm.131-3.41c-3.935-2.337-10.435-2.552-14.215-1.405-.604.184-1.246-.162-1.43-.766-.184-.604.162-1.246.766-1.43 4.339-1.317 11.514-1.066 16.012 1.604.542.321.721 1.022.4 1.564-.321.542-1.022.721-1.533.432z"/>
        </svg>
        ), 
        url: 'https://open.spotify.com/intl-ja/artist/4mdrFqfLKw0aEvGd8sGJc6' 
    },
    { 
        id: 'Apple Music',
        icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        ),
        url: 'https://music.apple.com/jp/artist/rabbiy/1736432253?l=en-US' },
    { 
        id: 'Mixcloud', 
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 19V5l10 10L22 5v14"/>
            </svg>
        ), 
        url: 'https://www.mixcloud.com/Rabbiy/' 
    },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isTransparent ? 'bg-transparent py-6 md:py-10' : 'bg-white py-4 md:py-6 shadow-sm border-b border-zinc-100'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between relative">
        
        {/* LEFT AREA */}
        <div className="flex items-center">
          <button className={`lg:hidden p-2 -ml-2 z-[160] ${isMenuOpen ? 'text-black' : themeColor}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="hidden lg:block">
            <img src={logoSrc} alt="Rabbiy." className="h-8 w-auto" />
          </Link>
        </div>

        {/* CENTER AREA */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none w-full">
          <nav className="hidden lg:flex items-center gap-10 pointer-events-auto">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={linkBaseStyle}>{link.label}</Link>
            ))}
          </nav>
          <Link href="/" className="lg:hidden pointer-events-auto">
            <img src={logoSrc} alt="Rabbiy." className="h-7 w-auto" />
          </Link>
        </div>

        {/* RIGHT AREA */}
        <div className="flex items-center gap-4 lg:gap-8">
          {status === "authenticated" ? (
            <div className="flex items-center gap-4 lg:gap-6">
              {session.user?.email === 'starfield.business@gmail.com' && (
                <Link href="/admin/login" className="hidden lg:block text-[9px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 hover:bg-red-600 transition-all">ADMIN_PORTAL</Link>
              )}
              <Link href="/dashboard" className={`${themeColor} hover:text-red-600 transition-colors hidden lg:block`} title="MY PAGE">
                <User size={20} strokeWidth={2.5} />
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' , redirect: true})} className={`${themeColor} hover:text-red-600 transition-all hidden lg:block`} title="LOGOUT">
                <LogOut size={20} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <Link href="/login" className={`${themeColor} hover:text-red-600 transition-colors`} title="LOGIN">
              <Lock size={20} strokeWidth={2.5} />
            </Link>
          )}

          <Link href="/cart" className={`${themeColor} hover:text-red-600 transition-colors relative`}>
            <ShoppingCart size={20} strokeWidth={2.5} />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full italic animate-in zoom-in">{totalQuantity}</span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 bg-white z-[140] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden overflow-y-auto ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`} style={{ top: 0 }}>
        <nav className="flex flex-col min-h-full pt-24 px-8 gap-6">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-5xl font-black italic tracking-tighter uppercase border-b border-zinc-100 pb-4 group text-black">
              {link.label}<span className="text-red-600">.</span>
            </Link>
          ))}
          
          <div className="mt-auto pb-12 space-y-10">
            {/* SNS Links in Hamburger */}
            <div className="flex items-center gap-6 pt-6 border-t border-zinc-100">
            {snsLinks.map((sns) => (
              <a key={sns.id} href={sns.url} target="_blank" rel="noopener noreferrer" className="text-black">
                {sns.icon}
              </a>
            ))}
            </div>

            <div className="space-y-6">
            {status === "authenticated" ? (
            <>
              {/* 1. MY ACCOUNT ボタン */}
              <Link 
                href="/dashboard" 
                onClick={() => setIsMenuOpen(false)} 
                className="w-full h-16 bg-black text-white px-8 flex items-center justify-between font-black italic text-xs tracking-[0.2em] group hover:bg-red-600 transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                <span>My Account</span>
                <User size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
              </Link>

              {/* 2. SIGN OUT ボタン（少し控えめな枠線デザイン） */}
              <button 
                onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: '/' }); }} 
                className="w-full h-14 border-2 border-zinc-200 text-zinc-400 px-8 flex items-center justify-between font-black italic text-[10px] tracking-[0.2em] hover:border-black hover:text-black transition-all"
              >
                <span>Sign Out</span>
                <LogOut size={16} strokeWidth={3} />
              </button>
            </>
            ) : (
              /* 3. MEMBER LOGIN ボタン（非ログイン時） */
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="w-full h-16 bg-black text-white px-8 flex items-center justify-between font-black italic text-xs tracking-[0.2em] group hover:bg-red-600 transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                <span>Member Login</span>
                <Lock size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
              </Link>
            )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}