import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // 1. Supabaseから全商品を取得
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
      {/* ヒーローセクション */}
      <section className="bg-gray-100 py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">NEW ARRIVALS</h2>
        <p className="text-gray-500 text-sm md:text-base tracking-widest uppercase">最新のラインナップをチェック</p>
      </section>

      {/* 商品一覧グリッド */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
          {products?.map((product) => {
            // 表示する画像を決定 (image配列の1枚目、なければ以前のimage_url、それもなければ空)
            const displayImage = (product.image && product.image.length > 0) 
              ? product.image[0] 
              : product.image_url;

            return (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="group flex flex-col"
              >
                {/* 画像部分 */}
                <div className="relative aspect-square overflow-hidden bg-white border border-gray-100 rounded-sm shadow-sm">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      unoptimized // 外部URL表示を安定させるため
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs italic bg-gray-50">
                      No Image
                    </div>
                  )}
                </div>

                {/* 情報部分 */}
                <div className="mt-4 text-center">
                  <h3 className="text-[11px] md:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:underline">
                    {product.name}
                  </h3>
                  <p className="text-red-600 font-bold mt-1 text-xs md:text-base">
                    ¥{Number(product.price).toLocaleString()}
                    <span className="text-[10px] text-gray-500 font-normal ml-0.5">(tax in)</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}