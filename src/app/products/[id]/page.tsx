'use client';

// 1. インポート（必要なツールを読み込む）
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext'; // カート機能の追加

// 2. ページの定義（ここから開始）
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 3. フック・関数（データ取得やカートの準備）
  const { addToCart } = useCart(); 
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ...データ取得の処理（前回のコードのまま）...
  }, [params]);

  if (loading) return <div className="p-20 text-center font-bold">読み込み中...</div>;
  if (!product) return notFound();

  // 4. 表示する中身（return の後の ( ) で main 全体を囲む）
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左側：画像エリア */}
        <div className="flex flex-col gap-4">
           {/* ...画像の表示コード... */}
        </div>

        {/* 右側：情報エリア */}
        <div className="flex flex-col space-y-6">
          {/* ...商品名や価格... */}

          <div className="pt-4">
            {/* ここで addToCart を使う */}
            <button 
              onClick={() => addToCart(product)} 
              className="w-full bg-black text-white py-5 text-lg font-black hover:bg-gray-800 transition-all"
            >
              カートに入れる
            </button>
          </div>
        </div>

      </div>
    </main>
  );
} // 5. ページの定義（ここで終了）