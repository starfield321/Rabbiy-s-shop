import Image from 'next/image';
import { notFound } from 'next/navigation';

// 本来はSupabaseから取得しますが、まずは表示確認用にデータを定義します
const dummyProducts = [
  { id: 1, name: "Drummer's Set Up Vol.44 yukihiro", price: 4400, description: "ここに商品の詳細説明が入ります。素材やサイズ感など。", imageUrl: "/product-img-1.jpg" },
  // ...必要に応じて追加
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // IDに基づいて商品を検索（実際はSupabaseのクエリに置き換えます）
  const product = dummyProducts.find(p => p.id === parseInt(params.id));

  if (!product) {
    notFound(); // 商品がない場合は404エラーを表示
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左側：商品画像 */}
        <div className="bg-gray-100 aspect-square relative overflow-hidden border border-gray-200">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
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
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* カート追加セクション */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-bold">数量</label>
              <select className="border border-gray-300 rounded px-2 py-1">
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition shadow-lg">
              カートに入れる
            </button>
          </div>

          <p className="text-xs text-gray-500 italic">
            ※配送には通常3〜5営業日ほどお時間をいただいております。
          </p>
        </div>
      </div>
    </main>
  );
}