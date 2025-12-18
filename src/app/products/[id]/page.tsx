import { supabase } from '@/lib/supabase'; // すでに作成済みのsupabaseクライアント
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // 1. SupabaseからIDが一致する商品データを1件取得
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  // 2. データがない、またはエラーの場合は404を表示
  if (error || !product) {
    console.error(error);
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
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* 右側：商品情報 */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-red-600 mt-4">
              ¥{product.price.toLocaleString()}<span className="text-sm text-gray-600 ml-1">(税込)</span>
            </p>
          </div>

          <div className="border-t border-b border-gray-100 py-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2">商品説明</h2>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
              {product.description || "説明はありません。"}
            </p>
          </div>

          {/* カート追加ボタン（機能は後ほど） */}
          <div className="space-y-4">
            <button className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition shadow-lg">
              カートに入れる
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}