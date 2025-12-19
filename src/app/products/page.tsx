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
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (supabaseError) throw supabaseError;
        console.log("Fetched Data:", data); // コンソールでデータ構造を確認
        setProducts(data || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };
    fetchProducts();
  }, []);

  if (error) return <div className="pt-40 text-center text-red-500 font-mono">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 border-b-4 border-black pb-8">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">Goods.</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products?.map((product) => {
            // 画像取得を極限まで安全にする
            let displayUrl = "";
            try {
              if (product.image && Array.isArray(product.image) && product.image.length > 0) {
                displayUrl = product.image[0];
              } else if (typeof product.image === 'string') {
                displayUrl = product.image;
              }
            } catch (e) {
              console.error("Image processing error", e);
            }

            return (
              <Link key={product.id || Math.random()} href={`/products/${product.id}`} className="group block">
                {/* 枠が絶対に出るように、最小の高さを指定 */}
                <div className="relative aspect-square w-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {displayUrl ? (
                    <Image
                      src={displayUrl}
                      alt=""
                      fill
                      className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Image Null</span>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-tight">{product.name || 'Unnamed Product'}</h2>
                    <p className="text-[9px] text-zinc-400 font-mono mt-1 uppercase">ID: {String(product.id).slice(0, 8)}</p>
                  </div>
                  <p className="text-lg font-bold tracking-tighter text-gray-900">
                    ¥{product.price ? Number(product.price).toLocaleString() : '0'}
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