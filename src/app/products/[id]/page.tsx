'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GoodsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="h-screen flex items-center justify-center animate-pulse font-mono text-xs">LOADING_DATA...</div>;

  const images = Array.isArray(product.image) ? product.image : [product.image_url];

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 relative overflow-hidden">
      {/* 背景のグリッド装飾 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* パンくずリスト風ナビ */}
        <div className="mb-12 flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/products" className="hover:text-black transition-colors">Goods Index</Link>
          <span>/</span>
          <span className="text-red-600">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- 左側：画像セクション (7カラム) --- */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden group">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              {/* 画像の隅にあるデジタル装飾 */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-zinc-300" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-zinc-300" />
            </div>

            {/* サムネイル一覧 */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square relative border-2 transition-all ${selectedImage === idx ? 'border-red-600' : 'border-transparent bg-gray-50 opacity-50'}`}
                  >
                    <Image src={img} alt="" fill className="object-cover p-2" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- 右側：情報セクション (5カラム) --- */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="border-b-4 border-black pb-6">
              <p className="text-[10px] font-mono text-red-600 font-bold tracking-[0.5em] mb-2 uppercase">
                {product.category || 'Archive Item'}
              </p>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight uppercase">
                {product.name}
              </h1>
            </div>

            <div className="py-8 space-y-6">
              {/* 価格 */}
              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-black tracking-tighter">
                  ¥{Number(product.price).toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Tax included / Shipping extra</span>
              </div>

              {/* 商品説明 */}
              <div className="text-sm leading-relaxed text-zinc-600 font-medium whitespace-pre-wrap border-l-2 border-zinc-100 pl-6">
                {product.description || 'No description provided for this specific item. Part of the Rabbiy official collection.'}
              </div>

              {/* スペック（難解風） */}
              <div className="bg-zinc-50 p-6 font-mono text-[9px] text-zinc-500 space-y-2 border border-zinc-100">
                <div className="flex justify-between border-b border-zinc-200 pb-1">
                  <span>ITEM_ID</span>
                  <span className="text-black font-bold">{id.toUpperCase().slice(0, 12)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1">
                  <span>AVAILABILITY</span>
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? 'IN_STOCK' : 'OUT_OF_ORDER'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1">
                  <span>PROTOCOL</span>
                  <span className="text-black font-bold">SECURE_TRANSACTION</span>
                </div>
              </div>
            </div>

            {/* カートアクション */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center border border-black h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors font-bold"
                >-</button>
                <div className="flex-1 h-full flex items-center justify-center font-black border-x border-black">
                  {quantity.toString().padStart(2, '0')}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors font-bold"
                >+</button>
              </div>

              <button className="w-full bg-black text-white h-16 font-black italic tracking-[0.3em] uppercase hover:bg-red-600 transition-all flex items-center justify-center group relative overflow-hidden">
                <span className="relative z-10">Add to Cart</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* 下部のステータスバー */}
            <div className="mt-12 pt-6 border-t border-zinc-100 flex justify-between items-center text-[8px] font-mono text-zinc-400">
              <p>© RABBIY_SYSTEM_v2.0.25</p>
              <p>ENCRYPTED_LINK_ESTABLISHED</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}