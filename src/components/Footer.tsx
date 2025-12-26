'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const mainMenu = [
    { label: 'ニュース', href: '/news' },
    { label: 'バイオグラフィー', href: '/biography' },
    { label: 'ビデオ', href: '/video' },
    { label: 'グッズ', href: '/goods' },
    { label: 'コンタクト', href: '/contact' },
  ];

  const legalMenu = [
    { label: '特定商取引法に基づく表記', href: '/legal' },
    { label: 'プライバシーポリシー', href: '/privacy' },
    { label: '利用規約', href: '/terms' },
  ];

  return (
    <footer className="bg-black text-white pt-32 pb-12 px-6 md:px-10 border-t-4 border-black">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* 1. BRAND AREA: ヘッダーロゴと完全同期 */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="group inline-block">
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none font-['Geist',_'Geist_Fallback']">
                Rabbiy<span className="text-red-600 transition-all duration-500 group-hover:text-white">.</span>
              </h1>
            </Link>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-zinc-500 leading-relaxed tracking-[0.2em] uppercase italic">
                Experimental_Goods_Project_v2.5<br />
                All_Products_Designed_by_System<br />
                Based_in_Japan // Global_Shipping
              </p>
              <div className="flex gap-6 pt-2">
                <span className="text-[9px] font-black text-white/40 hover:text-red-600 transition-colors cursor-pointer tracking-widest uppercase">Instagram</span>
                <span className="text-[9px] font-black text-white/40 hover:text-red-600 transition-colors cursor-pointer tracking-widest uppercase">X_System</span>
              </div>
            </div>
          </div>

          {/* 2. NAVIGATION: 日本語化とミニマルな配置 */}
          <div className="lg:col-span-3 space-y-10">
            <div className="inline-block">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Navigation_</h3>
              <div className="h-1 bg-red-600 mt-1 w-full" />
            </div>
            <ul className="space-y-4">
              {mainMenu.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-xs font-bold hover:text-red-600 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-red-600 transition-all group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-xs font-bold hover:text-red-600 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 h-[1px] bg-red-600 transition-all group-hover:w-4" />
                  マイページ
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. CONTACT & COMPLIANCE: 情報の整理 */}
          <div className="lg:col-span-4 space-y-10">
            <div className="inline-block">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Support_</h3>
              <div className="h-1 bg-red-600 mt-1 w-full" />
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Official_Email</p>
                <p className="text-sm font-bold font-['Geist',_'Geist_Fallback']">starfield.business@gmail.com</p>
              </div>
              <ul className="space-y-3">
                {legalMenu.map((item) => (
                  <li key={item.label}>
                    <Link 
                      href={item.href} 
                      className="text-[10px] font-bold text-zinc-500 hover:text-white transition-all duration-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: 余白とラインで仕上げ */}
        <div className="mt-32 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[8px] font-mono text-zinc-700 tracking-[0.4em] uppercase text-center md:text-left">
            © {currentYear} Rabbiy_Official // Developed_by_System
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest italic">
                Status: System_Online
              </span>
            </div>
            <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest italic hidden md:block">
              Encrypted_Transaction_Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}