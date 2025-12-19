'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
// アイコンを使用する場合（Lucideをインストールしている場合）
// import { ShoppingCart, User } from 'lucide-react'; 

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* 左: ロゴ */}
        <Link href="/" className="group">
          <h1 className={`text-2xl font-black italic tracking-tighter transition-colors ${
            isScrolled ? 'text-black' : 'text-white'
          }`}>
            Rabbiy<span className="text-red-600">.</span>
          </h1>
        </Link>

        {/* 中央: ナビゲーション (デスクトップ) */}
        <nav className={`hidden md:flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.2em] ${
          isScrolled ? 'text-gray-900' : 'text-white/80'
        }`}>
          <Link href="/news" className="hover:text-red-600 transition-colors">News</Link>
          <Link href="/about" className="hover:text-red-600 transition-colors">Biography</Link>
          <Link href="/video" className="hover:text-red-600 transition-colors">Video</Link>
          <Link href="/products" className="hover:text-red-600 transition-colors">Goods</Link>
          <Link href="/contact" className="hover:text-red-600 transition-colors">Contact</Link>
        </nav>

        {/* 右: アクション (ログイン & カート) */}
        <div className="flex items-center space-x-6">
          
          {/* ログインボタン */}
          <Link 
            href="/login" 
            className={`text-[10px] font-black uppercase tracking-widest hover:opacity-60 transition-all ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
          >
            Login
          </Link>

          {/* カートアイコン */}
          <Link href="/cart" className="relative group">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`transition-transform group-hover:scale-110 ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {/* カート内件数バッジ (もし必要なら) */}
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full scale-0 group-hover:scale-100 transition-transform">
              0
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
}