'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GoodsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        setProduct(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) return <div className="h-screen flex items-center justify-center font-mono text-[10px] animate-pulse">LOADING...</div>;

  const images = Array.isArray(product.image) ? product.image : [product.image_url || '/placeholder.png'];
  const isSizeRequired = Array.isArray(product.sizes) && product.sizes.length > 0;

  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* --- 上部：購入メインエリア --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* 左：画像 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden">
              <Image src={images[selectedImage]} alt={product.name} fill className="object-contain p-12" unoptimized />
            </div>
            <div className="grid grid-cols-6 gap-3">
              {images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`aspect-square relative border transition-all ${selectedImage === idx ? 'border-black' : 'border-gray-100 opacity-40'}`}>
                  <Image src={img} alt="" fill className="object-contain p-2" unoptimized />
                </button>
              ))}
            </div>
          </div>

          {/* 右：購入コントロール */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border-b-4 border-black pb-8">
              <p className="text-[10px] font-mono text-red-600 font-bold tracking-[0.6em] mb-3 uppercase">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none uppercase mb-4">{product.name}</h1>
              <p className="text-4xl font-black tracking-tighter">¥{Number(product.price).toLocaleString()}</p>
            </div>

            <div className="py-10 space-y-10">
              {/* サイズ選択 */}
              {isSizeRequired && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Select_Size</label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size: string) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`h-12 flex items-center justify-center text-[11px] font-bold transition-all border ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-black hover:text-black'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 数量選択 */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Quantity / 数量</label>
                <div className="flex items-center w-full h-14 border border-zinc-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-20 h-full flex items-center justify-center hover:bg-zinc-50 border-r border-zinc-200">－</button>
                  <div className="flex-1 h-full flex items-center justify-center font-mono text-sm font-bold">{quantity.toString().padStart(2, '0')}</div>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-20 h-full flex items-center justify-center hover:bg-zinc-50 border-l border-zinc-200">＋</button>
                </div>
              </div>

              {/* カートボタン */}
              <button disabled={isSizeRequired && !selectedSize} className={`w-full h-16 font-black italic tracking-[0.4em] uppercase transition-all flex items-center justify-center border ${isSizeRequired && !selectedSize ? 'bg-zinc-50 text-zinc-300 border-zinc-100' : 'bg-black text-white hover:bg-red-600 border-black hover:border-red-600'}`}>
                {isSizeRequired && !selectedSize ? 'Please_Select_Size' : 'Add_to_Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* --- 下部：商品概要 (米津さん風セクション) --- */}
        <div className="border-t border-zinc-200 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* 左：セクションタイトル */}
            <div className="md:col-span-4">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center">
                <span className="w-8 h-[2px] bg-red-600 mr-4"></span>
                Product Overview
                <span className="ml-3 text-[10px] font-mono text-zinc-400 not-italic tracking-widest">/ 商品概要</span>
              </h2>
            </div>
            
            {/* 右：詳細コンテンツ */}
            <div className="md:col-span-8 space-y-12">
              {/* 商品説明メイン */}
              <div className="text-sm leading-[2] text-zinc-700 font-medium whitespace-pre-wrap">
                {product.description || "この商品に関する詳細な説明は現在準備中です。"}
              </div>

              {/* スペック表（サイズ詳細や素材など） */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 border-t border-zinc-100 pt-12">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-zinc-400">Material / 素材</h3>
                  <p className="text-xs font-bold">{product.material || "Cotton 100%"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-zinc-400">Spec / 仕様</h3>
                  <p className="text-xs font-bold leading-relaxed whitespace-pre-wrap">
                    {product.spec || "MADE IN JAPAN\nORIGINAL BODY"}
                  </p>
                </div>
                {isSizeRequired && (
                  <div className="sm:col-span-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-zinc-400">Size Guide / サイズ表</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold">
                        <thead>
                          <tr className="border-b border-zinc-100 text-zinc-400">
                            <th className="py-2">SIZE</th>
                            <th className="py-2">LENGTH (着丈)</th>
                            <th className="py-2">WIDTH (身幅)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 text-zinc-600">
                          <tr><td className="py-3">S</td><td className="py-3">65cm</td><td className="py-3">49cm</td></tr>
                          <tr><td className="py-3">M</td><td className="py-3">69cm</td><td className="py-3">52cm</td></tr>
                          <tr><td className="py-3">L</td><td className="py-3">73cm</td><td className="py-3">55cm</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}