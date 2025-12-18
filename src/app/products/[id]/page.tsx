'use client';

import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-20 text-center font-black animate-pulse">LOADING...</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        
        {/* 左：商品画像 */}
        <div className="aspect-square relative bg-[#f9f9f9] overflow-hidden">
          <Image
            src={product.image?.[0] || product.image_url}
            alt={product.name}
            fill
            className="object-contain p-12"
            unoptimized
          />
        </div>

        {/* 右：商品情報 */}
        <div className="flex flex-col justify-center">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold tracking-tighter text-red-600">
              ¥{Number(product.price).toLocaleString()}
            </p>
          </div>

          <div className="text-sm leading-relaxed text-gray-600 mb-12 whitespace-pre-wrap">
            {product.description || "この商品の説明はまだありません。"}
          </div>

          <button
            onClick={() => {
              addToCart(product);
              alert('カートに追加しました！');
            }}
            className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            Add to Cart
          </button>
          
          <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest">
            Free shipping on orders over ¥10,000
          </p>
        </div>
      </div>
    </main>
  );
}