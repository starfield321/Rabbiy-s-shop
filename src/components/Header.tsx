'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export const Header = () => {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // カート内商品の合計数量
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* 1. お知らせバー（必要なければ削除OK） */}
      <div className="bg-black py-1.5 px-4 text-center">
        <p className="text-[9px] text-white font-bold tracking-[0.2em] uppercase">
          Rabbiy Official Online Store & Portal
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* 左：ロゴ */}
          <div className="flex-1 lg:flex-none">
            <Link href="/">
              <span className="font-black text-2xl md:text-3xl italic tracking-tighter hover:opacity-70 transition-opacity">
                Rabbiy
              </span>
            </Link>
          </div>

          {/* 中央：メインナビゲーション（PC用） */}
          <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.15em] text-gray-500">
            <Link href="/about" className="hover:text-black transition-colors">About</Link>
            <Link href="/news" className="hover:text-black transition-colors">News</Link>
            <Link href="/video" className="hover:text-black transition-colors">Video</Link>
            <Link href="/products" className="hover:text-black transition-colors">Goods</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
          </nav>

          {/* 右：カート & モバイルメニューボタン */}
          <div className="flex-1 lg:flex-none flex items-center justify-end space-x-4">
            {/* カート */}
            <Link href="/cart" className="flex items-center space-x-2 group">
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline group-hover:text-black transition-colors text-gray-400">Cart</span>
              <div className="relative">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* ハンバーガーメニュー（スマホ用） */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー（展開時） */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-4 text-sm font-black uppercase tracking-widest text-gray-800">
            <Link href="/news" onClick={() => setIsMenuOpen(false)}>News</Link>
            <Link href="/video" onClick={() => setIsMenuOpen(false)}>Video</Link>
            <Link href="/products" onClick={() => setIsMenuOpen(false)}>Goods</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};