'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
      scrolled ? 'bg-white/90 backdrop-blur-md py-4' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* --- 左：ロゴ --- */}
        <Link href="/" className="group">
          <h1 className="text-2xl font-black italic tracking-tighter">
            RABBIY<span className="text-red-600">.</span>
          </h1>
        </Link>

        {/* --- 中央：ナビゲーション（Biographyを復元） --- */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/news" className={navLinkStyle('/news')}>News</Link>
          <Link href="/biography" className={navLinkStyle('/biography')}>Biography</Link>
          <Link href="/products" className={navLinkStyle('/products')}>Goods</Link>
          <Link href="/video" className={navLinkStyle('/video')}>Video</Link>
          <Link href="/contact" className={navLinkStyle('/contact')}>Contact</Link>
        </nav>

        {/* --- 右：アクションエリア（LoginとCart） --- */}
        <div className="flex items-center space-x-8">
          {/* LOGIN ボタンを復元 */}
          <Link 
            href="/login" 
            className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors"
          >
            Login_
          </Link>

          {/* カートアイコン：デザインを馴染ませました */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative group py-2"
            aria-label="Open Cart"
          >
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${totalQuantity > 0 ? 'text-red-600' : 'text-zinc-400 group-hover:text-black'}`}>
              Cart_
            </span>
            
            {/* カートバッジ */}
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-3 w-4 h-4 bg-red-600 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse tabular-nums">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* モバイル用ハンバーガー（必要に応じて） */}
          <button className="md:hidden flex flex-col space-y-1">
            <span className="w-5 h-0.5 bg-black"></span>
            <span className="w-5 h-0.5 bg-black"></span>
          </button>
        </div>
      </div>

      {/* 下部の極細ライン */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-100 opacity-50" />
    </header>
  );
}