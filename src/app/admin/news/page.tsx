'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('INFO');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
    if (data) setNewsList(data);
  };

  useEffect(() => { fetchNews(); }, []);

  // 編集モード開始
  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category);
    setPublishedAt(item.published_at);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 保存（新規 or 更新）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newsData = { title, content, category, published_at: publishedAt };

    try {
      if (editingId) {
        // 更新 (UPDATE)
        const { error } = await supabase.from('news').update(newsData).eq('id', editingId);
        if (error) throw error;
        alert('NEWS_UPDATED');
      } else {
        // 新規 (INSERT)
        const { error } = await supabase.from('news').insert([newsData]);
        if (error) throw error;
        alert('NEWS_POSTED');
      }
      resetForm();
      fetchNews();
    } catch (err: any) {
      alert('ERROR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 削除処理
  const handleDelete = async (id: string) => {
    if (!confirm('本当にこのニュースを削除しますか？')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      fetchNews();
    } catch (err: any) {
      alert('DELETE_ERROR: ' + err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('INFO');
    setPublishedAt(new Date().toISOString().split('T')[0]);
  };

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white pt-32 pb-20 px-10 text-black">
        <div className="max-w-4xl mx-auto space-y-12">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase border-b-8 border-black pb-8">News_Manager.</h1>
          
          <form onSubmit={handleSubmit} className="bg-zinc-50 border-4 border-black p-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} className="border-2 border-black p-4 font-black text-xs" required />
              <input placeholder="CATEGORY" value={category} onChange={e => setCategory(e.target.value)} className="border-2 border-black p-4 font-black text-xs uppercase" required />
            </div>
            <input placeholder="NEWS_TITLE" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-2 border-black p-4 font-black uppercase text-xs" required />
            <textarea placeholder="NEWS_CONTENT" value={content || ''} onChange={e => setContent(e.target.value)} className="w-full border-2 border-black p-4 font-black h-40 text-xs" required />
            <button className="w-full bg-black text-white py-6 font-black italic uppercase hover:bg-red-600 transition-all">
              {loading ? 'Processing...' : editingId ? 'Update_News_' : 'Post_New_Article_'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="w-full text-[10px] font-black uppercase underline">Cancel_Edit</button>}
          </form>

          <div className="space-y-4">
            {newsList.map(item => (
              <div key={item.id} className="border-2 border-black p-6 flex justify-between items-center group">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[8px] bg-black text-white px-2 py-0.5 font-black italic">{item.category}</span>
                    <p className="text-[10px] font-mono text-zinc-400">{item.published_at}</p>
                  </div>
                  <h3 className="font-black uppercase text-sm italic">{item.title}</h3>
                </div>
                <div className="flex gap-6">
                  <button onClick={() => startEdit(item)} className="text-[10px] font-black underline hover:text-red-600">EDIT</button>
                  <button onClick={() => handleDelete(item.id)} className="text-[10px] font-black text-zinc-300 hover:text-red-600 underline">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}