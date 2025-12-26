'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function NewsListPage() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (data) {
        setNewsItems(data);
        const cats = Array.from(new Set(data.map((item: any) => item.category)));
        setCategories(['ALL', ...cats]);
      }
    };
    fetchData();
  }, []);

  const filteredItems = selectedCategory === 'ALL' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <main className="max-w-5xl mx-auto min-h-screen bg-white pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-hidden">
        {/* 共通ドット背景 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        <div className="relative z-10">
            {/* ヘッダー：赤いブロック付き */}
            <div className="relative mb-24 group">
                {/* ベースとなる見出しエリア */}
                <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
                {/* 左側：h1 見出し (前面・背景白で重なりをカット) */}
                <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
                News<span className="text-red-600 animate-pulse">.</span>
                </h1>
                {/* 右側：Official Information (ループなし・静止) */}
                <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
                <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                    Official Information
                </span>
                </div>
            </div>

            {/* 下部の反転ライン */}
            <div className="h-[6px] w-full bg-black mt-4 flex">
                <div className="h-full w-32 bg-red-600"></div>
            </div>
        </div>

        {/* カテゴリーフィルター */}
        <div className="flex flex-wrap gap-4 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 text-[10px] font-black italic tracking-widest border-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${
                selectedCategory === cat 
                ? 'bg-black text-white border-black shadow-none translate-x-1 translate-y-1' 
                : 'bg-white text-black border-black hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ニュースリスト */}
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {filteredItems.map((news) => (
            <Link 
              href={`/news/${news.id}`} 
              key={news.id} 
              className="group flex flex-col py-10 px-6 transition-all hover:bg-gray-50/80"
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-xs font-mono text-gray-400">
                  {news.published_at?.replace(/-/g, '.')}
                </span>
                <span className="text-[9px] font-black border border-black px-2 py-0.5 uppercase tracking-tighter text-black bg-white">
                  {news.category}
                </span>
              </div>
              <div>
                {/* フォントサイズを text-lg md:text-xl に落として調整 */}
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 group-hover:text-red-600 transition-colors">
                  {news.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}