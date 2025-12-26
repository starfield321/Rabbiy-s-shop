'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';

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
    <>
      <AdminNav />
      <div className="min-h-screen bg-white pt-32 pb-20 px-10 text-black">
        <div className="max-w-4xl mx-auto space-y-12">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase border-b-8 border-black pb-8">Video_Manager.</h1>
          
          <form onSubmit={handleSubmit} className="bg-zinc-50 border-4 border-black p-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} className="border-2 border-black p-4 font-black text-xs" required />
              <input placeholder="YOUTUBE_URL_OR_ID" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} className="border-2 border-black p-4 font-black text-xs" required />
            </div>
            <input placeholder="VIDEO_TITLE" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-2 border-black p-4 font-black uppercase text-xs" required />
            <button className="w-full bg-black text-white py-6 font-black italic uppercase hover:bg-red-600 transition-all">
              {loading ? 'Processing...' : editingId ? 'Update_Video_' : 'Add_New_Video_'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="w-full text-[10px] font-black uppercase underline">Cancel_Edit</button>}
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map(v => (
              <div key={v.id} className="border-4 border-black p-4 space-y-4">
                <div className="aspect-video bg-black relative">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${v.youtube_id}`} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[8px] font-mono text-zinc-400 mb-1">{v.published_at}</p>
                    <p className="font-black uppercase text-[10px] leading-tight italic">{v.title}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => startEdit(v)} className="text-black font-black text-[9px] uppercase underline">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-zinc-300 hover:text-red-600 font-black text-[9px] uppercase underline">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}