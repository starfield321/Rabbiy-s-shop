'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GoodsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
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
          {products.map((product) => {
            // --- 画像URL取得ロジック ---
            let displayUrl = "";
            if (Array.isArray(product.image) && product.image.length > 0) {
              // text[] 配列の場合
              displayUrl = product.image[0];
            } else if (typeof product.image === 'string' && product.image.startsWith('http')) {
              // 単なる文字列（URL）の場合
              displayUrl = product.image;
            } else if (product.image_url) {
              // 別カラム image_url がある場合
              displayUrl = product.image_url;
            }

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl flex items-center justify-center">
                  
                  {/* デバッグ用 (URLが空なら警告を出す) */}
                  {!displayUrl && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 z-10">
                      <p className="text-[8px] font-mono text-zinc-500">No URL Found</p>
                    </div>
                  )}

                  {displayUrl && (
                    <Image
                      src={displayUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-8 md:p-12 transition-transform duration-1000 group-hover:scale-110"
                      unoptimized
                    />
                  )}

                  {/* SOLD OUT オーバーレイ */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <span className="text-white text-xl font-black italic tracking-tighter border-2 border-white px-4 py-1 -rotate-12">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {/* ホバー時 VIEW DETAIL */}
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors duration-300 flex items-center justify-center z-10">
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
                      ID: {product.id.toString().slice(0, 8)} / CAT: {product.category || 'GENERAL'}
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
            );
          })}
        </div>

        {/* 読み込み中表示 */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </main>
  );
}