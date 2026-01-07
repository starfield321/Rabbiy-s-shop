'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';
import { Megaphone, Save, X, Edit2, Trash2, Calendar, Tag, Bold, Italic, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Loader2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('INFO');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // TipTap エディタの初期化
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-red-600 underline' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto rounded-sm border border-zinc-100 my-4' } }),
    ],
    content: '',
    immediatelyRender: false, // SSRエラー防止
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none outline-none min-h-[400px] p-6 text-black focus:bg-white transition-colors',
      },
    },
  });

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
    if (data) setNewsList(data);
  };

  useEffect(() => { fetchNews(); }, []);

  // 画像アップロード & エディタ挿入処理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `news-images/${fileName}`;

      // Supabase Storage にアップロード
      const { error: uploadError } = await supabase.storage
        .from('product-images') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 公開URLを取得
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      // エディタに挿入
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
      
    } catch (error: any) {
      alert('アップロード失敗: ' + error.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setPublishedAt(item.published_at);
    editor?.commands.setContent(item.content || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    
    setLoading(true);
    const content = editor.getHTML();
    const newsData = { title, content, category, published_at: publishedAt };

    try {
      if (editingId) {
        const { error } = await supabase.from('news').update(newsData).eq('id', editingId);
        if (error) throw error;
        alert('ニュースを更新しました');
      } else {
        const { error } = await supabase.from('news').insert([newsData]);
        if (error) throw error;
        alert('ニュースを投稿しました');
      }
      resetForm();
      fetchNews();
    } catch (err: any) {
      alert('エラー: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このニュースを削除しますか？')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      fetchNews();
    } catch (err: any) {
      alert('削除エラー: ' + err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(''); setCategory('INFO');
    setPublishedAt(new Date().toISOString().split('T')[0]);
    editor?.commands.setContent('');
  };

  const addLink = () => {
    const url = window.prompt('URLを入力してください');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-40 px-6 md:px-10 text-black font-sans pb-20">
      <AdminNav />
      
      <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-16 mt-20">
        
        {/* ヘッダーデザイン */}
        <div className="relative mb-20 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              {editingId ? 'Edit_News' : 'News Manager'}<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  {editingId ? 'Update Article' : 'Publish Information'}
              </span>
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {/* 登録フォーム */}
        <section className="bg-zinc-50 border border-zinc-100 p-8 md:p-12 rounded-sm shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest flex items-center gap-2"><Calendar size={12} /> 公開日</label>
                <input type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} className="w-full bg-white border-b-2 border-zinc-200 p-4 font-bold outline-none focus:border-black transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest flex items-center gap-2"><Tag size={12} /> カテゴリ</label>
                <input placeholder="INFO, LIVE, SHOP..." value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border-b-2 border-zinc-200 p-4 font-bold outline-none focus:border-black transition-all uppercase" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 tracking-widest">Title / タイトル</label>
              <input placeholder="ニュースのタイトルを入力" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border-b-2 border-zinc-200 p-4 text-lg font-bold outline-none focus:border-black transition-all" required />
            </div>

            {/* TipTap エディタエリア */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 tracking-widest">Content / 本文</label>
              <div className="bg-white border-2 border-zinc-100 rounded-sm overflow-hidden">
                <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-100 bg-zinc-50/50">
                  <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 hover:bg-zinc-200 rounded ${editor?.isActive('bold') ? 'bg-zinc-200' : ''}`}><Bold size={16}/></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 hover:bg-zinc-200 rounded ${editor?.isActive('italic') ? 'bg-zinc-200' : ''}`}><Italic size={16}/></button>
                  <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />
                  <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-2 hover:bg-zinc-200 rounded ${editor?.isActive('bulletList') ? 'bg-zinc-200' : ''}`}><List size={16}/></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`p-2 hover:bg-zinc-200 rounded ${editor?.isActive('orderedList') ? 'bg-zinc-200' : ''}`}><ListOrdered size={16}/></button>
                  <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />
                  <button type="button" onClick={addLink} className={`p-2 hover:bg-zinc-200 rounded ${editor?.isActive('link') ? 'text-blue-600 bg-blue-50' : ''}`}><LinkIcon size={16}/></button>
                  
                  {/* 画像アップロード用ラベルボタン */}
                  <label className="p-2 hover:bg-zinc-200 rounded text-red-600 cursor-pointer flex items-center justify-center">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16}/>}
                  </label>
                </div>
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-zinc-200">
              <button type="submit" disabled={loading} className="flex-1 md:flex-none h-16 bg-black text-white px-12 font-bold italic text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] disabled:bg-zinc-300">
                <Megaphone size={20} />
                <span>{loading ? '処理中...' : editingId ? '記事を更新する' : 'ニュースを投稿する'}</span>
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="h-16 border-2 border-zinc-200 px-8 font-bold text-zinc-400 hover:border-black hover:text-black transition-all"><X size={20} /></button>
              )}
            </div>
          </form>
        </section>

        {/* アーカイブリスト */}
        <div className="space-y-8 pb-20">
          <h2 className="text-3xl font-black italic tracking-tighter border-l-4 border-black pl-4">Archive List</h2>
          <div className="space-y-4">
            {newsList.map(item => (
              <div key={item.id} className="group border border-zinc-100 bg-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-black transition-all shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] bg-black text-white px-2 py-0.5 font-bold italic uppercase">{item.category}</span>
                    <p className="text-[10px] font-bold text-zinc-400 italic">{item.published_at}</p>
                  </div>
                  <h3 className="font-black text-lg italic tracking-tight group-hover:text-red-600 transition-colors line-clamp-1">{item.title}</h3>
                </div>
                <div className="flex gap-6 self-end md:self-auto">
                  <button onClick={() => startEdit(item)} className="flex items-center gap-1 text-[10px] font-bold hover:underline italic"><Edit2 size={12} /> EDIT</button>
                  <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 text-[10px] font-bold text-zinc-300 hover:text-red-600 hover:underline italic"><Trash2 size={12} /> DELETE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}