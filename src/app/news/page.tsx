import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function NewsListPage() {
  const { data: newsItems } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      {/* ヘッダー */}
      <div className="mb-20 border-b-4 border-black pb-6">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
            News<span className="text-red-600 not-italic">.</span>
        </h1>
        <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] mt-4">
            Official Information
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {newsItems?.map((news) => (
          <Link href={`/news/${news.id}`} key={news.id} className="group flex flex-col md:flex-row py-8 hover:bg-gray-50 transition-colors px-4">
            <div className="md:w-1/4 mb-2 md:mb-0">
              <span className="text-[10px] font-black border border-black px-2 py-0.5 mr-4 uppercase">
                {news.category}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {news.published_at?.replace(/-/g, '.')}
              </span>
            </div>
            <div className="md:w-3/4">
              <h2 className="text-lg font-bold group-hover:underline tracking-tight">
                {news.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}