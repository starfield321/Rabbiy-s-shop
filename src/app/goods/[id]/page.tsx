'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, use, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { ChevronRight, Minus, Plus, ShoppingCart, ChevronLeft } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function GoodsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from('goods').select('*').eq('id', id).single();
        if (error) throw error;
        setProduct(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) return (
    <div className="h-screen flex items-center justify-center font-mono text-[10px] animate-pulse uppercase tracking-[0.2em]">
      Loading_Product_Data...
    </div>
  );

  const images = Array.isArray(product.image) && product.image.length > 0 
    ? product.image 
    : [product.image_url || '/placeholder.png'];

  const isSizeRequired = Array.isArray(product.sizes) && product.sizes.length > 0;

  const scrollToImage = (idx: number) => {
    setSelectedImage(idx);
    if (scrollRef.current) {
      const container = scrollRef.current;
      const targetScroll = container.offsetWidth * idx;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const idx = Math.round(container.scrollLeft / container.offsetWidth);
      setSelectedImage(idx);
    }
  };

  const handleAddToCart = () => {
    if (isSizeRequired && !selectedSize) {
      alert("サイズを選択してください。");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      size: selectedSize as string, 
      quantity: quantity,
    });
  };

  return (
    <main className="min-h-screen bg-white pt-24 lg:pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* パンくずリスト */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        {/* ヘッダーデザイン */}
        <div className="relative mb-16 lg:mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Goods<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  Merchandise Detail
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24 lg:mb-32">
          
          {/* 左：スライドギャラリー */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative group bg-zinc-50 border border-zinc-100 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
              
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-square"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((img: string, idx: number) => (
                  <div key={idx} className="min-w-full h-full snap-center relative">
                    <Image 
                      src={img} 
                      alt="" 
                      fill 
                      className="object-contain p-6 transition-transform duration-[1s] ease-out group-hover:scale-105" 
                      unoptimized 
                    />
                  </div>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  {selectedImage > 0 && (
                    <button 
                      onClick={() => scrollToImage(selectedImage - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center border-2 border-black opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white z-20"
                    >
                      <ChevronLeft size={20} strokeWidth={3} />
                    </button>
                  )}
                  {selectedImage < images.length - 1 && (
                    <button 
                      onClick={() => scrollToImage(selectedImage + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center border-2 border-black opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white z-20"
                    >
                      <ChevronRight size={20} strokeWidth={3} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* サムネイル */}
            {images.length > 1 && (
              <div className="relative">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 py-6 px-2">
                  {images.map((img: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => scrollToImage(idx)} 
                      className={`relative w-full aspect-square transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        selectedImage === idx 
                          ? 'border-red-600 border-1 shadow-[0_10px_20px_-5px_rgba(220,38,38,0.3)] scale-105 z-10' 
                          : 'border-zinc-200 opacity-60 hover:opacity-100 hover:border-black'
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-2" unoptimized />
                      {selectedImage === idx && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右：購入コントロール */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-12 border-b-2 border-zinc-100 pb-10">                
              <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-[0.9] break-words uppercase">
                {product.name}
              </h2>
              <div className="mt-6 lg:mt-10 flex items-end gap-4">
                <p className="text-5xl font-black tracking-tighter text-red-600 leading-none">
                  ¥{Number(product.price).toLocaleString()}
                </p>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest italic mb-1">
                  税込
                </span>
              </div>
            </div>

            <div className="space-y-12 font-mono">
              {isSizeRequired && (
                <div className="space-y-6">
                  <label className="text-[11px] font-black tracking-[0.4em] text-black uppercase">Select Size / サイズ選択</label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {product.sizes.map((s: any, idx: number) => {
                      // 文字列でもオブジェクトでもサイズ名を表示できるようにガード
                      const label = typeof s === 'object' ? s.size : s;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedSize(label)}
                          className={`h-12 flex items-center justify-center text-[12px] font-bold transition-all duration-500 border-2 uppercase ${
                            selectedSize === label 
                              ? 'bg-black text-white border-black scale-95' 
                              : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-black hover:text-black'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-6 pt-10 border-t border-zinc-100">
                <label className="text-[11px] font-black tracking-[0.4em] text-black uppercase">Quantity / 数量</label>
                <div className="flex items-center w-full h-16 border-2 border-zinc-200 bg-white focus-within:border-black transition-all mt-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-24 h-full flex items-center justify-center hover:bg-zinc-50 text-2xl font-light">－</button>
                  <div className="flex-1 h-full flex items-center justify-center text-xl font-bold italic tabular-nums">{quantity.toString().padStart(2, '0')}</div>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-24 h-full flex items-center justify-center hover:bg-zinc-50 text-2xl font-light">＋</button>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleAddToCart}
                  disabled={isSizeRequired && !selectedSize}
                  className={`w-full h-20 font-black italic tracking-[0.4em] uppercase transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center group relative overflow-hidden border-2 ${
                  isSizeRequired && !selectedSize
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-300 cursor-not-allowed'
                      : 'bg-black text-white border-black hover:bg-red-600 hover:border-red-600 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none translate-y-0 active:translate-y-1'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-6">
                    <ShoppingCart size={20} className={isSizeRequired && !selectedSize ? 'opacity-20' : 'animate-pulse'} />
                    <span className="text-[13px]">
                      {isSizeRequired && !selectedSize ? 'サイズを選択してください' : 'カートに入れる'}
                    </span>
                    {!(!selectedSize && isSizeRequired) && (
                        <span className="hidden lg:inline text-[11px] opacity-50 border-l border-white/30 pl-6 not-italic tabular-nums font-mono">
                          合計: ¥{Number(product.price * quantity).toLocaleString()}
                        </span>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 下部：商品概要 --- */}
        <div className="border-t-[1px] border-zinc-200 pt-24 lg:pt-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 flex items-start">
              <div className="w-[8px] h-20 bg-red-600 mr-8 flex-shrink-0" />
              <div className="space-y-3 pt-1">
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none text-black">
                  Details<span className="text-red-600 not-italic">.</span>
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 tracking-[0.5em] leading-none font-mono uppercase">Information</p>
              </div>
            </div>
            <div className="md:col-span-8 space-y-16">
              {/* DESCRIPTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-8 bg-red-600"></div>
                  <h3 className="text-sm font-black italic tracking-widest text-zinc-400">Description</h3>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-zinc-800">
                  {product.description}
                </p>
              </div>

              {/* SIZE GUIDE テーブル */}
              {isSizeRequired && (
                <div className="pt-8 border-t border-zinc-100">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-[2px] w-8 bg-red-600"></div>
                      <h3 className="text-sm font-black italic tracking-widest text-zinc-400">
                        Size Guide<span className="text-red-600">.</span>
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[450px]">
                        <thead>
                          <tr className="border-b-2 border-black">
                            <th className="py-4 text-[9px] font-black italic tracking-widest text-zinc-400">Size</th>
                            <th className="py-4 text-[9px] font-black italic tracking-widest text-zinc-400">身丈 (Length)</th>
                            <th className="py-4 text-[9px] font-black italic tracking-widest text-zinc-400">身幅 (Width)</th>
                            <th className="py-4 text-[9px] font-black italic tracking-widest text-zinc-400">肩幅 (Shoulder)</th>
                            <th className="py-4 text-[9px] font-black italic tracking-widest text-zinc-400">袖丈 (Sleeve)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {product.sizes.map((s: any, i: number) => {
                            // 文字列として保存されている場合の最終ガード
                            let obj = s;
                            if (typeof s === 'string') {
                              try { 
                                // 二重にシリアル化されている可能性への対処
                                const cleanStr = s.replace(/\\"/g, '"').replace(/^"/, '').replace(/"$/, '');
                                obj = JSON.parse(cleanStr); 
                              } catch (e) { obj = { size: s }; }
                            }
                            return (
                              <tr key={i} className="group hover:bg-zinc-50 transition-colors font-black italic">
                                <td className="py-4 text-base uppercase">{obj.size || '-'}</td>
                                <td className="py-4 text-xs font-medium text-zinc-500">{obj.length ? `${obj.length} cm` : '-'}</td>
                                <td className="py-4 text-xs font-medium text-zinc-500">{obj.width ? `${obj.width} cm` : '-'}</td>
                                <td className="py-4 text-xs font-medium text-zinc-500">{obj.shoulder ? `${obj.shoulder} cm` : '-'}</td>
                                <td className="py-4 text-xs font-medium text-zinc-500">{obj.sleeve ? `${obj.sleeve} cm` : '-'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[9px] font-bold text-zinc-400 italic">
                      * 全て平置きでの採寸となります。若干の誤差が生じる場合がございます。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}