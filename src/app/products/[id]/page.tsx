'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProductDetailPage({ params }: { params: any }) {
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { id } = await params;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProduct(data);
        // images配列があればその1枚目、なければ従来のimage_urlを表示
        setMainImage(data.images?.[0] || data.image_url);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return notFound();

  // 表示する画像のリストを作成（配列カラムか、従来のカラムか）
  const allImages = product.images || [product.image_url, product.back_image_url].filter(Boolean);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左側：商品画像エリア */}
        <div className="flex flex-col gap-4">
          {/* メイン画像 */}
          <div className="bg-white aspect-square relative overflow-hidden border border-gray-100 rounded-lg shadow-sm">
            {mainImage ? (
              <Image src={mainImage} alt={product.name} fill className="object-contain p-4" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            )}
          </div>

          {/* サムネイルリスト（複数枚対応） */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.image?.map((imgUrl: string, index: number) => (
              <button 
                key={index}
                onClick={() => setMainImage(imgUrl)}
                className="flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden"
              >
                <img src={imgUrl} alt={`thumb-${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 右側：商品情報（略） */}
        <div className="flex flex-col space-y-6">
           {/* ...以前のコードと同じ内容... */}
        </div>
      </div>
    </main>
  );
}