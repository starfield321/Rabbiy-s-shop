import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // --- データ取得 ---
  const { data: products } = await supabase.from('products').select('*').limit(4);
  const { data: latestVideo } = await supabase
    .from('videos')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();
  const { data: newsItems } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <main className="relative min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* 1. 背景装飾: モダンなドットグリッド */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ 
             backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, 
             backgroundSize: '32px 32px' 
           }}>
      </div>

      <div className="relative z-10 font-sans">
        
        {/* --- HERO SECTION --- */}
        <section className="h-[90vh] flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 select-none">
            Rabbiy<span className="text-red-600 not-italic">.</span>
          </h1>
          <div className="space-y-2">
            <p className="text-xs md:text-sm font-bold tracking-[0.4em] text-gray-400 uppercase">
              DJ / Track Maker from Chiba
            </p>
            <p className="text-[10px] font-mono text-gray-300">EST. 2024</p>
          </div>
        </section>

        {/* --- NEWS SECTION --- */}
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-gray-100">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">News</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Official Information</p>
            </div>
            <Link href="/news" className="text-[10px] font-black border-b-2 border-black pb-1 hover:text-gray-400 transition-colors tracking-widest">VIEW ALL</Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {newsItems?.map((news) => (
              <Link href={`/news/${news.id}`} key={news.id} className="group flex flex-col md:flex-row py-10 first:pt-0">
                <div className="md:w-1/4 mb-3 md:mb-0 flex items-center space-x-6">
                  <span className="text-[9px] font-black border border-black px-2 py-0.5 tracking-tighter">{news.category}</span>
                  <span className="text-xs font-mono text-gray-400">{news.published_at?.replace(/-/g, '.')}</span>
                </div>
                <div className="md:w-3/4">
                  <p className="text-lg md:text-xl font-bold group-hover:underline leading-tight tracking-tight text-gray-900">
                    {news.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- VIDEO SECTION --- */}
        <section className="bg-gray-50 py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-right">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">Video</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Latest Release</p>
            </div>
            
            {latestVideo && (
              <div className="aspect-video w-full bg-black shadow-2xl relative overflow-hidden group">
                <iframe
                  src={`https://www.youtube.com/embed/${latestVideo.youtube_id}?autoplay=0&mute=1&loop=1`}
                  className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="mt-12 text-center">
              <Link href="/video" className="text-[10px] font-black tracking-widest border-b-2 border-black pb-1 uppercase">Watch More</Link>
            </div>
          </div>
        </section>

        {/* --- SHOP SECTION --- */}
        <section className="max-w-6xl mx-auto px-6 py-32">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">Shop</h2>
            <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Merchandise</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {products?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="aspect-square relative overflow-hidden bg-[#f9f9f9] mb-6 shadow-sm border border-gray-50">
                  <Image
                    src={product.image?.[0] || product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-1000 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-tight group-hover:underline leading-tight mb-1">
                  {product.name}
                </h3>
                <p className="text-sm font-bold tracking-tighter">¥{Number(product.price).toLocaleString()}</p>
              </Link>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link href="/products" className="inline-block bg-black text-white px-16 py-5 text-[10px] font-black tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl active:scale-95">
              ENTER SHOP
            </Link>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-20 border-t border-gray-100 text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] text-gray-300 uppercase">
            &copy; 2025 Rabbiy All Rights Reserved.
          </p>
        </footer>

      </div>
    </main>
  );
}