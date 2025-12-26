import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // ← これを忘れずに追加！
import Breadcrumbs from '@/components/Breadcrumbs';


export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Promiseを解決（await）してから id を取り出す
  const { id } = await params;

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (!news) notFound();

  // return の後にすぐ ( を書いて、中身を開始します
  return (
    <main className="max-w-5xl mx-auto min-h-screen bg-white pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-hidden">
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
    </div>

      <div className="mb-12 border-b border-gray-100 pb-8">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-xs text-gray-400 font-mono">
            {news.published_at?.replace(/-/g, '.')}
          </span>
          <span className="text-[10px] font-black border border-black px-2 py-0.5 uppercase">
            {news.category}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter leading-tight">
          {news.title}
        </h1>
      </div>

      {/* ニュース本文 */}
      <div className="prose prose-sm max-w-none mb-20 whitespace-pre-wrap leading-relaxed text-gray-800">
        {news.content}
      </div>

      <div className="text-center border-t border-gray-100 pt-12">
        <Link 
          href="/news" 
          className="text-[10px] font-black tracking-[0.2em] hover:underline"
        >
          BACK TO LIST
        </Link>
      </div>
    </main>
  ); // ← ここで return を閉じます
}