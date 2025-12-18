import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // 1. Supabaseから全商品を取得（作成日順など）
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return <div className="p-8 text-center">商品の読み込みに失敗しました。</div>;
  }

  return (
    <main>
      {/* ヒーローセクション（以前作成したものがあればそのまま、なければ簡易版） */}
      <section className="bg-gray-100 py-20 text-center">
        <h2 className="text-4xl font-black italic tracking-tighter mb-4">NEW ARRIVALS</h2>
        <p className="text-gray-600">最新のアイテムをチェック</p>
      </section>

      {/* 商品一覧グリッド */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products?.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.id}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100 border border-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:underline">
                  {product.name}
                </h3>
                <p className="text-red-600 font-bold mt-1">
                  ¥{Number(product.price).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}