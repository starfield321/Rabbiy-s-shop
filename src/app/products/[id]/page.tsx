import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Next.js 15以降の仕様に合わせた型定義
export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. paramsを非同期で展開する (ここが重要！)
  const { id } = await params;
  const productId = parseInt(id, 10);

  // 数値に変換できない場合は404
  if (isNaN(productId)) {
    notFound();
  }

  // 2. Supabaseからデータを取得
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  // 3. データ取得に失敗した場合
  if (error || !product) {
    console.error("Supabase Error:", error);
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
            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">
              <span className="text-sm italic">No Image</span>
            </div>
          )}
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
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
              {product.description || "商品の説明はまだありません。"}
            </p>
          </div>

          <div className="pt-4">
            <button className="w-full bg-black text-white py-5 text-lg font-black hover:bg-gray-800 transition-all shadow-xl">
              カートに入れる
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}