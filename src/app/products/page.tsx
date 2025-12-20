'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GoodsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // order('created_at') を削除し、確実に存在する 'id' で並び替えます
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false }); 
        
        if (supabaseError) throw supabaseError;
        setProducts(data || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };
    fetchProducts();
  }, []);

  if (error) return (
    <div className="pt-40 text-center font-mono">
      <p className="text-red-500 mb-4">Error: {error}</p>
      <p className="text-zinc-400 text-xs">テーブルのカラム名を確認してください</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 border-b-4 border-black pb-8">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
            Goods<span className="text-red-600">.</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] mt-4">
            Official Merchandise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products?.map((product) => {
            // 画像取得ロジック（配列の1枚目を取得）
            let displayUrl = "";
            if (product.image && Array.isArray(product.image) && product.image.length > 0) {
              displayUrl = product.image[0];
            } else if (typeof product.image === 'string') {
              displayUrl = product.image;
            }

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group block">
                <div className="relative aspect-square w-full bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:shadow-xl">
                  {displayUrl ? (
                    <Image
                      src={displayUrl}
                      alt={product.name || ""}
                      fill
                      className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">No Image</span>
                  )}
                  
                  {/* ホバー演出 */}
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors duration-300" />
                </div>

                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-tight group-hover:text-red-600 transition-colors">
                      {product.name || 'Unnamed'}
                    </h2>
                  </div>
                  <p className="text-lg font-bold tracking-tighter text-gray-900 leading-none">
                    ¥{product.price ? Number(product.price).toLocaleString() : '---'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}