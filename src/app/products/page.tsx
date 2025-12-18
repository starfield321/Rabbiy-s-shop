import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="mb-16 border-b-4 border-black pb-4">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Shop</h1>
        <p className="text-gray-400 text-[10px] tracking-[0.3em] mt-2 uppercase">Official Merchandise</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products?.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className="aspect-[4/5] relative overflow-hidden bg-[#f9f9f9] mb-6 shadow-sm">
              <Image
                src={product.image?.[0] || product.image_url}
                alt={product.name}
                fill
                className="object-contain p-6 transition-transform duration-700 ease-in-out group-hover:scale-110"
                unoptimized
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-[11px] font-black uppercase tracking-tight group-hover:underline leading-tight">
                {product.name}
              </h3>
              <p className="text-sm font-bold tracking-tighter text-gray-900">
                ¥{Number(product.price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}