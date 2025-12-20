'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, use } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function GoodsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        setProduct(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) return <div className="h-screen flex items-center justify-center font-mono text-[10px] animate-pulse">LOADING...</div>;

  const images = Array.isArray(product.image) ? product.image : [product.image_url || '/placeholder.png'];
  const isSizeRequired = Array.isArray(product.sizes) && product.sizes.length > 0;
  const handleAddToCart = () => {
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: images[0],
    size: selectedSize,
    quantity: quantity,
  });
};

  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
           <div className="mb-20 border-b-4 border-black pb-8">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
                Goods<span className="text-red-600">.</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] mt-4">
                Official Merchandise
            </p>
          </div>
        
        {/* --- 上部：購入メインエリア --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* 左：画像 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden">
              <Image src={images[selectedImage]} alt={product.name} fill className="object-contain p-12" unoptimized />
            </div>
            <div className="grid grid-cols-6 gap-3">
              {images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`aspect-square relative border transition-all ${selectedImage === idx ? 'border-black' : 'border-gray-100 opacity-40'}`}>
                  <Image src={img} alt="" fill className="object-contain p-2" unoptimized />
                </button>
              ))}
            </div>
          </div>

          {/* 右：購入コントロール */}
          <div className="lg:col-span-5 flex flex-col">
            
            <div className="mb-10 group">                
                {/* 商品名：下線をなくし、フォントの力強さで魅せる */}
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-[1.1] uppercase">
                {product.name}
                </h1>

                {/* 値段：赤色に変更し、商品名のすぐ下に配置 */}
                <div className="mt-6 flex items-baseline gap-3">
                <p className="text-4xl font-black tracking-tighter text-red-600">
                    ¥{Number(product.price).toLocaleString()}
                </p>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">
                    tax in.
                </span>
                </div>
            </div>

            <div className="space-y-12">
                {/* サイズ選択 */}
                {isSizeRequired && (
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Select_Size</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size: string) => (
                        <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 flex items-center justify-center text-[11px] font-bold transition-all border ${
                            selectedSize === size 
                            ? 'bg-black text-white border-black shadow-lg' 
                            : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-black hover:text-black'
                        }`}
                        >
                        {size}
                        </button>
                    ))}
                    </div>
                </div>
                )}

                {/* 数量選択（横幅いっぱい） */}
                <div className={`space-y-4 ${!isSizeRequired ? 'pt-6 border-t border-zinc-100' : ''}`}>
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                    Quantity <span className="ml-2 opacity-50">/ 数量</span>
                </label>
                <div className="flex items-center w-full h-14 border border-zinc-200 bg-white group focus-within:border-black transition-colors">
                    <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-20 h-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-xl border-r border-zinc-200"
                    >－</button>
                    <div className="flex-1 h-full flex items-center justify-center font-mono text-sm font-bold tabular-nums">
                    {quantity.toString().padStart(2, '0')}
                    </div>
                    <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-20 h-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-xl border-l border-zinc-200"
                    >＋</button>
                </div>
                </div>

                {/* カートボタン（合計金額入り） */}
                <div className="pt-2">
                <button 
                    onClick={handleAddToCart}
                    disabled={isSizeRequired && !selectedSize}
                    className={`w-full h-16 font-black italic tracking-[0.4em] uppercase transition-all flex items-center justify-center group relative overflow-hidden border ${
                    isSizeRequired && !selectedSize
                        ? 'bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-red-600 hover:border-red-600 shadow-xl active:scale-[0.98]'
                    }`}
                >
                    <span className="relative z-10 flex items-center gap-4">
                    {isSizeRequired && !selectedSize ? 'Please_Select_Size' : 'Add to Cart'}
                    {!(!selectedSize && isSizeRequired) && (
                        <span className="text-xs opacity-50 border-l border-white/30 pl-4 not-italic tracking-tighter tabular-nums">
                        Total: ¥{Number(product.price * quantity).toLocaleString()}
                        </span>
                    )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </button>
                </div>
            </div>

            {/* 下部ステータス */}
            <div className="mt-auto pt-10 flex justify-between items-center text-[7px] font-mono text-zinc-300 tracking-[0.4em] border-t border-zinc-100">
                <p>TRANSACTION_SECURE: 256_BIT</p>
                <p>OBJ_ID: {id.slice(0, 12).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* --- 下部：商品概要 --- */}
        <div className="border-t border-zinc-200 pt-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center">
                    <span className="w-8 h-[2px] bg-red-600 mr-4"></span>
                    Product Overview
                </h2>
                </div>
                
                <div className="md:col-span-8 space-y-12">
                <div className="text-sm leading-[2] text-zinc-700 font-medium whitespace-pre-wrap">
                    {product.description}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 border-t border-zinc-100 pt-12">
                    {/* 素材がある場合のみ表示 */}
                    {product.material && (
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-zinc-400">Material / 素材</h3>
                        <p className="text-xs font-bold">{product.material}</p>
                    </div>
                    )}

                    {/* 仕様がある場合のみ表示 */}
                    {product.spec && (
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-zinc-400">Spec / 仕様</h3>
                        <p className="text-xs font-bold leading-relaxed whitespace-pre-wrap">{product.spec}</p>
                    </div>
                    )}

                    {/* サイズ詳細(JSON)がある場合のみテーブルを表示 */}
                    {product.size_details && (
                    <div className="sm:col-span-2 pt-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-zinc-400">Size Guide / サイズ表 (cm)</h3>
                        <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] font-bold">
                            <thead>
                            <tr className="border-b border-zinc-100 text-zinc-400 uppercase">
                                <th className="py-2">Size</th>
                                <th className="py-2">Length (着丈)</th>
                                <th className="py-2">Width (身幅)</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 text-zinc-600">
                            {product.size_details.map((item: any, idx: number) => (
                                <tr key={idx}>
                                <td className="py-3">{item.name}</td>
                                <td className="py-3">{item.length}</td>
                                <td className="py-3">{item.width}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
        </div>
      </div>
    </main>
  );
}