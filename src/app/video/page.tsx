'use client';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function VideoPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false }); // 表示順に取得

      if (data) {
        setVideos(data);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase">Loading...</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="mb-16 border-b-4 border-black pb-4">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Video</h1>
        <p className="text-gray-400 text-[10px] tracking-[0.3em] mt-2">Official Archives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {videos.map((video) => (
          <div key={video.id} className="group">
            <div className="aspect-video bg-black overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.youtube_id}`}
                title={video.title}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-sm font-black tracking-widest text-gray-900 group-hover:text-red-600 transition-colors">
                {video.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}