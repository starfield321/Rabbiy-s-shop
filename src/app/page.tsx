import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase'; // 仮の型定義

// 仮の商品データの型定義 (実際はSupabase CLIで生成)
type Product = Database['public']['Tables']['products']['Row'];

// データの取得と表示を行うサーバーコンポーネント (Next.js App Router の機能)
export default async function HomePage() {
  // データベースから 'products' テーブルのデータを取得
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return <div className="p-4 text-red-600">データの取得に失敗しました。</div>;
  }

  // 取得したデータをリスト表示
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛍️ T-OD クローン 商品一覧</h1>
      <p className="text-sm text-gray-500 mb-8">（このデータは、Supabaseで実際にテーブルを作成すると表示されます）</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg text-green-600">¥ {product.price}</p>
              <p className="text-sm text-gray-500 mt-2">{product.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">現在、商品データがありません。</p>
        )}
      </div>
    </main>
  );
}