'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    // 背景を black、テキストを white に変更
    <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 px-6 md:px-10 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* UPPER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {/* ロゴ部分: 白ベースのロゴ画像、または反転させた画像を使用 */}
            <Link href="/" className="block group">
              <div className="relative h-12 w-40 md:h-16 md:w-48 transition-transform group-hover:scale-105 duration-500">
                <Image 
                  src="/logo-white.svg" // 黒背景用に白抜きロゴがある場合はこちらを指定
                  alt="Rabbiy Official Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
            
            {/* テキストカラーを zinc-500 に調整して視認性を確保 */}
            <p className="text-[10px] font-bold leading-relaxed tracking-[0.2em] text-zinc-500 max-w-xs uppercase">
                Exploring the intersection of digital craft and physical goods. 
                All pieces are limited and produced with precision.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-widest text-zinc-600">Navigation</p>
              <nav className="flex flex-col gap-2">
                {['News', 'Biography', 'Video', 'Goods', 'Contact'].map((item) => (
                  <Link 
                    key={item} 
                    href={`/${item.toLowerCase()}`} 
                    className="text-xs font-black italic hover:text-red-600 transition-colors uppercase tracking-tighter"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-widest text-zinc-600">Socials</p>
              <div className="flex flex-col gap-2">
                {[
                    { label: 'Instagram', href: 'https://www.instagram.com/sato321_rabbiy/' }, 
                    { label: 'X (Twitter)', href: 'https://x.com/@sato321_rabbiy' }, 
                    { label: 'YouTube', href: 'https://www.youtube.com/@Rabbiychannel' }
                ].map((social) => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-black italic hover:text-red-600 transition-colors tracking-tighter"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold text-zinc-600 tracking-[0.3em]">
            &copy; 2026 Rabbiy Official. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[9px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</Link>
            <Link href="/terms" className="text-[9px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Terms of Service</Link>
            <Link href="/legal" className="text-[9px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Regal of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}