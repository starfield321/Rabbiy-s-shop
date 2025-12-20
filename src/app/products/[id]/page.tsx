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

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-white font-mono text-[10px] tracking-[0.5em] animate-pulse uppercase">
        Initializing_Data_Stream...
      </div>
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center font-mono">PRODUCT_NOT_FOUND</div>;

  // 画像配列の正規化
  const images = Array.isArray(product.image) ? product.image : [product.image_url || '/placeholder.png'];

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative overflow-hidden">
      {/* 背景の微細なドットグリッド */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ナビゲーション */}
        <div className="mb-12 flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/products" className="hover:text-red-600 transition-colors">Goods_Index</Link>
          <span>/</span>
          <span className="text-zinc-200">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- 左側：画像エリア (7カラム) --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square bg-zinc-900 border border-zinc-800 overflow-hidden group">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-12 transition-transform duration-1000 group-hover:scale-105"
                unoptimized
              />
              {/* 四隅のシステム装飾 */}
              <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-zinc-700" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-zinc-700" />
            </div>

            {/* サムネイル一覧 */}
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-3">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square relative border transition-all duration-300 ${
                      selectedImage === idx ? 'border-red-600' : 'border-zinc-800 bg-zinc-900 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-2" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- 右側：情報・購入エリア (5カラム) --- */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border-b border-zinc-800 pb-8">
              <p className="text-[10px] font-mono text-red-600 font-bold tracking-[0.6em] mb-3 uppercase">
                {product.category || 'Standard_Issue'}
              </p>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none uppercase mb-4">
                {product.name}
              </h1>
              <p className="text-[11px] font-mono text-zinc-500 tracking-wider">ID: {id.toUpperCase()}</p>
            </div>

            <div className="py-10 space-y-12">
              {/* 商品説明 */}
              <div className="text-xs leading-relaxed text-zinc-400 font-medium whitespace-pre-wrap border-l border-zinc-800 pl-6">
                {product.description || 'No additional data found for this item.'}
              </div>

              {/* サイズ選択セクション (米津さん風の整列をRabbiy流に) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                      Size_Selection
                    </label>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 flex items-center justify-center text-[11px] font-bold transition-all duration-300 border ${
                          selectedSize === size 
                            ? 'bg-red-600 text-white border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                            : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-400 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 数量・価格セクション */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                    Quantity
                  </label>
                  <div className="flex items-center w-40 h-12 border border-zinc-800 bg-zinc-950">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-full flex items-center justify-center hover:bg-zinc-900 transition-colors text-zinc-400"
                    >－</button>
                    <div className="flex-1 h-full flex items-center justify-center font-mono text-xs border-x border-zinc-800">
                      {quantity.toString().padStart(2, '0')}
                    </div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-full flex items-center justify-center hover:bg-zinc-900 transition-colors text-zinc-400"
                    >＋</button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Value_Total</p>
                  <p className="text-5xl font-black italic tracking-tighter text-white">
                    ¥{Number(product.price * quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* カート追加ボタン */}
              <div className="pt-6">
                <button 
                  disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
                  className={`w-full h-16 font-black italic tracking-[0.4em] uppercase transition-all duration-700 flex items-center justify-center group relative overflow-hidden border ${
                    product.sizes && product.sizes.length > 0 && !selectedSize
                      ? 'bg-transparent border-zinc-800 text-zinc-800 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-red-600 hover:text-white hover:border-red-600'
                  }`}
                >
                  <span className="relative z-10">
                    {product.sizes && product.sizes.length > 0 && !selectedSize 
                      ? 'Select_Size_Required' 
                      : 'Add_to_Cart_Protocol'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </button>
              </div>
            </div>

            {/* システムステータスフッター */}
            <div className="mt-auto pt-10 flex justify-between items-center text-[7px] font-mono text-zinc-700 tracking-widest border-t border-zinc-900">
              <p>CONNECTION: SECURE_SSL</p>
              <p>LOC: {id.slice(0, 16)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}