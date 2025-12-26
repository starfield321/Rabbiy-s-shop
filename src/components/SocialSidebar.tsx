'use client';

import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function SocialSidebar() {
  const snsLinks = [
    { id: 'Instagram', icon: <Instagram size={18} />, url: 'https://www.instagram.com/sato321_rabbiy/' },
    { id: 'X', icon: <Twitter size={18} />, url: 'https://twitter.com/@sato321_rabbiy' },
    { id: 'YouTube', icon: <Youtube size={18} />, url: 'https://www.youtube.com/@Rabbiychannel' },
    { 
        id: 'Spotify', 
        icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.491 17.293c-.215.351-.673.461-1.024.246-2.868-1.752-6.478-2.149-10.732-1.176-.401.093-.804-.159-.897-.56-.093-.401.159-.804.56-.897 4.655-1.064 8.636-.612 11.848 1.348.351.214.461.673.245 1.039zm1.465-3.268c-.271.439-.844.582-1.284.311-3.279-2.016-8.281-2.603-12.16-1.424-.492.15-1.018-.129-1.168-.621-.15-.492.129-1.018.621-1.168 4.436-1.348 9.944-.683 13.68 1.613.439.271.583.845.311 1.289zm.131-3.41c-3.935-2.337-10.435-2.552-14.215-1.405-.604.184-1.246-.162-1.43-.766-.184-.604.162-1.246.766-1.43 4.339-1.317 11.514-1.066 16.012 1.604.542.321.721 1.022.4 1.564-.321.542-1.022.721-1.533.432z"/>
        </svg>
        ), 
        url: 'https://open.spotify.com/intl-ja/artist/4mdrFqfLKw0aEvGd8sGJc6' 
    },
    { 
        id: 'Apple Music',
        icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        ),
        url: 'https://music.apple.com/jp/artist/rabbiy/1736432253?l=en-US' },
    { 
        id: 'Mixcloud', 
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 19V5l10 10L22 5v14"/>
            </svg>
        ), 
        url: 'https://www.mixcloud.com/Rabbiy/' 
    },
  ];
  
  return (
    /* hidden md:flex によってスマホでは完全に非表示になります */
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-center">
      
      {/* 透過背景付きのメインバー */}
      <div className="bg-white/40 backdrop-blur-xl border-l border-white/20 py-8 px-4 flex flex-col items-center gap-8 shadow-[0_0_20px_rgba(0,0,0,0.1)] relative">
        
        {/* 上端の赤いアクセントチップ */}
        <div className="absolute top-0 right-0 w-[2px] h-6 bg-red-600" />

        {/* アイコンリスト */}
        <div className="flex flex-col gap-7">
        {snsLinks.map((sns) => (
            <a 
            key={sns.id} 
            href={sns.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-black/80 hover:text-red-600 transition-all duration-300 hover:scale-110 group relative flex items-center justify-center"
            >
            {sns.icon}
            {/* ツールチップのデザインを一括適用 */}
            <span className="absolute right-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[7px] font-black italic px-2 py-1 pointer-events-none whitespace-nowrap tracking-[0.2em] translate-x-2 group-hover:translate-x-0">
                {sns.id}
            </span>
            </a>
        ))}
        </div>

        {/* 下端の黒いアクセントチップ */}
        <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-black" />
      </div>

      {/* バーから上下に伸びる極細のガイドライン */}
      <div className="absolute top-[-80px] right-[21px] w-[0.5px] h-[80px] bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute bottom-[-80px] right-[21px] w-[0.5px] h-[80px] bg-gradient-to-b from-black/30 to-transparent" />
    </div>
  );
}