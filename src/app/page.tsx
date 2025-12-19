'use client';

import LoadingScreen from '@/components/LoadingScreen';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import YouTubeThumbnail from '@/components/YouTubeThumbnail';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // スクロール監視のロジック
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 }); // 10%見えたら発火

    // revealクラスがついた要素をすべて監視
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [products, newsItems]); // データ読み込み後に再実行

  return (
    <>
    <LoadingScreen />
    <main className="relative min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* 背景装飾: ドットグリッド */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="relative z-10 font-sans">
        
        {/* --- 1. HERO CAROUSEL --- */}
        <section className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden bg-gray-200">
          {slides.map((src, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <Image src={src} alt="Hero" fill className="object-cover" priority unoptimized />
            </div>
          ))}
        </section>

        {/* --- 2. NEWS & BIOGRAPHY SECTION --- */}
        <section className="reveal max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* 左カラム: News */}
            <div className="lg:col-span-7">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">News</h2>
                  <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Official Information</p>
                </div>
                <Link href="/news" className="text-[10px] font-black border-b-2 border-black pb-1 hover:text-gray-400 uppercase tracking-widest transition-all">View All</Link>
              </div>
              <div className="border-t border-gray-100">
                {newsItems.map((news) => (
                  <Link href={`/news/${news.id}`} key={news.id} className="group flex flex-col py-10 px-6 transition-all hover:bg-gray-50/80 border-b border-gray-100">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-[9px] font-black border border-black px-2 py-0.5 uppercase tracking-tighter">{news.category}</span>
                      <span className="text-xs font-mono text-gray-400">{news.published_at?.replace(/-/g, '.')}</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold leading-tight tracking-tight text-gray-900">{news.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* 右カラム: Biography (rabbiy_3d.png) */}
            <div className="lg:col-span-5 relative group">
              <Link href="/about" className="block relative w-full aspect-[4/5] lg:aspect-auto lg:h-[600px]">
                <div className="absolute top-0 left-0 text-[10rem] md:text-[14rem] font-black italic leading-none text-gray-100/80 select-none pointer-events-none transition-transform duration-1000 group-hover:-translate-x-8">RB</div>
                <div className="relative w-full h-full z-10">
                  <Image src="/rabbiy_3d.png" alt="Rabbiy Biography" fill className="object-contain transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2" priority />
                </div>
                <div className="absolute bottom-4 right-0 z-20 text-right">
                  <div className="bg-white/10 backdrop-blur-sm p-4 inline-block">
                    <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none text-black">Biography<span className="text-red-600 not-italic">.</span></h3>
                    <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase mt-2">Discover the story</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* --- 3. VIDEO SECTION (Gray Background & Modal) --- */}
        <section className="reveal bg-gray-100 py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-8 group" onClick={() => setIsModalOpen(true)}>
              {latestVideo && (
                <div className="aspect-video w-full bg-black relative shadow-2xl cursor-pointer overflow-hidden border border-white/5">
                  <YouTubeThumbnail videoId={latestVideo.youtube_id} alt={latestVideo.title} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                      <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-4 space-y-8">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-black">Video</h2>
              <div className="pt-8 border-t border-gray-300">
                <h3 className="text-xl font-bold mb-8 text-gray-600 leading-tight">{latestVideo?.title}</h3>
                <Link href="/video" className="inline-block bg-black text-white px-10 py-4 text-[10px] font-black tracking-widest uppercase hover:bg-red-600 transition-all">Watch More</Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. SHOP SECTION (3 Columns) --- */}
        <section className="reveal max-w-6xl mx-auto px-6 py-32">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-black">Goods</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Merchandise</p>
            </div>
            <Link href="/products" className="bg-black text-white px-8 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-red-600 transition-all shadow-lg">View All Shop</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="aspect-square relative overflow-hidden bg-gray-50 mb-6 border border-gray-100 shadow-sm">
                  <Image src={product.image?.[0] || product.image_url} alt={product.name} fill className="object-contain p-10 transition-transform duration-1000 group-hover:scale-110" unoptimized />
                </div>
                <h3 className="text-xs font-black uppercase tracking-tight mb-2 leading-tight group-hover:underline">{product.name}</h3>
                <p className="text-base font-bold tracking-tighter text-gray-900">¥{Number(product.price).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 5. FEATURE (2 Columns) --- */}
        <section className="reveal bg-black py-32 px-6 text-white">
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

      {/* --- YouTube Modal --- */}
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