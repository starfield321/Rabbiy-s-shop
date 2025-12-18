// src/app/products/[id]/page.tsx

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // params.id を数値に変換して検索する
  const productId = parseInt(params.id, 10);

  // 数値に変換できない場合（/products/abc など）は即座に404
  if (isNaN(productId)) {
    notFound();
  }

  // Supabaseからデータを取得
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId) // 数値として比較
    .single();

  // データがない、またはエラーの場合は404を表示
  if (error || !product) {
    console.log("Error or No Product:", error); // デバッグ用
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左側：商品画像 */}
        <div className="bg-gray-100 aspect-square relative overflow-hidden border border-gray-200">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200">
              <span className="text-sm italic">No Image</span>
            </div>
          )}
        </div>

        {/* 右側：商品情報 */}
        <div className="flex flex-col space-y-6">
          <div>
            <p className="text-xs text-blue-600 font-bold tracking-widest uppercase">Item Details</p>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-3xl font-bold text-red-600 mt-6">
              ¥{Number(product.price).toLocaleString()}<span className="text-sm text-gray-500 ml-2 font-normal">(税込)</span>
            </p>
          </div>

          <div className="border-t border-b border-gray-100 py-8">
            <h2 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-tighter">Description</h2>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
              {product.description || "商品の説明はまだありません。"}
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <button className="w-full bg-black text-white py-5 text-lg font-black hover:bg-gray-800 transition-all transform active:scale-95 shadow-xl">
              カートに入れる
            </button>
            <p className="text-center text-xs text-gray-400">
              通常、3〜7営業日以内に発送いたします。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}