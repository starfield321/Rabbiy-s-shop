'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      // 1. Next.js 15の仕様に従い params を await する
      const { id } = await params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        setLoading(false);
        return;
      }

      // 2. Supabaseから商品データを取得
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (data) {
        setProduct(data);
        // image配列があれば1枚目、なければ以前のimage_urlを初期画像に設定
        const initialImage = (data.image && data.image.length > 0) 
          ? data.image[0] 
          : data.image_url;
        setMainImage(initialImage);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="font-bold text-gray-400 animate-pulse">LOADING...</p>
    </div>
  );

  if (!product) return notFound();

  // 表示する画像のリスト（配列カラム または 単一URL）を統合
  const allImages = product.image || [product.image_url].filter(Boolean);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左側：商品画像セクション */}
        <div className="flex flex-col gap-4">
          {/* メイン画像 */}
          <div className="bg-white aspect-square relative overflow-hidden border border-gray-100 rounded-sm shadow-sm">
            {mainImage ? (
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                className="object-contain p-4 transition-opacity duration-300"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 italic">No Image</div>
            )}
          </div>

          {/* サムネイル（複数画像がある場合のみ表示） */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.length > 1 && allImages.map((imgUrl: string, index: number) => (
              <button 
                key={index}
                onClick={() => setMainImage(imgUrl)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-sm overflow-hidden transition-all ${
                  mainImage === imgUrl ? 'border-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`thumb-${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 右側：商品情報セクション */}
        <div className="flex flex-col space-y-8">
          <div>
            <p className="text-[10px] md:text-xs text-blue-600 font-bold tracking-[0.2em] uppercase mb-2">Item Details</p>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl md:text-4xl font-bold text-red-600 mt-6 tracking-tighter">
              ¥{Number(product.price).toLocaleString()}
              <span className="text-sm text-gray-500 ml-2 font-normal">tax in</span>
            </p>
          </div>

          <div className="border-t border-b border-gray-100 py-10">
            <h2 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Description</h2>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap font-medium">
              {product.description || "商品の説明は現在準備中です。"}
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-black text-white py-6 text-lg font-black hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl tracking-widest uppercase"
            >
              カートに入れる
            </button>
            <p className="text-[10px] text-gray-400 text-center">
              通常3〜7営業日以内に発送いたします。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}