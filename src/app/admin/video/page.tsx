'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';
import { Megaphone, Save, X, Edit2, Trash2, Calendar, Youtube, PlayCircle } from 'lucide-react';

export default function AdminVideoPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('published_at', { ascending: false });
    if (data) setVideos(data);
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let cleanId = youtubeId;
    if (youtubeId.includes('v=')) {
      cleanId = youtubeId.split('v=')[1].split('&')[0];
    } else if (youtubeId.includes('youtu.be/')) {
      cleanId = youtubeId.split('youtu.be/')[1];
    }

    const videoData = { title, youtube_id: cleanId, published_at: publishedAt };

    try {
      if (editingId) {
        await supabase.from('videos').update(videoData).eq('id', editingId);
        alert('VIDEO_UPDATED');
      } else {
        await supabase.from('videos').insert([videoData]);
        alert('VIDEO_ADDED');
      }
      resetForm();
      fetchVideos();
    } catch (err: any) {
      alert('ERROR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setYoutubeId(item.youtube_id);
    setPublishedAt(item.published_at);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    await supabase.from('videos').delete().eq('id', id);
    fetchVideos();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setYoutubeId('');
    setPublishedAt(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-40 px-6 md:px-10 text-black font-sans pb-20">
      <AdminNav />
      
      {/* メインコンテンツの幅を max-w-7xl に変更 */}
      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-16 mt-20">
        
        {/* ヘッダーデザイン */}
        <div className="relative mb-20 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              {editingId ? 'Edit_Video' : 'Video Manager'}<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none text-zinc-100 text-xl md:text-4xl font-black italic tracking-[0.2em] whitespace-nowrap">
              {editingId ? 'Update Content' : 'Publish Video'}
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {/* 入力フォーム */}
        <section className="bg-zinc-50 border border-zinc-100 p-8 md:p-12 rounded-sm shadow-sm mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> Published Date / 公開日
                </label>
                <input 
                  type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} 
                  className="w-full bg-white border-b-2 border-zinc-200 p-4 font-bold outline-none focus:border-black transition-all"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest flex items-center gap-2">
                  <Youtube size={12} /> YouTube URL / ID
                </label>
                <input 
                  placeholder="URL or ID..." value={youtubeId} onChange={e => setYoutubeId(e.target.value)} 
                  className="w-full bg-white border-b-2 border-zinc-200 p-4 font-bold outline-none focus:border-black transition-all"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 tracking-widest">Video Title / 動画タイトル</label>
              <input 
                placeholder="動画のタイトルを入力" value={title} onChange={e => setTitle(e.target.value)} 
                className="w-full bg-white border-b-2 border-zinc-200 p-4 text-lg font-bold outline-none focus:border-black transition-all"
                required 
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-zinc-200">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 md:flex-none h-16 bg-black text-white px-12 font-bold italic text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] disabled:bg-zinc-300"
              >
                <PlayCircle size={20} />
                <span>{loading ? 'Processing...' : editingId ? 'Update_Video' : 'Publish Video'}</span>
              </button>
              
              {editingId && (
                <button 
                  type="button" onClick={resetForm} 
                  className="h-16 border-2 border-zinc-200 px-8 font-bold text-zinc-400 hover:border-black hover:text-black transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* 動画一覧アーカイブ：グリッドを3つに変更 */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black italic tracking-tighter border-l-4 border-black pl-4">Archive List</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map(v => (
              <div key={v.id} className="group border border-zinc-100 bg-white p-6 space-y-4 hover:border-black transition-all shadow-sm">
                <div className="aspect-video bg-zinc-100 relative border border-zinc-200 overflow-hidden">
                  <iframe 
                    width="100%" height="100%" 
                    src={`https://www.youtube.com/embed/${v.youtube_id}`} 
                    frameBorder="0" allowFullScreen
                    className="transition-all duration-700" 
                  ></iframe>
                  {/* ↑ className から grayscale を削除しました */}
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 italic tabular-nums">{v.published_at}</p>
                    <h3 className="font-black text-xs italic tracking-tight group-hover:text-red-600 transition-colors line-clamp-1">{v.title}</h3>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => startEdit(v)} className="flex items-center gap-1 text-[9px] font-black hover:underline italic"><Edit2 size={12} /> EDIT</button>
                    <button onClick={() => handleDelete(v.id)} className="flex items-center gap-1 text-[9px] font-black text-zinc-300 hover:text-red-600 hover:underline italic"><Trash2 size={12} /> REMOVE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}