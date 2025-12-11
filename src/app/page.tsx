// src/app/page.tsx
import { ProductCard } from '@/components/ProductCard';

// ダミーの商品データ
const dummyProducts = [
  { id: 1, title: "Drummer's Set Up Vol.44 yukihiro", vendor: "yukihiro", price: 4400, imageUrl: "/product-img-1.jpg", isNew: true, isSoldOut: false },
  { id: 2, title: "Drummer's Set Up Vol.44 yukihiro 初回予約販売・限定カラー", vendor: "yukihiro", price: 4400, imageUrl: "/product-img-2.jpg", isNew: true, isSoldOut: true },
  { id: 3, title: "Oda Kogane - LT-001 (限定版)", vendor: "Oda Kogane", price: 5500, imageUrl: "/product-img-3.jpg", isNew: true, isSoldOut: false },
  { id: 4, title: "Classic Guitar T-Shirt - Blue Notes", vendor: "Rittor Brand", price: 3850, imageUrl: "/product-img-4.jpg", isNew: false, isSoldOut: false },
  { id: 5, title: "Vintage Synthesizer Poster", vendor: "Culture Gear", price: 2980, imageUrl: "/product-img-5.jpg", isNew: false, isSoldOut: false },
  { id: 6, title: "Bass Day 2025 Commemorative Tee", vendor: "Event Goods", price: 4950, imageUrl: "/product-img-6.jpg", isNew: false, isSoldOut: false },
];

// ダミー画像ファイルを public フォルダに配置してください (例: public/product-img-1.jpg)
// 画像がない場合は、placekittenやplacehold.itなどのプレースホルダーURLをご利用ください。

export default function Home() {
  return (
    <main className="min-h-screen pt-4">
      
      {/* ヒーローセクション（バナー）の代替 - ここは後で調整 */}
      <section className="bg-gray-100 p-8 mb-8 text-center">
        <h2 className="text-2xl font-bold">メインビジュアル / ヒーローバナー</h2>
        <p className="text-gray-600">（スライダー機能は後ほど実装、まずは静的な表示）</p>
      </section>

      {/* 新着商品セクション */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-center mb-6">
          <span className="block text-sm text-gray-600">NEW ITEMS</span>
          <span className="text-3xl font-bold">新着商品</span>
        </h2>

        {/* 商品一覧グリッド (元のHTMLのクラスをTailwindで置き換え) */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {dummyProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </ul>
      </section>

      {/* 今後は、ヘッダー、フッター、その他のセクションを順次構築していきます。 */}
    </main>
  );
}