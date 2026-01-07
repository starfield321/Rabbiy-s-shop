'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';
import { Plus, Package, Edit2, Trash2, Image as ImageIcon, Save, X, PlusCircle, MinusCircle } from 'lucide-react';

// サイズ情報の型定義
interface SizeSpec {
  size: string;
  length: string; // 身丈
  width: string;  // 身幅
  shoulder: string; // 肩幅
  sleeve: string;   // 袖丈
}

export default function AdminProductsPage() {
  const [goods, setGoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageItems, setImageItems] = useState<{file: File | null, preview: string}[]>([]);

  // ★サイズ管理用のステートを追加
  const [sizeSpecs, setSizeSpecs] = useState<SizeSpec[]>([]);

  const fetchGoods = async () => {
    const { data } = await supabase.from('goods').select('*').order('id', { ascending: false });
    if (data) setGoods(data);
    setLoading(false);
  };

  useEffect(() => { fetchGoods(); }, []);

  // サイズ入力欄を追加する関数
  const addSizeSpec = () => {
    setSizeSpecs([...sizeSpecs, { size: '', length: '', width: '', shoulder: '', sleeve: '' }]);
  };

  // サイズ入力欄を削除する関数
  const removeSizeSpec = (index: number) => {
    setSizeSpecs(sizeSpecs.filter((_, i) => i !== index));
  };

  // サイズ入力内容を更新する関数
  const handleSizeChange = (index: number, field: keyof SizeSpec, value: string) => {
    setSizeSpecs((prevSpecs) => {
      const updated = [...prevSpecs];
      // もし今の要素がオブジェクトじゃなかったら（文字だったりしたら）、新しいオブジェクトで作る
      if (typeof updated[index] !== 'object' || updated[index] === null) {
        updated[index] = { size: '', length: '', width: '', shoulder: '', sleeve: '' };
      }
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setDescription(item.description || '');
    // ★保存されているサイズ情報を復元（なければ空配列）
    setSizeSpecs(item.sizes || []);
    
    const existingImages = Array.isArray(item.image) 
      ? item.image.map((url: string) => ({ file: null, preview: url }))
      : [{ file: null, preview: item.image }];
    setImageItems(existingImages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setName(''); setPrice(''); setDescription('');
    setImageItems([]);
    setSizeSpecs([]); // ★リセット
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

      // ★サイズ情報を含めたデータを作成
      const productData = { 
        name, 
        price: Number(price), 
        image: finalPublicUrls, 
        description,
        sizes: sizeSpecs // 追加
      };

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
    <main className="min-h-screen bg-white pt-20 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16 mt-20">
        
        {/* ヘッダーデザイン */}
        <div className="relative mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              {editingId ? 'Edit_Product' : 'New Product'}<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  {editingId ? 'Update Inventory' : 'Add New Item'}
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
                  <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Product Name / 商品名</label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border-b-2 border-zinc-200 p-4 text-lg font-bold outline-none focus:border-black transition-all"
                    placeholder="アイテム名を入力"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Price / 価格 (¥)</label>
                  <input 
                    type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border-b-2 border-zinc-200 p-4 text-lg font-bold outline-none focus:border-black transition-all"
                    placeholder="2980"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Description / 商品説明</label>
                  <textarea 
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 bg-white border-b-2 border-zinc-200 p-4 text-sm font-medium outline-none focus:border-black transition-all resize-none"
                    placeholder="商品の詳細情報を入力してください"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Product Images / 商品画像</label>
                <div className="grid grid-cols-3 gap-4">
                    {imageItems.map((item, i) => (
                    <div key={i} className={`relative aspect-square border-2 ${i === 0 ? 'border-red-600 ring-2 ring-red-600/20' : 'border-zinc-200'} bg-white`}>
                        <img src={item.preview} className="w-full h-full object-contain p-1" alt="" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                    </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-zinc-100 transition-all gap-2">
                        <input type="file" multiple onChange={handleFileChange} className="hidden" />
                        <PlusCircle size={24} className="text-zinc-400" />
                        <span className="text-[9px] font-bold text-zinc-400 tracking-tighter uppercase">Add Image</span>
                    </label>
                </div>
              </div>
            </div>

            {/* ★サイズ詳細入力セクション (ここを追加) */}
            <div className="space-y-6 pt-6 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Size Specs / サイズ詳細 (任意)</label>
                <button 
                  type="button" 
                  onClick={addSizeSpec}
                  className="flex items-center gap-2 text-[10px] font-black italic bg-black text-white px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  <Plus size={14} /> 項目を追加する
                </button>
              </div>

              <div className="space-y-4">
                {sizeSpecs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-5 md:grid-cols-6 gap-2 items-end bg-white p-4 border border-zinc-100 shadow-sm relative group">
                    <div className="space-y-1 col-span-1">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">Size</p>
                      <input type="text" value={spec.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} placeholder="M" className="w-full border-b border-zinc-200 py-1 text-xs font-bold outline-none focus:border-black" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">身丈</p>
                      <input type="text" value={spec.length} onChange={(e) => handleSizeChange(index, 'length', e.target.value)} placeholder="70" className="w-full border-b border-zinc-200 py-1 text-xs outline-none focus:border-black" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">身幅</p>
                      <input type="text" value={spec.width} onChange={(e) => handleSizeChange(index, 'width', e.target.value)} placeholder="52" className="w-full border-b border-zinc-200 py-1 text-xs outline-none focus:border-black" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">肩幅</p>
                      <input type="text" value={spec.shoulder} onChange={(e) => handleSizeChange(index, 'shoulder', e.target.value)} placeholder="47" className="w-full border-b border-zinc-200 py-1 text-xs outline-none focus:border-black" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">袖丈</p>
                      <input type="text" value={spec.sleeve} onChange={(e) => handleSizeChange(index, 'sleeve', e.target.value)} placeholder="20" className="w-full border-b border-zinc-200 py-1 text-xs outline-none focus:border-black" />
                    </div>
                    <div className="flex justify-end col-span-5 md:col-span-1">
                      <button type="button" onClick={() => removeSizeSpec(index)} className="text-zinc-300 hover:text-red-600 transition-colors">
                        <MinusCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {sizeSpecs.length === 0 && (
                  <p className="text-[10px] italic text-zinc-300">サイズ指定なし</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-10 border-t border-zinc-200">
              <button 
                type="submit" 
                disabled={uploading}
                className="flex-1 md:flex-none h-16 bg-black text-white px-12 font-bold italic text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] disabled:bg-zinc-300 uppercase"
              >
                <Save size={20} />
                <span>{uploading ? '処理中...' : editingId ? '情報を更新する' : '商品を登録する'}</span>
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="h-16 border-2 border-zinc-200 px-8 font-bold text-zinc-400 hover:border-black hover:text-black transition-all">
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </section>

        {/* 商品一覧リスト */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black italic tracking-tighter border-l-4 border-black pl-4 uppercase">Product Inventory</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {goods.map((item) => (
              <div key={item.id} className="group space-y-4">
                <div className="aspect-square bg-zinc-50 relative overflow-hidden border border-zinc-100">
                  <img 
                    src={Array.isArray(item.image) ? item.image[0] : item.image} 
                    className="w-full h-full object-contain0 group-hover:scale-105 transition-all duration-500" 
                    alt={item.name} 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black leading-tight line-clamp-1 tracking-tighter uppercase">{item.name}</p>
                  <p className="text-[10px] font-bold text-red-600 italic">¥{Number(item.price).toLocaleString()}</p>
                  {/* サイズ展開がある場合は小さく表示 */}
                  {item.sizes && item.sizes.length > 0 && (
                    <p className="text-[8px] text-zinc-400 font-bold uppercase">Size: {item.sizes.map((s:any) => s.size).join(', ')}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(item)} className="flex-1 py-2 bg-black text-white text-[9px] font-bold italic hover:bg-zinc-800 flex justify-center items-center gap-1 uppercase">
                    <Edit2 size={10} />編集
                  </button>
                  <button 
                    onClick={async () => { 
                        if(confirm('商品を削除しますか？')) {
                            const { error } = await supabase.from('goods').delete().eq('id', item.id);
                            if (error) alert(error.message);
                            fetchGoods();
                        }
                    }} 
                    className="px-3 py-2 border border-zinc-200 text-zinc-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}