// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* 1. お知らせバー (ベンチマークの赤いテキスト部分を再現) */}
      <div className="bg-gray-50 py-2 px-4 text-center border-b border-gray-100">
        <p className="text-[10px] sm:text-xs text-red-600 font-bold">
          運送混雑により商品の配送が遅れる場合がございます。ご了承ください。
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* 2. メインヘッダー (ロゴとユーティリティ) */}
        <div className="flex items-center justify-between py-4">
          {/* スマホ用メニュー (簡易版) */}
          <div className="lg:hidden">
            <button className="p-2 text-gray-600">
              <span className="text-xs">MENU</span>
            </button>
          </div>

          {/* ロゴ */}
          <h1 className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/">
              <div className="relative w-32 h-12 mx-auto lg:mx-0">
                <span className="font-bold text-2xl italic tracking-tighter">T-OD CLONE</span>
                {/* 実際のロゴ画像がある場合は Image タグに差し替えてください */}
              </div>
            </Link>
          </h1>

          {/* 右側ユーティリティリンク (PC表示) */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs text-gray-600">
            <Link href="/pages/about" className="hover:text-black">T-ODとは</Link>
            <Link href="/account/login" className="hover:text-black">ログイン</Link>
            <Link href="/cart" className="flex items-center space-x-1 hover:text-black font-bold">
              <span>カート</span>
              <span className="bg-black text-white rounded-full px-2 py-0.5">0</span>
            </Link>
          </nav>

          {/* スマホ用カートアイコン */}
          <div className="lg:hidden">
            <Link href="/cart" className="p-2">
              <span className="text-xs font-bold">🛒</span>
            </Link>
          </div>
        </div>

        {/* 3. カテゴリーナビゲーション (アイコン付きメニューをシンプルに再現) */}
        <nav className="border-t border-gray-100 py-3 overflow-x-auto">
          <ul className="flex justify-between items-center min-w-max space-x-8 text-sm font-medium">
            <li><Link href="/collections/pickup" className="hover:text-red-600 text-center block">特集</Link></li>
            <li><Link href="/collections/artists" className="hover:text-red-600 text-center block">アーティスト</Link></li>
            <li><Link href="/collections/instruments" className="hover:text-red-600 text-center block">楽器</Link></li>
            <li><Link href="/collections/culture" className="hover:text-red-600 text-center block">カルチャー</Link></li>
            <li><Link href="/collections/limited" className="hover:text-red-600 text-center block">限定品</Link></li>
            <li><Link href="/pages/guide" className="hover:text-red-600 text-center block">ガイド</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};