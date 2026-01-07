'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, PlusCircle } from 'lucide-react';

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fetchFeatures = async () => {
    // 登録順（作成日時が新しい順）に取得
    const { data } = await supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setFeatures(data);
    setLoading(false);
  };

  useEffect(() => { fetchFeatures(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setLabel(item.label || '');
    setLinkUrl(item.link_url || '');
    setPreviewUrl(item.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setLabel('');
    setLinkUrl('');
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !linkUrl || (!file && !editingId)) return alert('入力が不足しています');
    setUploading(true);

    try {
      let finalImageUrl = previewUrl;

      // 新しい画像が選択されている場合のみアップロード
      if (file) {
        const fileName = `${Math.random().toString(36).substring(2)}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('feature-images')
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('feature-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const featureData = {
        title,
        label,
        link_url: linkUrl,
        image_url: finalImageUrl,
      };

      if (editingId) {
        const { error } = await supabase.from('features').update(featureData).eq('id', editingId);
        if (error) throw error;
        alert('更新完了');
      } else {
        const { error } = await supabase.from('features').insert([featureData]);
        if (error) throw error;
        alert('登録完了');
      }

      resetForm();
      fetchFeatures();
    } catch (err: any) {
      alert('ERROR: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black italic">LOADING...</div>;

  return (
    <main className="min-h-screen bg-white pt-20 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16 mt-20">
        
        {/* ヘッダーデザイン（商品管理ページと統一） */}
        <div className="relative mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              {editingId ? 'Edit_Feature' : 'New Feature'}<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  {editingId ? 'Update Promotion' : 'Add New Feature'}
              </span>
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {/* 登録・編集フォーム */}
        <section className="bg-zinc-50 border border-zinc-100 p-8 md:p-12 rounded-sm shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 tracking-widest">Feature Title / メインタイトル</label>
                  <input 
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border-b-2 border-zinc-200 p-4 text-lg font-bold outline-none focus:border-black transition-all"
                    placeholder="Rabbiy Live 'GENESIS'"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 tracking-widest">Label / 赤文字ラベル (日付など)</label>
                  <input 
                    type="text" value={label} onChange={(e) => setLabel(e.target.value)}
                    className="w-full bg-white border-b-2 border-zinc-200 p-4 text-lg font-bold outline-none focus:border-black transition-all"
                    placeholder="2026.03.15"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 tracking-widest">Link URL / リンク先パス</label>
                  <input 
                    type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full bg-white border-b-2 border-zinc-200 p-4 text-lg font-bold outline-none focus:border-black transition-all"
                    placeholder="/shop/goods/1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest">Background Image / 背景画像 (16:9)</label>
                <div className="relative aspect-video bg-white border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden group">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <ImageIcon className="text-zinc-200" size={48} />
                  )}
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <p className="text-white text-[10px] font-black italic tracking-widest">Change_Image</p>
                  </div>
                </div>
                <p className="text-[9px] text-zinc-400 font-bold italic tracking-tighter">* Recommended Size: 1920x1080 (16:9)</p>
              </div>
            </div>

            <div className="flex gap-4 pt-10 border-t border-zinc-200">
              <button 
                type="submit" 
                disabled={uploading}
                className="flex-1 md:flex-none h-16 bg-black text-white px-12 font-bold italic text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] disabled:bg-zinc-300"
              >
                <Save size={20} />
                <span>{uploading ? '処理中...' : editingId ? '情報を更新する' : '項目を登録する'}</span>
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="h-16 border-2 border-zinc-200 px-8 font-bold text-zinc-400 hover:border-black hover:text-black transition-all">
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* 既存Feature一覧リスト */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black italic tracking-tighter border-l-4 border-black pl-4">Feature Archives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((item) => (
              <div key={item.id} className="group relative aspect-[16/9] bg-black overflow-hidden border border-zinc-100 shadow-sm transition-all hover:border-black">
                <img 
                  src={item.image_url} 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
                  alt={item.title} 
                />
                <div className="absolute bottom-6 left-6 text-white pointer-events-none">
                  <p className="text-red-600 font-bold text-xs mb-1 italic tracking-widest">{item.label}</p>
                  <h3 className="text-3xl font-black italic tracking-tighter leading-none">{item.title}</h3>
                </div>
                
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(item)} className="p-3 bg-white hover:bg-black hover:text-white transition-all shadow-lg">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={async () => { 
                      if(confirm('このFeature項目を削除しますか？')) {
                        const { error } = await supabase.from('features').delete().eq('id', item.id);
                        if (error) alert(error.message);
                        fetchFeatures();
                      }
                    }} 
                    className="p-3 bg-white text-zinc-300 hover:text-red-600 transition-all shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {features.length === 0 && (
              <div className="col-span-2 h-40 flex items-center justify-center border-2 border-dashed border-zinc-100">
                <p className="text-zinc-300 font-black italic tracking-widest text-xs">No Features Available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}