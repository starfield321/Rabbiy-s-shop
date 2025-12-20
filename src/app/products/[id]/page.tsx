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
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-mono text-[10px] tracking-widest animate-pulse">LOADING_DATA...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-mono">PRODUCT_NOT_FOUND</div>;

  const images = Array.isArray(product.image) ? product.image : [product.image_url || '/placeholder.png'];
  // サイズ選択が必要な商品かどうか（sizes配列が存在するかチェック）
  const isSizeRequired = product.sizes && product.sizes.length > 0;

  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ナビゲーション */}
        <div className="mb-12 flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/products" className="hover:text-black transition-colors">Goods_Index</Link>
          <span>/</span>
          <span className="text-zinc-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 左側：画像エリア */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden group">
              <Image src={images[selectedImage]} alt={product.name} fill className="object-contain p-12 transition-transform duration-1000 group-hover:scale-105" unoptimized />
              <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-zinc-200" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-zinc-200" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-3">
                {images.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`aspect-square relative border transition-all ${selectedImage === idx ? 'border-red-600' : 'border-gray-200 opacity-40 hover:opacity-100'}`}>
                    <Image src={img} alt="" fill className="object-contain p-2" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右側：情報エリア */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border-b-4 border-black pb-8">
              <p className="text-[10px] font-mono text-red-600 font-bold tracking-[0.6em] mb-3 uppercase">
                {product.category || 'Official_Item'}
              </p>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none uppercase mb-2">
                {product.name}
              </h1>
              {/* 値段を商品名のすぐ下に配置 */}
              <p className="text-4xl font-black tracking-tighter mt-4">
                ¥{Number(product.price).toLocaleString()}
              </p>
            </div>

            <div className="py-10 space-y-10">
              <div className="text-xs leading-relaxed text-zinc-600 font-medium whitespace-pre-wrap border-l border-zinc-100 pl-6">
                {product.description}
              </div>

              {/* サイズ選択 */}
              {isSizeRequired && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Select_Size</label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 flex items-center justify-center text-[11px] font-bold transition-all border ${
                          selectedSize === size ? 'bg-black text-white border-black' : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-black hover:text-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 数量選択 */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Quantity</label>
                <div className="flex items-center w-40 h-12 border border-zinc-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors">－</button>
                  <div className="flex-1 h-full flex items-center justify-center font-mono text-xs border-x border-zinc-200">{quantity.toString().padStart(2, '0')}</div>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors">＋</button>
                </div>
              </div>

              {/* カートボタン */}
              <div className="pt-6">
                <button 
                  disabled={isSizeRequired && !selectedSize}
                  className={`w-full h-16 font-black italic tracking-[0.4em] uppercase transition-all flex items-center justify-center group relative overflow-hidden border ${
                    isSizeRequired && !selectedSize
                      ? 'bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-red-600 hover:border-red-600'
                  }`}
                >
                  <span className="relative z-10">
                    {isSizeRequired && !selectedSize ? 'Please_Select_Size' : 'Add_to_Cart_Protocol'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}