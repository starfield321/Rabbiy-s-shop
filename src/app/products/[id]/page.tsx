'use client';

import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
        // 最初の一枚目をメイン画像にセット
        setMainImage(data.image?.[0] || data.image_url);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-20 text-center font-black animate-pulse">LOADING...</div>;

  // 複数画像があるか確認
  const allImages = product.image || [product.image_url];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        
        {/* 左：画像エリア */}
        <div className="space-y-4">
          {/* メイン画像 */}
          <div className="aspect-square relative bg-[#f9f9f9] overflow-hidden shadow-inner">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain p-8 md:p-12 transition-all duration-500"
              unoptimized
            />
          </div>
          
          {/* サムネイル一覧（複数ある場合のみ表示） */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((img: string, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square relative bg-[#f9f9f9] cursor-pointer border-2 transition-all ${
                    mainImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`${product.name}-${idx}`} fill className="object-cover p-1" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右：商品情報 */}
        <div className="flex flex-col justify-start pt-4">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 leading-none">
              {product.name}
            </h1>
            <p className="text-3xl font-bold tracking-tighter text-gray-900">
              ¥{Number(product.price).toLocaleString()}
            </p>
          </div>

          <div className="text-sm leading-relaxed text-gray-600 mb-12 whitespace-pre-wrap">
            {product.description || "NO DESCRIPTION AVAILABLE."}
          </div>

          <button
            onClick={() => {
              addToCart(product);
              alert('ADDED TO CART');
            }}
            className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.3em] text-sm hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl"
          >
            Add to Cart
          </button>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link href="/products" className="text-[10px] font-black tracking-widest uppercase hover:underline text-gray-400">
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}