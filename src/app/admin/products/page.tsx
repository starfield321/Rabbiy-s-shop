'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';

export default function AdminProductsPage() {
  const [goods, setGoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageItems, setImageItems] = useState<{file: File | null, preview: string}[]>([]);

  const fetchGoods = async () => {
    const { data } = await supabase.from('goods').select('*').order('id', { ascending: false });
    if (data) setGoods(data);
    setLoading(false);
  };

  useEffect(() => { fetchGoods(); }, []);

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setDescription(item.description || '');
    const existingImages = Array.isArray(item.image) 
      ? item.image.map((url: string) => ({ file: null, preview: url })) // ここに :string を追加
      : [{ file: null, preview: item.image }];
    setImageItems(existingImages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setName(''); setPrice(''); setDescription('');
    setImageItems([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImageItems(prev => [...prev, ...newItems]);
  };

  const removeImage = (index: number) => {
    setImageItems(prev => {
      const updated = [...prev];
      if (updated[index].file) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadSingleImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !price || imageItems.length === 0) return alert('入力が不足しています');
    setUploading(true);
    const finalPublicUrls: string[] = [];

    try {
      for (const item of imageItems) {
        if (item.file) {
          const url = await uploadSingleImage(item.file);
          if (url) finalPublicUrls.push(url);
        } else {
          finalPublicUrls.push(item.preview);
        }
      }

      const productData = { name, price: Number(price), image: finalPublicUrls, description };

      if (editingId) {
        const { error } = await supabase.from('goods').update(productData).eq('id', editingId);
        if (error) throw error;
        alert('更新完了');
      } else {
        const { error } = await supabase.from('goods').insert([productData]);
        if (error) throw error;
        alert('登録完了');
      }
      resetForm(); fetchGoods();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black italic">LOADING...</div>;

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white pt-32 pb-20 px-10 text-black">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase border-b-8 border-black pb-8">
            {editingId ? 'Edit_Product.' : 'Product_Manager.'}
          </h1>
          <div className="bg-zinc-50 border-4 border-black p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <input placeholder="NAME" value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-black p-4 font-black uppercase text-xs" />
                  <input placeholder="PRICE" type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-2 border-black p-4 font-black uppercase text-xs" />
                  <textarea placeholder="DESC" value={description} onChange={e => setDescription(e.target.value)} className="w-full border-2 border-black p-4 font-black uppercase text-xs h-32" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {imageItems.map((item, i) => (
                    <div key={i} className={`relative aspect-square border-2 ${i === 0 ? 'border-red-600 ring-2 ring-red-600' : 'border-black'}`}>
                      <img src={item.preview} className="w-full h-full object-contain p-1" alt="" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 text-[10px]">×</button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-black">
                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                    <span className="text-2xl">+</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <button disabled={uploading} className="flex-1 bg-black text-white py-6 font-black uppercase italic hover:bg-red-600 transition-all">
                  {uploading ? 'Processing...' : editingId ? 'Update_' : 'Register_'}
                </button>
                {editingId && <button type="button" onClick={resetForm} className="px-10 border-4 border-black font-black uppercase italic">Cancel</button>}
              </div>
            </form>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {goods.map((item) => (
              <div key={item.id} className="border-2 border-zinc-100 p-4 space-y-3 group hover:border-black transition-all">
                <div className="aspect-square bg-zinc-50 relative">
                  <img src={Array.isArray(item.image) ? item.image[0] : item.image} className="w-full h-full object-contain grayscale group-hover:grayscale-0" alt="" />
                </div>
                <p className="text-[10px] font-black uppercase truncate">{item.name}</p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="flex-1 py-1 bg-black text-white text-[8px] font-black uppercase">Edit</button>
                  <button onClick={() => { if(confirm('Delete?')) supabase.from('goods').delete().eq('id', item.id).then(()=>fetchGoods()) }} className="flex-1 py-1 border border-zinc-200 text-[8px] font-black text-zinc-300 hover:bg-red-600 hover:text-white uppercase">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}