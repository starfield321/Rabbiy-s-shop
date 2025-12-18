'use client'; // カートの状態（動的な数値）を扱うので必須です

import Link from 'next/link';
import { useCart } from '@/context/CartContext'; // カート機能の呼び出し

export const Header = () => {
  const { cart } = useCart();

  // カート内商品の合計数量を計算
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* 1. お知らせバー */}
      <div className="bg-gray-50 py-2 px-4 text-center border-b border-gray-100">
        <p className="text-[10px] sm:text-xs text-red-600 font-bold tracking-wider">
          運送混雑により商品の配送が遅れる場合がございます。ご了承ください。
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* 2. メインヘッダー */}
        <div className="flex items-center justify-between py-4 md:py-6">
          
          {/* 左側：ロゴ（ショップ名） */}
          <h1 className="flex-1 lg:flex-none">
            <Link href="/">
              <span className="font-black text-2xl md:text-3xl italic tracking-tighter hover:opacity-70 transition-opacity">
                Rabbiy
              </span>
            </Link>
          </h1>

          {/* 右側：ナビゲーションとカート */}
          <nav className="flex items-center space-x-5 md:space-x-8 text-[11px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">
            <Link href="/pages/about" className="hidden md:block hover:text-black transition-colors">About</Link>
            <Link href="/account/login" className="hidden md:block hover:text-black transition-colors">Login</Link>
            
            {/* カートボタン */}
            <Link href="/cart" className="flex items-center space-x-2 group">
              <span className="group-hover:text-black transition-colors">Cart</span>
              <span className="bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold transition-transform group-active:scale-125">
                {totalItems}
              </span>
            </Link>
          </nav>
        </div>

        {/* 3. カテゴリーメニュー（PCのみ表示など調整可能） */}
        <nav className="border-t border-gray-50 py-3 overflow-x-auto scrollbar-hide">
          <ul className="flex justify-start md:justify-center items-center min-w-max space-x-6 md:space-x-12 text-[10px] md:text-xs font-black text-gray-400">
            <li><Link href="/collections/pickup" className="hover:text-black transition-colors">特集</Link></li>
            <li><Link href="/collections/artists" className="hover:text-black transition-colors">アーティスト</Link></li>
            <li><Link href="/collections/instruments" className="hover:text-black transition-colors">楽器</Link></li>
            <li><Link href="/collections/culture" className="hover:text-black transition-colors">カルチャー</Link></li>
            <li><Link href="/collections/limited" className="hover:text-black transition-colors">限定品</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};