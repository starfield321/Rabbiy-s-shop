'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ChevronLeft } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function CartPage() {
  const { cartItems, removeFromCart, cartTotal, updateQuantity } = useCart();
  
  // 固定送料の設定（例: 全国一律 ¥800）
  const SHIPPING_FEE = 850;
  const finalTotal = cartTotal + SHIPPING_FEE;

  return (
    <main className="min-h-screen bg-white pt-24 lg:pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* ヘッダーデザイン：最新のトンマナ */}
        <div className="relative mb-16 lg:mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              In Cart<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  Purchase Queue
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-zinc-100 bg-zinc-50/30">
            <p className="text-zinc-300 font-bold text-[10px] tracking-[0.5em] uppercase italic">Your_Cart_Is_Empty</p>
            <Link 
              href="/goods" 
              className="inline-flex items-center gap-4 mt-12 border-2 border-black px-12 py-6 font-black italic text-sm hover:bg-black hover:text-white transition-all duration-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <ChevronLeft size={18} />
              お買い物を続ける
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            
            {/* 左カラム：アイテムリスト */}
            <div className="lg:col-span-7 space-y-16">
              <div className="space-y-12">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex flex-col md:flex-row gap-10 border-b border-zinc-100 pb-12 last:border-0 group">
                    <div className="relative w-40 h-40 bg-zinc-50 shrink-0 border-2 border-zinc-100 overflow-hidden shadow-sm transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1">
                      <Image 
                        src={Array.isArray(item.image) ? item.image[0] : item.image} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-4 transition-transform duration-1000 group-hover:scale-110" 
                        unoptimized 
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h2 className="text-2xl font-black italic tracking-tighter leading-tight group-hover:text-red-600 transition-colors duration-500 uppercase">
                            {item.name}
                          </h2>
                          <p className="text-3xl font-black italic tracking-tighter tabular-nums">
                            ¥{item.price.toLocaleString()}
                          </p>
                        </div>
                        {item.size && (
                          <div className="inline-block border-b border-red-600/30 pb-1">
                            <span className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase italic">Size: </span>
                            <span className="text-xs font-black font-mono uppercase tracking-tighter">{item.size}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-10">
                        {/* 数量選択UIの統合修正 */}
                        <div className="flex items-center w-48 h-12 border-2 border-zinc-200 bg-white focus-within:border-black transition-all group/qty">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            className="w-14 h-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-xl font-light border-zinc-100"
                          >
                            <Minus size={16} />
                          </button>
                          <div className="flex-1 h-full flex items-center justify-center font-mono text-lg font-bold italic tabular-nums">
                            {item.quantity.toString().padStart(2, '0')}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            className="w-14 h-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-xl font-light border-zinc-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* 削除ボタン */}
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="flex items-center gap-3 text-[10px] font-black text-zinc-300 hover:text-red-600 transition-all duration-500 tracking-widest italic group/trash"
                        >
                          <Trash2 size={16} className="text-red-600 group-hover/trash:scale-125 transition-transform duration-500 shadow-[0_4px_10px_rgba(220,38,38,0.1)]" />
                          <span className="transition-colors uppercase">削除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Link href="/goods" className="inline-flex items-center gap-3 text-[11px] font-black text-zinc-400 italic hover:text-black transition-all group">
                  <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                  Shopping Continue / お買い物を続ける
                </Link>
              </div>
            </div>

            {/* --- 右カラム：サマリー (送料込み) --- */}
            <div className="lg:col-span-5 lg:sticky lg:top-40">
              <div className="border border-black px-6 py-10 md:p-10 bg-white">
                <div className="flex items-start mb-12">
                  <div className="w-[8px] h-20 bg-red-600 mr-6 flex-shrink-0" />
                  <div className="space-y-3 pt-1">
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">Summary</h2>
                    <p className="text-[10px] font-bold text-zinc-400 tracking-[0.4em] uppercase leading-none font-mono tracking-widest">注文内容の確認</p>
                  </div>
                </div>

                <div className="space-y-8 mb-12 font-mono px-2">
                  <div className="flex justify-between items-center text-sm font-bold italic text-zinc-400 tracking-widest">
                    <span>Item Total /<br className="inline-block md:hidden"></br> 商品合計</span>
                    <span className="tabular-nums text-black font-black font-['Geist'] italic">¥{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold italic text-zinc-400 tracking-widest">
                    <span>Shipping / 送料</span>
                    <span className="tabular-nums text-black font-black font-['Geist'] italic">¥{SHIPPING_FEE.toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-zinc-300 italic tracking-[0.1em] leading-relaxed uppercase">
                      ※ 全国一律送料が適用されています
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-zinc-100 pt-10 mb-12">
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-y-4 md:gap-y-0 pl-2 pr-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black italic tracking-[0.4em] text-zinc-300 block leading-none">Final Total</span>
                      <span className="text-[11px] font-black text-black tracking-[0.1em]">合計金額（税込）</span>
                    </div>
                    <span className="text-5xl md:text-6xl font-black italic text-red-600 leading-none tabular-nums tracking-tighter font-['Geist']">
                      ¥{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full h-24 bg-black text-white font-black italic tracking-[0.3em] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center group relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-none hover:bg-red-600 active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center gap-6 text-xl">
                    ご購入手続きへ
                    <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out" />
                </Link>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </main>
  );
}