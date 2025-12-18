'use client'; // カルーセルの動きのために追加

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // カルーセル画像（仮）
  const slides = [
    "https://images.unsplash.com/photo-1514525253361-bee8a187499b?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: p } = await supabase.from('products').select('*').limit(6);
      const { data: v } = await supabase.from('videos').select('*').order('published_at', { ascending: false }).limit(1).single();
      const { data: n } = await supabase.from('news').select('*').order('published_at', { ascending: false }).limit(3);
      setProducts(p || []);
      setLatestVideo(v);
      setNewsItems(n || []);
    };
    fetchData();

    // カルーセル自動再生
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      
      {/* 共通背景: ドットグリッド */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="relative z-10">
        
        {/* --- 1. HERO CAROUSEL (縦幅短め) --- */}
        <section className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden bg-gray-200">
          {slides.map((src, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <Image src={src} alt={`Slide ${idx}`} fill className="object-cover" priority unoptimized />
            </div>
          ))}
          {/* インジケーター */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
            {slides.map((_, idx) => (
              <div key={idx} className={`h-1 transition-all ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            ))}
          </div>
        </section>

        {/* --- 2. NEWS SECTION --- */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-100">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-gray-900">News</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Official Information</p>
            </div>
            <Link href="/news" className="text-[10px] font-black border-b-2 border-black pb-1 hover:text-gray-400 transition-all uppercase">View All</Link>
          </div>
          <div className="border-t border-gray-100">
            {newsItems.map((news) => (
              <Link href={`/news/${news.id}`} key={news.id} className="group flex flex-col md:flex-row py-10 px-6 transition-all hover:bg-gray-50 border-b border-gray-100">
                <div className="md:w-1/4 mb-3 md:mb-0 flex items-center space-x-6">
                  <span className="text-[9px] font-black border border-black px-2 py-0.5 uppercase tracking-tighter">{news.category}</span>
                  <span className="text-xs font-mono text-gray-400">{news.published_at?.replace(/-/g, '.')}</span>
                </div>
                <div className="md:w-3/4">
                  <p className="text-lg md:text-xl font-bold leading-tight tracking-tight text-gray-800 group-hover:text-black">{news.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 3. VIDEO SECTION (左8:右4 / 背景色調整) --- */}
        <section className="relative py-32 px-6 overflow-hidden bg-[#050505]">
          
          {/* 背景レイヤー1: 複数の動的なグラデーション（ぼんやりとした光の溜まり） */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            {/* 左上の青白い光 */}
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
            {/* 右下の微かな赤い光 */}
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[120px]" />
          </div>

          {/* 背景レイヤー2: 走査線（スキャンライン）のような微細なストライプ */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
              style={{ 
                backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)`, 
                backgroundSize: '100% 4px' 
              }} />

          {/* 背景レイヤー3: 極小のグリッドドット */}
          <div className="absolute inset-0 opacity-[0.1] pointer-events-none -z-10" 
              style={{ 
                backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`, 
                backgroundSize: '20px 20px' 
              }} />

          {/* コンテンツ本体 */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center text-white relative z-10">
            <div className="md:col-span-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
              {latestVideo && (
                <div className="aspect-video w-full bg-black relative">
                  <iframe 
                    src={`https://www.youtube.com/embed/${latestVideo.youtube_id}`} 
                    className="absolute inset-0 w-full h-full" 
                    allowFullScreen 
                  />
                </div>
              )}
            </div>
            
            <div className="md:col-span-4 space-y-8">
              <div className="space-y-2">
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-white">Video</h2>
                <p className="text-[10px] text-zinc-500 font-bold tracking-[0.4em] uppercase">Latest Experience</p>
              </div>
              
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold mb-8 text-zinc-300 leading-tight">
                  {latestVideo?.title || "Latest Release"}
                </h3>
                <Link href="/video" 
                      className="group/btn relative inline-block bg-white text-black px-10 py-4 text-[10px] font-black tracking-widest uppercase overflow-hidden transition-all">
                  <span className="relative z-10 group-hover/btn:text-white">Watch More</span>
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* --- 5. FEATURE (2カラム) --- */}
        <section className="bg-black py-32 px-6 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-16 border-b border-zinc-800 pb-4">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">Feature</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">Projects</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 1, title: 'Rabbiy Live "Genesis"', date: '2026.03.15', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop' },
                { id: 2, title: 'Limited Merch Drop', date: 'Coming Soon', img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop' },
              ].map((event) => (
                <div key={event.id} className="group relative aspect-[16/9] overflow-hidden bg-zinc-900 shadow-2xl cursor-pointer">
                  <img src={event.img} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-100" />
                  <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
                    <span className="text-[10px] font-black tracking-widest text-red-600 mb-2">{event.date}</span>
                    <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter group-hover:text-red-500 transition-colors">{event.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}