'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import YouTubeThumbnail from '@/components/YouTubeThumbnail'; // 共通コンポーネントをインポート

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
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 relative">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ヘッダー */}
        <div className="mb-20 border-b-4 border-black pb-6">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
            Video<span className="text-red-600 not-italic">.</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] mt-4">
            Official Visual Archives / Rabbiy
          </p>
        </div>

        {/* 動画グリッド (3カラム) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="group cursor-pointer" 
              onClick={() => setSelectedVideoId(video.youtube_id)}
            >
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl border border-gray-100">
                
                {/* 共通コンポーネントを使用 */}
                <YouTubeThumbnail videoId={video.youtube_id} alt={video.title} />
                
                {/* 再生ボタンアイコン */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>

              {/* 動画タイトル・日付情報 */}
              <div className="mt-6">
                <p className="text-[10px] font-mono text-gray-400 mb-1">
                  {video.published_at?.replace(/-/g, '.')}
                </p>
                <h2 className="text-lg font-bold leading-tight group-hover:text-red-600 transition-colors tracking-tight">
                  {video.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- YouTube モーダルウィンドウ --- */}
      {selectedVideoId && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedVideoId(null)}
        >
          <button className="absolute top-10 right-10 text-white text-4xl font-light hover:text-red-600 transition-colors">×</button>
          <div className="w-full max-w-5xl aspect-video bg-black shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}