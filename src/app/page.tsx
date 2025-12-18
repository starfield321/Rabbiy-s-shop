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
  const { data: features } = await supabase.from('features').select('*').order('id');

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
        
        {/* --- 1. HERO SECTION (Banner Image) --- */}
        <section className="w-full h-[60vh] md:h-[80vh] relative bg-gray-100 flex items-center justify-center">
          <div className="w-full h-full relative">
            <Image 
              src="https://via.placeholder.com/1920x1080?text=Rabbiy+Main+Banner" // ダミー画像
              alt="Rabbiy Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* 画像の上に文字を載せる場合はここに配置可能 */}
        </section>

        {/* --- 2. FEATURE SECTION (復活) --- */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features?.map((feature) => (
              <div key={feature.id} className="relative aspect-video overflow-hidden group">
                <Image
                  src={feature.image_url}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white font-black italic text-2xl tracking-tighter uppercase">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3. NEWS SECTION (Hover Effect) --- */}
        <section className="max-w-6xl mx-auto px-6 py-24">
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
                className="group flex flex-col md:flex-row py-10 px-4 transition-colors hover:bg-gray-50/80 border-b border-gray-100">
                <div className="md:w-1/4 mb-3 md:mb-0 flex items-center space-x-6">
                  <span className="text-[9px] font-black border border-black px-2 py-0.5 tracking-tighter">{news.category}</span>
                  <span className="text-xs font-mono text-gray-400">{news.published_at?.replace(/-/g, '.')}</span>
                </div>
                <div className="md:w-3/4">
                  <p className="text-lg md:text-xl font-bold leading-tight tracking-tight text-gray-900">
                    {news.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- 4. VIDEO SECTION (Left Video / Right Info) --- */}
        <section className="bg-black text-white py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* 左カラム: 動画 */}
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
            
            {/* 右カラム: 情報 */}
            <div className="md:col-span-5 space-y-8">
              <div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-4">Video</h2>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase">Latest Release</p>
              </div>
              
              <div className="pt-8 border-t border-zinc-800">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-6">
                  {latestVideo?.title || "Latest Music Video"}
                </h3>
                <Link href="/video" className="inline-block bg-white text-black px-8 py-4 text-[10px] font-black tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
                  Watch More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. SHOP SECTION --- */}
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
            <Link href="/products" className="inline-block bg-black text-white px-16 py-5 text-[10px] font-black tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl">
              ENTER SHOP
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}