'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import YouTubeThumbnail from '@/components/YouTubeThumbnail';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function VideoPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false });
      setVideos(data || []);
    };
    fetchVideos();
  }, []);

  return (
    <main className="min-h-screen bg-white pt-24 lg:pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* ヘッダーデザイン：最新のトンマナ */}
        <div className="relative mb-16 lg:mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Video<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  Official Visual Archives
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {/* 動画グリッド */}
        <div className="mb-8 md:mt-0 text-right">
            <span className="text-4xl font-mono font-light tracking-tighter italic text-gray-200 leading-none">
              {videos.length.toString().padStart(2, '0')}
            </span>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest">Total Archives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              className="group cursor-pointer relative" 
              onClick={() => setSelectedVideoId(video.youtube_id)}
            >
              {/* サムネイルコンテナ */}
              <div className="relative aspect-video w-full bg-black overflow-hidden shadow-sm">
                
                {/* 画像ズーム */}
                <div className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100 h-full w-full">
                  <YouTubeThumbnail videoId={video.youtube_id} alt={video.title} />
                </div>
                
                {/* 【重要】ここを修正しました
                   常にDOMに存在させ、opacityだけで制御することで、外した時も滑らかにフェードアウトします 
                */}
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 
                              opacity-0 group-hover:opacity-100 
                              transition-opacity duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
                              pointer-events-none group-hover:pointer-events-auto">
                   
                   {/* 枠線の動き */}
                   <div className="absolute inset-0 border border-white/0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:inset-4 group-hover:border-white/20" />
                   
                   {/* VIEW PROJECT */}
                   <div className="relative overflow-hidden px-4">
                      <span className="inline-block text-white text-[10px] font-bold tracking-[0.1em] group-hover:tracking-[0.4em] translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                        View Project
                      </span>
                      <div className="w-0 group-hover:w-full h-[1px] bg-red-600 mt-1 transition-all duration-1000 delay-200 ease-[cubic-bezier(0.23,1,0.32,1)] mx-auto" />
                   </div>
                </div>
              </div>

              {/* テキストコンテンツ */}
              <div className="mt-6 border-l border-gray-200 pl-4 group-hover:border-red-600 transition-all duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-[10px] font-mono text-gray-400 tracking-tighter">
                    {video.published_at?.replace(/-/g, '/')}
                  </p>
                  <div className="h-[1px] flex-1 bg-gray-100 group-hover:bg-red-100 transition-all duration-700" />
                </div>
                <h2 className="text-xl font-bold leading-[1.2] tracking-tight group-hover:text-red-600 transition-colors duration-300">
                  {video.title}
                </h2>
                {/* ID表示のエラーを修正済み */}
                <p className="text-[9px] text-gray-300 mt-2 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-700 uppercase">
                  REF_ID: {String(video.id).slice(0, 8)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube モーダル */}
      {selectedVideoId && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-md p-4 animate-in fade-in duration-500"
          onClick={() => setSelectedVideoId(null)}
        >
          <button className="absolute top-8 right-8 text-white/40 hover:text-red-600 transition-all group flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">Close Archive</span>
            <span className="text-4xl font-light leading-none">×</span>
          </button>
          
          <div className="w-full max-w-6xl aspect-video bg-black shadow-2xl relative overflow-hidden rounded-sm" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}