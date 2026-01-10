'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const othersLink = [
    {src: "/rabbiy.jpg", alt: "Footer Banner", url: "/goods", disabled: true},
    {src: "/rabbiy.jpg", alt: "Footer Banner", url: "/a", disabled: true}
  ];
  return (
    <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 px-6 md:px-10 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* UPPER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <Link href="/" className="block group">
              <div className="relative h-12 w-40 md:h-16 md:w-48 transition-transform group-hover:scale-105 duration-500">
                <Image 
                  src="/logo-white.svg" 
                  alt="Rabbiy Official Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
            
            <p className="text-[10px] font-bold leading-relaxed tracking-[0.2em] text-zinc-500 max-w-xs">
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

            {/* SNSリンクの代わりにバナーを配置 */}
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-widest text-zinc-600">Others</p>
              {othersLink.map((otherLink, idx) => {
              const isDisabled = otherLink.disabled || !otherLink.url;
              return(
              <Link
                key={idx}
                href={isDisabled ? '#' : otherLink.url}
                onClick={(e) => isDisabled && e.preventDefault()}
                target="_blank"
                rel="noopener noreferrer"
                className={`block group relative aspect-[4/1] w-full overflow-hidden border border-zinc-800 transition-colors hover:border-red-600" ${isDisabled ? 'cursor-not-allowed grayscale' : 'hover:border-red-600'}`}
              >
                <Image 
                  src={otherLink.src} // ここに使用したいバナー画像を指定してください
                  alt={otherLink.alt}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-[8px] font-black italic tracking-[0.3em] bg-black/50 px-2 py-1">Coming Soon...</span>
                </div>
              </Link>
              );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        {/* flex-col-reverse により、スマホ時にリンクが上、コピーライトが下になります */}
        <div className="pt-10 border-t border-zinc-900 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold text-zinc-600 tracking-[0.3em]">
            &copy; 2026 Rabbiy Official. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[9px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</Link>
            <Link href="/terms" className="text-[9px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Terms of Service</Link>
            <Link href="/legal" className="text-[9px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Legal of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}