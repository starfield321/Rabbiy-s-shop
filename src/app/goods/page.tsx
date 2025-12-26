'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function GoodsPage() {
  const [goods, setGoods] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('goods')
          .select('*')
          .order('id', { ascending: false }); 
        
        if (supabaseError) throw supabaseError;
        setGoods(data || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };
    fetchGoods();
  }, []);

  if (error) return (
    <div className="pt-40 text-center font-mono">
      <p className="text-red-500 mb-4">Error: {error}</p>
      <p className="text-zinc-400 text-xs">テーブルのカラム名を確認してください</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* ヘッダーデザイン：最新のトンマナ */}
        <div className="relative mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Goods<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  Merchandise List
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 md:gap-20">
          {goods.map((item) => {
            const displayUrl = Array.isArray(item.image) ? item.image[0] : (item.image_url || item.image);
            
            return (
              <Link key={item.id} href={`/goods/${item.id}`} className="group">
                {/* 画像コンテナ: トップページと共通の影・枠・ライン演出 */}
                <div className="aspect-square relative overflow-hidden bg-white mb-8 border-2 border-zinc-100 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] transition-all duration-500 group-hover:shadow-none group-hover:border-black">
                  {displayUrl ? (
                    <Image
                      src={displayUrl}
                      alt={item.name || ""}
                      fill
                      className="object-contain p-8 transition-transform duration-1000 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  
                  {/* 底辺からせり上がる黒ライン */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </div>

                {/* テキストエリア */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-widest leading-tight group-hover:text-red-600 transition-colors">
                    {item.name || 'Unnamed Product'}
                  </h3>
                  <p className="text-sm text-red-600 font-black italic">
                    ¥{item.price ? Number(item.price).toLocaleString() : '---'}
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