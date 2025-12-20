'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext'; // 追加

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { cartItems, setIsCartOpen } = useCart(); // カート情報を取得

  // カートに入っている合計商品数を計算
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // リンクのスタイル（現在のページなら赤色にするなど）
  const navLinkStyle = (path: string) => `
    text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300
    ${pathname === path ? 'text-red-600' : 'text-zinc-400 hover:text-black'}
  `;

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="group">
          <h1 className="text-2xl font-black italic tracking-tighter transition-transform group-hover:skew-x-[-10deg]">
            RABBIY<span className="text-red-600">.</span>
          </h1>
          <p className="text-[7px] font-mono text-zinc-400 tracking-[0.5em] mt-[-4px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            System_v2.0
          </p>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/news" className={navLinkStyle('/news')}>News</Link>
          <Link href="/products" className={navLinkStyle('/products')}>Goods</Link>
          <Link href="/video" className={navLinkStyle('/video')}>Video</Link>
          <Link href="/contact" className={navLinkStyle('/contact')}>Contact</Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center space-x-6">
          {/* CART ICON */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative group p-2 transition-transform active:scale-90"
            aria-label="Open Cart"
          >
            {/* デジタルな印象のカートアイコン (SVG) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:stroke-red-600 transition-colors stroke-black" strokeWidth="2.5" strokeLinecap="square">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" />
              <path d="M3 6H21" />
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" />
            </svg>

            {/* カートバッジ：個数がある時だけ表示 */}
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse tabular-nums">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE (スマホ用) */}
          <button className="md:hidden flex flex-col space-y-1.5 p-2">
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-4 h-0.5 bg-black ml-auto"></span>
          </button>
        </div>
      </div>

      {/* プログレスバー風の装飾線 */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-100">
        <div 
          className="h-full bg-red-600 transition-all duration-300 ease-out"
          style={{ width: `${totalQuantity > 0 ? Math.min(totalQuantity * 10, 100) : 0}%` }}
        />
      </div>
    </header>
  );
}