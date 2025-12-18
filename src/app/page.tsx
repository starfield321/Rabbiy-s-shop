import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // --- データ取得 ---
  // Shopを3カラムにするので、3の倍数（3または6）で取得すると綺麗です
  const { data: products } = await supabase.from('products').select('*').limit(6);
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
      
      {/* 背景装飾: モダンなドットグリッド */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ 
             backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, 
             backgroundSize: '32px 32px' 
           }}>
      </div>

      <div className="relative z-10 font-sans">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="w-full h-[60vh] md:h-[80vh] relative bg-gray-100">
          <Image 
            src="https://via.placeholder.com/1920x1080?text=Rabbiy+Main+Banner" 
            alt="Rabbiy Banner"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </section>

        {/* --- 2. NEWS SECTION --- */}
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">News</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Official Information</p>
            </div>
            <Link href="/news" className="text-[10px] font-black border-b-2 border-black pb-1 hover:text-gray-400 transition-colors tracking-widest uppercase">View All</Link>
          </div>
          
          <div className="border-t border-gray-100">
            {newsItems?.map((news) => (
              <Link href={`/news/${news.id}`} key={news.id} 
                className="group flex flex-col md:flex-row py-10 px-6 transition-all hover:bg-gray-50/80 border-b border-gray-100">
                <div className="md:w-1/4 mb-3 md:mb-0 flex items-center space-x-6">
                  <span className="text-[9px] font-black border border-black px-2 py-0.5 tracking-tighter uppercase">{news.category}</span>
                  <span className="text-xs font-mono text-gray-400">{news.published_at?.replace(/-/g, '.')}</span>
                </div>
                <div className="md:w-3/4">
                  <p className="text-lg md:text-xl font-bold leading-tight tracking-tight text-gray-900 group-hover:text-black">
                    {news.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 3. VIDEO SECTION --- */}
        <section className="bg-black text-white py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              {latestVideo && (
                <div className="aspect-video w-full bg-zinc-900 shadow-2xl relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${latestVideo.youtube_id}`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
            <div className="md:col-span-5 space-y-8">
              <div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-4">Video</h2>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase">Latest Release</p>
              </div>
              <div className="pt-8 border-t border-zinc-800">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-8">
                  {latestVideo?.title || "Latest Music Video"}
                </h3>
                <Link href="/video" className="inline-block bg-white text-black px-10 py-4 text-[10px] font-black tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
                  Watch More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. SHOP SECTION (3カラム化) --- */}
        <section className="max-w-6xl mx-auto px-6 py-32">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">Shop</h2>
            <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] mt-3 uppercase">Merchandise</p>
          </div>
          
          {/* md:grid-cols-3 に変更 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {products?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="aspect-square relative overflow-hidden bg-[#f9f9f9] mb-6 shadow-sm border border-gray-50">
                  <Image
                    src={product.image?.[0] || product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-1000 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <h3 className="text-xs font-black uppercase tracking-tight group-hover:underline leading-tight mb-2">
                  {product.name}
                </h3>
                <p className="text-base font-bold tracking-tighter">¥{Number(product.price).toLocaleString()}</p>
              </Link>
            ))}
          </div>
          <div className="mt-20 text-center">
            <Link href="/products" className="inline-block bg-black text-white px-16 py-5 text-[10px] font-black tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl uppercase">
              Enter Shop
            </Link>
          </div>
        </section>

        {/* --- 5. FEATURE SECTION (2カラム・固定配置) --- */}
        <section className="bg-black py-32 px-6 text-white overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-4">
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">Feature</h2>
              <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Upcoming & Projects</p>
            </div>

            {/* md:grid-cols-2 に変更 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  id: 1, 
                  title: 'Rabbiy First Live "Genesis"', 
                  date: '2026.03.15', 
                  img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
                  url: 'https://instagram.com/' 
                },
                { 
                  id: 2, 
                  title: 'Limited Merch Drop', 
                  date: 'Coming Soon', 
                  img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop',
                  url: 'https://instagram.com/' 
                },
              ].map((event) => (
                <a 
                  key={event.id} 
                  href={event.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative aspect-[16/9] overflow-hidden bg-gray-900 shadow-2xl"
                >
                  <img 
                    src={event.img} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
                    <span className="text-[10px] font-black tracking-widest text-red-600 mb-2">{event.date}</span>
                    <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tighter uppercase italic group-hover:text-red-500 transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}