import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Youtube } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* ヘッダーデザイン：最新のトンマナ */}
        <div className="relative mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Biography<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  Artist Profile
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
          
          {/* 左側：ポラロイド風ポートレート */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 group">
              {/* 写真の質感を出すコンテナ */}
              <div className="relative w-full aspect-[3/4] bg-[#fdfdfd] p-4 pb-16 border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] -rotate-1 group-hover:rotate-0 transition-transform duration-700 ease-out">
                {/* 写真本体 */}
                <div className="relative w-full h-full bg-zinc-100 overflow-hidden border border-zinc-200/50 shadow-inner">
                  <Image 
                    src="/rabbiy.jpg" 
                    alt="Rabbiy"
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 p-2"
                  />
                  {/* 写真の表面反射をシミュレート */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </div>
                
                {/* ポラロイドの下部余白（手書き風テキスト用） */}
                <div className="absolute bottom-4 left-0 w-full text-center">
                  <p className="font-['Geist',_'Geist_Fallback'] text-zinc-300 text-[10px] tracking-[0.5em] italic font-bold">
                    EST. 2024 / Rabbiy
                  </p>
                </div>
              </div>

              {/* 名前と肩書きの演出 */}
              <div className="mt-12 space-y-2">
                <h2 className="text-5xl font-black italic tracking-tighter leading-none">
                  Rabbiy<span className="text-red-600">.</span>
                </h2>
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-red-600" />
                  <p className="text-[10px] font-black tracking-[0.4em] text-zinc-400">
                    DJ / TRACK MAKER
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：コンテンツエリア */}
          <div className="lg:col-span-7 space-y-20">
            <div className="space-y-8 text-sm md:text-base font-medium leading-relaxed tracking-normal text-zinc-700">
              <p>
                千葉県出身。高校時代に邦ロックにのめり込みギターを始める。<br></br>
                その後DTMでボーカロイドを用いた楽曲制作を始め、ロックだけでなくテクノポップやEDMに触れ、特に日本独自に発展した「kawaii future bass」に興味を持ち、サブカル系DJイベントに繰り出すようになる。
              </p>
              <p>
                次第に一人で場を沸かせることができるDJそのものにも興味を持ち始め、自身でもDJを始める。<br></br>
                影響を受けたkawaii future bass、ボーカロイド、J-POPを中心としたDJプレイを行う。
              </p>
              <p>
                2024年4月からは、エレクトロサウンドを中心としたオリジナル楽曲のストリーミング配信・YouTube投稿をスタートし、「DJ×トラックメイカー」のポジションを目指し活動中。
              </p>
            </div>

            <div className="pt-16 border-t-4 border-black space-y-12">
              <div>
                <h3 className="text-[10px] font-black tracking-[0.4em] mb-8 text-zinc-400 italic">Main Genres</h3>
                <div className="grid grid-cols-2 gap-y-4">
                  {['Kawaii Future Bass', 'Vocaloid Music', 'Electro Pop', 'EDM'].map((genre) => (
                    <div key={genre} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rotate-45" />
                      <span className="text-sm font-black italic tracking-tight">{genre}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link 
                  href="https://www.youtube.com/@Rabbiychannel" 
                  target="_blank"
                  className="inline-flex h-16 px-10 border-2 border-black bg-red-600 text-white items-center justify-center gap-4 group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black italic text-sm tracking-[0.2em]"
                >
                  <Youtube size={20} />
                  Subscribe on YouTube
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}