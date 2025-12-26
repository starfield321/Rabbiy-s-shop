'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminNav() {
  const pathname = usePathname();

  // ブラウザ用クライアントを初期化
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const links = [
    { name: 'PRODUCTS', href: '/admin/products' },
    { name: 'NEWS', href: '/admin/news' },
    { name: 'VIDEO', href: '/admin/video' },
  ];

  // 【重要】ログアウトを実行する関数
  const handleLogout = async () => {
    try {
      // Supabaseのセッションを破棄
      await supabase.auth.signOut();
      // ブラウザを完全にリロードしてトップへ飛ばす（Middlewareを確実に走らせるため）
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      window.location.href = '/';
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b-4 border-black z-[500] px-10 h-20 flex items-center justify-between text-black">
      <div className="flex items-center gap-8">
        {/* ロゴ */}
        <Link href="/admin/products" className="text-xl font-black italic tracking-tighter uppercase">
          SHOP_ADMIN<span className="text-red-600">.</span>
        </Link>
        
        {/* ページリンク */}
        <div className="flex gap-6 border-l-2 border-zinc-100 pl-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                pathname === link.href ? 'text-red-600 underline underline-offset-8' : 'text-zinc-400 hover:text-black'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* 表側に戻るボタン */}
        <Link 
          href="/" 
          className="text-[8px] font-black uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
        >
          Exit_to_Store_
        </Link>
        
        {/* 【重要】ログアウトボタン：ここに記述があります */}
        <button 
          onClick={handleLogout}
          className="text-[8px] font-black uppercase bg-red-600 text-white px-4 py-2 hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          Logout_Session_
        </button>
      </div>
    </nav>
  );
}