'use client';

import LoadingScreen from '@/components/LoadingScreen';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import YouTubeThumbnail from '@/components/YouTubeThumbnail';
import { ChevronRight } from 'lucide-react'; 

export default function Home() {
  const [goods, setProducts] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [features, setFeatures] = useState<any[]>([]);

  const slides = [
    { pc: "/banner/20260101_pc.jpg", sp: "/banner/20260101_sp.jpg", alt: "Rabbiy Official Goods", url: "/goods", isBlank: false },
    { pc: "/banner/20250601_pc.webp", sp: "/banner/20250601_sp.webp", alt: "Your too Peer", url: "https://big-up.style/BzECwGfowx", isBlank: true },
    { pc: "/banner/hero_rabbiy_pc.webp", sp: "/banner/hero_rabbiy_sp.webp", alt: "Rabbiy", url: "", isBlank: false }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: p } = await supabase.from('goods').select('*').limit(6);
      const { data: v } = await supabase.from('videos').select('*').order('published_at', { ascending: false }).limit(1).single();
      const { data: n } = await supabase.from('news').select('*').order('published_at', { ascending: false }).limit(3);
      const { data: f } = await supabase.from('features').select('*').order('created_at', { ascending: false });
      setProducts(p || []);
      setLatestVideo(v);
      setNewsItems(n || []);
      setFeatures(f || []);
    };
    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [goods, newsItems]);

  return (
    <>
    <LoadingScreen />
    <main className="relative min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="relative z-10 font-sans">
        
        {/* --- 1. HERO CAROUSEL --- */}
        <section className="w-full relative overflow-hidden bg-black aspect-[4/5] md:aspect-[5/2]">
        {slides.map((slide, idx) => {
          // 1. スライドの中身（画像部分）を定義
          const SlideContent = (
          <div className="relative w-full h-full">
            {/* PC用バナー */}
            <div className="hidden md:block h-full w-full">
              <Image src={slide.pc} alt={slide.alt} fill className="object-cover" priority unoptimized />
            </div>
            {/* スマホ用バナー */}
            <div className="block md:hidden h-full w-full">
              <Image src={slide.sp} alt={slide.alt} fill className="object-cover" priority unoptimized />
            </div>
          </div>
          );

          return (
            <div 
              key={idx} 
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              {/* 2. url がある時だけ Link で囲む。なければそのまま画像を表示 */}
              {slide.url ? (
                <Link 
                  href={slide.url} 
                  target={slide.isBlank ? "_blank" : undefined}
                  rel={slide.isBlank ? "noopener noreferrer" : undefined}
                  className="block w-full h-full"
                >
                  {SlideContent}
                </Link>
              ) : (
                SlideContent
              )}
            </div>
          );
        })}

        {/* 追加：ドットナビゲーション */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide 
                  ? 'bg-white w-6' // アクティブな時は横長にする（アパレルサイトでよくあるお洒落な表現）
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        </section>

        {/* --- 2. NEWS & BIOGRAPHY SECTION --- */}
        <section className="reveal max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">News<span className="text-red-600 not-italic">.</span></h2>
                  <div className="h-[6px] w-24 bg-red-600 mt-4 relative">
                    <div className="absolute right-0 top-0 h-full w-2 bg-black" />
                  </div>
                </div>
                <Link href="/news" className="inline-flex h-12 px-6 border-2 border-black flex items-center justify-center gap-2 group hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none font-black italic text-[11px] tracking-[0.2em] bg-white text-black mt-2">
                  View All
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="border-t border-gray-100">
                {newsItems.map((news) => (
                  <Link 
                    href={`/news/${news.id}`} 
                    key={news.id} 
                    className="group flex flex-col py-10 px-6 transition-all hover:bg-gray-50/80 border-b border-gray-100"
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      {/* 日付：先に配置 */}
                      <span className="text-xs font-mono text-gray-400">
                        {news.published_at?.replace(/-/g, '.')}
                      </span>
                      {/* カテゴリー：デザイン維持 */}
                      <span className="text-[9px] font-black border border-black px-2 py-0.5 uppercase tracking-tighter text-black bg-white">
                        {news.category}
                      </span>
                    </div>
                    {/* タイトル：ホバー時に赤色へ変化 */}
                    <p className="text-lg md:text-xl font-bold leading-tight tracking-tight text-gray-900 group-hover:text-red-600 transition-colors">
                      {news.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Biography セクション（変更なし） */}
            <div className="lg:col-span-5 relative group">
              <Link href="/biography" className="block relative w-full aspect-[4/5] lg:aspect-auto lg:h-[600px]">
                <div className="absolute top-0 left-0 text-[10rem] md:text-[14rem] font-black italic leading-none text-gray-100/80 select-none pointer-events-none transition-transform duration-1000 group-hover:-translate-x-8">RB</div>
                <div className="relative w-full h-full z-10">
                  <Image src="/rabbiy_3d.png" alt="Rabbiy Biography" fill className="object-contain transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2" priority />
                </div>
                <div className="absolute bottom-4 right-0 z-20 text-right">
                  <div className="bg-white/10 md:backdrop-blur-sm p-4 inline-block">
                    <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none text-black">Biography<span className="text-red-600 not-italic">.</span></h3>
                    <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] mt-2">Discover the story</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* --- 3. VIDEO SECTION --- */}
        <section className="reveal bg-gray-100 py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* 動画メインパネル：一覧ページのデザインを継承 */}
            <div className="lg:col-span-8 group relative" onClick={() => setIsModalOpen(true)}>
              {latestVideo && (
                <div className="relative aspect-video w-full bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden border border-white/5 group-hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  
                  {/* サムネイル：ゆっくりズーム */}
                  <div className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100 h-full w-full">
                    <YouTubeThumbnail videoId={latestVideo.youtube_id} alt={latestVideo.title || "Latest Video"} />
                  </div>
                  
                  {/* ぬるっと出てくる黒フェード・オーバーレイ */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
                    {/* 枠線 */}
                    <div className="absolute inset-0 border border-white/0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:inset-6 group-hover:border-white/20" />
                    
                    {/* 中央コンテンツ */}
                    <div className="relative overflow-hidden px-4 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 scale-90 group-hover:scale-100 transition-transform duration-700 delay-100 shadow-2xl">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1" />
                      </div>
                      <span className="inline-block text-white text-[11px] font-bold tracking-[0.1em] group-hover:tracking-[0.5em] translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                        View Project
                      </span>
                      <div className="w-0 group-hover:w-24 h-[1px] bg-red-600 mt-2 transition-all duration-1000 delay-300 ease-out mx-auto" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* テキストエリア：一覧ページのスタイルに合わせる */}
            <div className="lg:col-span-4 space-y-10">
              <div className="overflow-hidden">
                <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none text-black animate-in slide-in-from-bottom duration-700">
                  Video<span className="text-red-600 not-italic">.</span>
                </h2>
                <div className="h-[6px] w-24 bg-red-600 mt-4 relative">
                  <div className="absolute right-0 top-0 h-full w-2 bg-black" />
                </div>
              </div>

              <div className="border-l-2 border-gray-200 pl-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 text-[11px] font-black italic tracking-widest animate-pulse">New Release</span>
                    <span className="text-gray-300 text-[10px] font-mono">{latestVideo?.published_at?.replace(/-/g, '.')}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-gray-900 leading-tight">
                    {latestVideo?.title}
                  </h3>
                </div>

                <Link href="/video" className="inline-flex h-16 px-10 border-2 border-black bg-white text-black flex items-center justify-center gap-4 group hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none font-black italic text-[12px] tracking-[0.2em]">
                  Explore Archives
                  <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* --- 4. SHOP SECTION --- */}
        <section className="reveal relative max-w-7xl mx-auto px-6 py-32 overflow-hidden">
          <div className="absolute top-1/2 -right-[30%] -translate-y-1/2 w-[1300px] h-[1300px] opacity-[0.08] pointer-events-none select-none z-0">
            <Image src="/goods.png" alt="" fill className="object-contain grayscale" unoptimized />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-16">
              <div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-black">Goods<span className="text-red-600 not-italic">.</span></h2>
                <div className="h-[6px] w-24 bg-red-600 mt-4 relative">
                  <div className="absolute right-0 top-0 h-full w-2 bg-black" />
                </div>
              </div>
              {/* 【PC用ボタン】 md:inline-flex でPCのみ表示 */}
              <Link href="/goods" className="hidden md:inline-flex h-14 px-8 border-2 border-black bg-white text-black flex items-center justify-center gap-3 group hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none font-black italic text-[11px] tracking-[0.2em] mt-2">
                View All Goods
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 md:gap-20">
              {goods.map((item) => (
                <Link key={item.id} href={`/goods/${item.id}`} className="group">
                  <div className="aspect-square relative overflow-hidden bg-white mb-8 border-2 border-zinc-100 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] transition-all duration-500 group-hover:shadow-none group-hover:border-black">
                    <Image src={item.image?.[0] || item.image_url} alt={item.name} fill className="object-contain p-8 transition-transform duration-1000 group-hover:scale-110" unoptimized />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black tracking-widest leading-tight group-hover:text-red-600 transition-colors">{item.name}</h3>
                    <p className="text-sm text-red-600 font-black italic">¥{Number(item.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
            {/* 【スマホ用ボタン】 md:hidden でスマホのみ、一覧の下に表示 */}
            <div className="mt-16 md:hidden flex justify-center">
              <Link href="/goods" className="flex h-16 border-2 border-black bg-white text-black items-center justify-center gap-4 group active:bg-black active:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black italic tracking-[0.2em] w-full sm:w-auto sm:px-16 text-sm">
                View All Goods
                <ChevronRight size={20} className="group-active:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- 5. FEATURE SECTION (デザイン微調整版) --- */}
        {features && features.length > 0 && (
          <section className="reveal bg-black py-32 lg:py-40 text-white overflow-hidden border-y border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
                
                {/* 左カラム：見出しとボタンのデザインをよりシャープに */}
                <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit z-20 bg-black pb-6 lg:pb-10 lg:pb-0">
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
                        Feature<span className="text-red-600 not-italic">.</span>
                      </h2>
                      <div className="h-[6px] w-24 bg-red-600 relative">
                        <div className="absolute right-0 top-0 h-full w-2 bg-white" />
                      </div>
                    </div>

                    <div className="hidden lg:block pt-10">
                      <p className="font-bold italic">
                        Select Project to view details
                      </p>
                    </div>

                    {/* スクロールボタン：サイズとホバーアニメーションの強化 */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          const el = document.getElementById('feature-scroll-container');
                          el?.scrollBy({ left: -500, behavior: 'smooth' });
                        }}
                        className="w-10 md:w-16 h-10 md:h-16 border border-zinc-700 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300 group rounded-full"
                        aria-label="Previous"
                      >
                        <ChevronRight size={24} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('feature-scroll-container');
                          el?.scrollBy({ left: 500, behavior: 'smooth' });
                        }}
                        className="w-10 md:w-16 h-10 md:h-16 border border-zinc-700 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all duration-300 group rounded-full"
                        aria-label="Next"
                      >
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 右カラム：画像のインパクトと情報の視認性を向上 */}
                <div className="lg:col-span-8 relative">
                  <div 
                    id="feature-scroll-container"
                    className="flex overflow-x-auto gap-8 no-scrollbar snap-x snap-mandatory scroll-smooth pb-10"
                  >
                    {features.map((feature) => (
                      <a 
                        key={feature.id} 
                        href={feature.link_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex-none w-[85vw] md:w-[540px] aspect-[16/9] overflow-hidden bg-zinc-950 snap-start"
                      >
                        {/* 画像：デフォルトの透明度を少し下げ、奥行き感を演出 */}
                        <Image 
                          src={feature.image_url} 
                          alt={feature.title || "Feature"} 
                          fill 
                          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-40 group-hover:opacity-100 grayscale-[0.5] group-hover:grayscale-0" 
                          unoptimized
                        />
                        
                        {/* テキスト：グラデーションをより深くし、文字を立たせる */}
                        <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent">
                          <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="inline-block text-[10px] font-black tracking-[0.3em] text-red-600 mb-2 italic uppercase">
                              {feature.label}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none group-hover:text-white transition-colors">
                              {feature.title}
                            </h3>
                          </div>
                        </div>

                        {/* ホバー時のアクセント枠：白ではなく赤の細線で洗練させる */}
                        <div className="absolute inset-0 border-0 group-hover:border-[1px] border-red-600/50 transition-all duration-500 pointer-events-none" />
                      </a>
                    ))}
                    <div className="flex-none w-10 md:w-20" />
                  </div>
                </div>

              </div>
            </div>

            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </section>
        )}

        {/* --- 6. CONTACT SECTION --- */}
        <section className="w-full bg-black py-0 px-0 relative overflow-hidden group/contact">
          <Link href="/contact" className="relative w-full h-[300px] md:h-[450px] flex items-center justify-center overflow-hidden border-y border-zinc-900">
            
            {/* デフォルトで表示される巨大シルエット */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20 group-hover/contact:opacity-40 transition-all duration-700">
              <div className="relative w-[120%] h-[120%] group-hover/contact:scale-110 transition-transform duration-[3s]">
                <Image src="/rabbiy_3d.png" alt="" fill className="object-contain filter grayscale invert brightness-50 contrast-150" />
              </div>
            </div>

            {/* ホバー時に現れて流れるシステムテキスト */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none overflow-hidden">
              <div className="opacity-0 group-hover/contact:opacity-10 transition-opacity duration-500">
                <div className="text-[12vh] md:text-[15vh] font-black italic tracking-tighter leading-none animate-marquee-fast text-white flex whitespace-nowrap">
                  {"SYSTEM_FAILURE_0x0001_DATA_CORRUPTED_REBOOT_REQUIRED_".repeat(5)}
                </div>
                <div className="text-[12vh] md:text-[15vh] font-black italic tracking-tighter leading-none animate-marquee-slow text-white flex whitespace-nowrap direction-reverse">
                  {"_ACCESS_KEY_INVALID_01011001_ENCRYPTED_SIGNAL_LOST_".repeat(5)}
                </div>
              </div>
            </div>

            <div className="relative z-30 flex flex-col items-center">
              <div className="relative group-hover/contact:animate-shake">
                <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white mix-blend-difference group-hover/contact:text-red-600 group-hover/contact:mix-blend-normal transition-colors duration-100">
                  CONTACT
                </h2>
              </div>
              {/* セクションホバーで連動して沈み込むボタン */}
              <div className="mt-8 inline-flex h-16 px-10 border-2 border-black bg-white text-black flex items-center justify-center gap-4 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] group-hover/contact:bg-black group-hover/contact:text-white group-hover/contact:border-white group-hover/contact:shadow-none group-hover/contact:translate-x-1 group-hover/contact:translate-y-1 font-black italic text-[13px] tracking-[0.2em]">
                Initialize Direct Link
                <ChevronRight size={18} className="group-hover/contact:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <style jsx global>{`
            @keyframes marquee-fast { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            @keyframes marquee-slow { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
            
            .animate-marquee-fast { animation: marquee-fast 15s linear infinite; animation-play-state: paused; }
            .animate-marquee-slow { animation: marquee-slow 25s linear infinite; animation-play-state: paused; }
            .group\/contact:hover .animate-marquee-fast,
            .group\/contact:hover .animate-marquee-slow { animation-play-state: running; }
            
            @keyframes shake {
              0%, 100% { transform: translate(0,0); }
              10% { transform: translate(-2px, 1px); }
              30% { transform: translate(2px, -1px); }
              50% { transform: translate(-1px, 2px); }
              70% { transform: translate(1px, -2px); }
            }
            .group\/contact:hover .animate-shake { animation: shake 0.2s infinite; }
          `}</style>
        </section>        
      </div>

      {isModalOpen && latestVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-10 right-10 text-white text-4xl hover:text-red-600">×</button>
          <div className="w-full max-w-5xl aspect-video bg-black shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <iframe src={`https://www.youtube.com/embed/${latestVideo.youtube_id}?autoplay=1`} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          </div>
        </div>
      )}
    </main>
    </>
  );
}