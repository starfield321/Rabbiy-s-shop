'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useState, useEffect, ReactNode } from 'react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      // 1. paramsをアンラップ
      const { id } = await params;
      const productId = parseInt(id, 10);

      // 2. Supabaseからデータを取得（カラム名は image を指定）
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (data) {
        setProduct(data);
        // スクショで作成した「image」カラム（配列）の1枚目を初期値にする
        const initialImage = data.image && data.image.length > 0 ? data.image[0] : "";
        setMainImage(initialImage);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params]);

  if (loading) return <div className="p-20 text-center font-bold">読み込み中...</div>;
  if (!product) return notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左側：商品画像エリア */}
        <div className="flex flex-col gap-4">
          <div className="bg-white aspect-square relative overflow-hidden border border-gray-100 rounded-lg shadow-sm">
            {mainImage ? (
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                className="object-contain p-4"
                unoptimized // Supabaseの外部URLを扱うため、一旦これを入れると確実です
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">画像がありません</div>
            )}
          </div>

          {/* サムネイルリスト */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.image && product.image.map((imgUrl: string, index: number) => (
              <button 
                key={index}
                onClick={() => setMainImage(imgUrl)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden transition-all ${
                  mainImage === imgUrl ? 'border-black' : 'border-gray-200 opacity-60'
                }`}
              >
                <img src={imgUrl} alt={`thumb-${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 右側：商品情報 */}
        <div className="flex flex-col space-y-6">
          <div>
            <p className="text-xs text-blue-600 font-bold tracking-widest uppercase">Item Details</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-3xl font-bold text-red-600 mt-6">
              ¥{Number(product.price).toLocaleString()}<span className="text-sm text-gray-500 ml-2 font-normal">(税込)</span>
            </p>
          </div>

          <div className="border-t border-b border-gray-100 py-8">
            <h2 className="text-sm font-black text-gray-900 mb-4 uppercase">Description</h2>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap font-medium">
              {product.description || "商品の説明はまだありません。"}
            </p>
          </div>

          <div className="pt-4">
            <button className="w-full bg-black text-white py-5 text-lg font-black hover:bg-gray-800 transition-all shadow-xl rounded-none">
              カートに入れる
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}