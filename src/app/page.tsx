import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // 1. 商品データの取得（既存）
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  // 2. 最新のビデオを1件だけ取得（追加！）
  // published_at が新しい順に並べて、一番上の1つだけを取る
  const { data: latestVideo } = await supabase
    .from('videos')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  // 3. ニュースデータ（ここも後でSupabase化できますが、一旦そのまま）
  const newsList = [
    { id: 1, date: '2025.12.18', title: 'New Single "Your Name" Digital Release!', category: 'RELEASE' },
    { id: 2, date: '2025.12.10', title: 'Winter Tour 2025 開催決定', category: 'LIVE' },
  ];

  return (
    <main className="bg-white text-black">
      {/* --- HERO セクション --- */}
      <section className="relative h-[70vh] w-full bg-black flex items-center justify-center overflow-hidden">
        <div className="z-10 text-center">
          <h2 className="text-white text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
            Rabbiy
          </h2>
          <p className="text-gray-400 tracking-[0.5em] mt-4 uppercase text-[10px] md:text-xs">Official Site & Store</p>
        </div>
      </section>

      {/* --- NEWS セクション --- */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10 border-b-2 border-black pb-2">
          <h2 className="text-3xl font-black italic tracking-tighter">NEWS</h2>
          <Link href="/news" className="text-[10px] font-bold hover:underline tracking-widest">VIEW ALL</Link>
        </div>
        <div className="divide-y divide-gray-200">
          {newsList.map((news) => (
            <Link href={`/news/${news.id}`} key={news.id} className="group flex flex-col md:flex-row py-6 hover:bg-gray-50 transition-colors px-2">
              <div className="flex items-center space-x-4 mb-2 md:mb-0 md:w-1/4">
                <span className="text-[9px] font-black border border-black px-2 py-0.5">{news.category}</span>
                <span className="text-xs text-gray-500 font-mono">{news.date}</span>
              </div>
              <div className="md:w-3/4">
                <p className="text-sm md:text-base font-bold group-hover:underline uppercase tracking-tight">{news.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- VIDEO セクション (ここを自動化！) --- */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-10 border-b-2 border-black pb-2">
            <h2 className="text-3xl font-black italic tracking-tighter">VIDEO</h2>
            <Link href="/video" className="text-[10px] font-bold hover:underline tracking-widest">VIEW ALL</Link>
          </div>
          
          <div className="aspect-video w-full shadow-2xl bg-black">
            {latestVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${latestVideo.youtube_id}`}
                title={latestVideo.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">NO VIDEO AVAILABLE</div>
            )}
          </div>
          
          {latestVideo && (
            <p className="mt-6 text-[10px] font-black tracking-[0.3em] text-center uppercase">
              Latest Video: {latestVideo.title}
            </p>
          )}
        </div>
      </section>

      {/* --- SHOP セクション --- */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10 border-b-2 border-black pb-2 w-fit pr-12">
          <h2 className="text-3xl font-black italic tracking-tighter">SHOP</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products?.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="aspect-square relative overflow-hidden bg-white border border-gray-100 shadow-sm">
                <Image
                  src={product.image?.[0] || product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-700"
                  unoptimized
                />
              </div>
              <div className="mt-4">
                <h3 className="text-[11px] font-black uppercase tracking-tight group-hover:underline leading-tight">{product.name}</h3>
                <p className="text-sm font-bold mt-1 tracking-tighter">¥{Number(product.price).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/products" className="inline-block bg-black text-white px-12 py-4 text-[10px] font-black tracking-[0.2em] hover:bg-gray-800 transition-all">
            VIEW ALL ITEMS
          </Link>
        </div>
      </section>

      {/* --- FEATURE セクション --- */}
      <section className="bg-black py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10 border-b border-gray-800 pb-2">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Feature</h2>
            <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Upcoming & Projects</p>
          </div>

          {/* 横スクロールのスライド形式（スマホはスワイプ、PCはスクロールバー） */}
          <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide">
            {[
              { 
                id: 1, 
                title: 'Rabbiy First Live "Genesis"', 
                date: '2026.03.15', 
                img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop', // 仮画像
                url: 'https://instagram.com/あなたの投稿URL' 
              },
              { 
                id: 2, 
                title: 'Limited Merch Drop', 
                date: 'Coming Soon', 
                img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop', // 仮画像
                url: 'https://instagram.com/あなたの投稿URL' 
              },
            ].map((event) => (
              <a 
                key={event.id} 
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="min-w-[80%] md:min-w-[45%] lg:min-w-[30%] group relative aspect-[16/9] overflow-hidden bg-gray-900"
              >
                {/* 画像 */}
                <img 
                  src={event.img} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                />
                
                {/* テキストオーバーレイ */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[10px] font-bold tracking-widest text-red-500 mb-1">{event.date}</span>
                  <h3 className="text-lg font-black leading-tight uppercase group-hover:underline">
                    {event.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* 以前のコードをここに */}
    </main>
  );
}