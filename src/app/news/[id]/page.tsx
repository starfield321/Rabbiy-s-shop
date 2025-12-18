import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // ← これを忘れずに追加！

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
    <main className="max-w-3xl mx-auto px-4 py-20">
      <div className="mb-12 border-b border-gray-100 pb-8">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-[10px] font-black border border-black px-2 py-0.5 uppercase">
            {news.category}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {news.published_at?.replace(/-/g, '.')}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-tight">
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
          className="text-[10px] font-black tracking-[0.2em] uppercase hover:underline"
        >
          BACK TO LIST
        </Link>
      </div>
    </main>
  ); // ← ここで return を閉じます
}