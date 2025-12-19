'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GoodsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      setProducts(data || []);
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 relative">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ヘッダーセクション */}
        <div className="mb-20 border-b-4 border-black pb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
              Goods<span className="text-red-600 not-italic">.</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase mt-4">
              Official Merchandise & Archives
            </p>
          </div>
          <div className="mt-8 md:mt-0 text-right">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Total Items: {products.length.toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* 3カラム 商品グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                
                {/* 画像：配列の1枚目を表示 */}
                {product.image && product.image.length > 0 ? (
                    <Image
                    // image[0] で配列の1番目を取得
                    src={product.image[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 md:p-12 transition-transform duration-1000 group-hover:scale-110"
                    unoptimized // 外部URLの場合は一旦これを付けると表示が安定します
                    />
                ) : (
                    // 画像がない場合のプレースホルダー（背景のみ、または代替画像）
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-zinc-300 text-[10px] font-mono uppercase tracking-widest">
                    No Image Available
                    </div>
                )}

                {/* SOLD OUT 表示（在庫管理がある場合を想定） */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <span className="text-white text-xl font-black italic tracking-tighter border-2 border-white px-4 py-1 -rotate-12">
                      SOLD OUT
                    </span>
                  </div>
                )}

                {/* ホバー時に現れる「VIEW DETAIL」難解テキスト */}
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-black tracking-[0.5em] text-red-600 bg-white px-4 py-2 shadow-xl">
                    VIEW DETAIL
                  </span>
                </div>
              </div>

              {/* 商品情報 */}
              <div className="mt-6 flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xs font-black uppercase tracking-tight leading-tight group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-[9px] text-zinc-400 font-mono mt-1 uppercase">
                    ID: {product.id.slice(0, 8)} / CAT: {product.category || 'GENERAL'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tracking-tighter text-gray-900 leading-none">
                    ¥{Number(product.price).toLocaleString()}
                  </p>
                  <p className="text-[8px] text-zinc-400 font-bold mt-1 uppercase">Tax incl.</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}