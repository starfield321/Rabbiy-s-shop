'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Trash2 } from 'lucide-react';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, updateQuantity } = useCart();

  return (
    <>
      {/* 背景オーバーレイ */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[200] transition-opacity duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* カートパネル本体 */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white z-[201] shadow-[ -20px_0_60px_-15px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full relative">
          
          {/* パネル内装飾 */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
               style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

          {/* ヘッダー：日本語メインに変更 */}
          <div className="relative z-10 p-8 border-b-[10px] border-black flex justify-between items-end bg-white">
            <div>
              <h2 className="text-4xl font-black font-sans italic tracking-tighter leading-none text-black">
                Cart<span className="text-red-600 animate-pulse">.</span>
              </h2>
              <p className="text-[11px] font-bold text-black tracking-[0.2em] mt-4 leading-none">
                現在のカートの中身 <span className="text-zinc-300 font-mono ml-2 tracking-[0.4em]">/ Selected Items</span>
              </p>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="group flex items-center gap-2 text-zinc-300 hover:text-red-600 transition-all duration-300"
            >
              <span className="text-[10px] font-black tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">閉じる</span>
              <X size={24} strokeWidth={3} />
            </button>
          </div>

          {/* アイテムリスト */}
          <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <ShoppingBag size={48} className="text-zinc-100" strokeWidth={1} />
                <p className="text-[10px] font-bold text-zinc-300 tracking-[0.5em] uppercase">カートに商品が入っていません</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-6 group relative border-b border-zinc-100 pb-10 last:border-0">
                  
                  {/* 商品画像 */}
                  <div className="relative w-28 aspect-square bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden shadow-sm">
                    {(() => {
                      let displayImage = "";
                      if (Array.isArray(item.image) && item.image.length > 0) {
                        displayImage = item.image[0];
                      } else if (typeof item.image === 'string') {
                        displayImage = item.image;
                      }

                      return displayImage && displayImage.trim() !== "" ? (
                        <Image 
                          src={displayImage} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-700 ease-out" 
                          unoptimized 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-200 text-[10px] font-mono">NO_IMAGE</div>
                      );
                    })()}
                  </div>                  

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-red-600 transition-colors leading-tight">
                          {item.name}
                        </h3>
                        <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 transition-all rounded-md group/trash"
                        aria-label="削除"
                        >
                        <Trash2 size={18} strokeWidth={2.5} className="group-hover/trash:scale-110 transition-transform" />
                        </button>
                      </div>
                      
                      <div className="mt-5 flex items-center gap-8">
                        {item.size && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-zinc-300 tracking-widest uppercase">サイズ</p>
                            <p className="text-xs font-black font-mono border-b border-red-600/20 pb-1">{item.size}</p>
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-zinc-300 tracking-widest uppercase">数量</p>
                          <div className="flex items-center border border-zinc-200 bg-white">
                            <button onClick={() => updateQuantity(item.id, item.size, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors"><Minus size={12} /></button>
                            <span className="w-8 text-[11px] font-black font-mono text-center tabular-nums">{item.quantity.toString().padStart(2, '0')}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors"><Plus size={12} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-xl font-black italic tracking-tighter text-black">
                      ¥{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* フッター */}
          {cartItems.length > 0 && (
            <div className="relative z-10 p-8 bg-zinc-50 border-t-2 border-zinc-200 space-y-8">
              <div className="flex justify-between items-end border-l-4 border-red-600 pl-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 block leading-none">Total Amount</span>
                  <span className="text-[11px] font-black text-black tracking-[0.1em]">合計金額（税込）</span>
                </div>
                <span className="text-4xl font-black italic tracking-tighter text-red-600 leading-none">
                  ¥{cartTotal.toLocaleString()}
                </span>
              </div>
              
              <Link 
                href="/checkout" 
                onClick={() => setIsCartOpen(false)}
                className="block w-full h-20 bg-black text-white hover:bg-red-600 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center group relative overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]"
              >
                <span className="relative z-10 font-black italic tracking-[0.3em] text-sm flex items-center gap-4">
                  ご購入手続きへ
                  <span className="hidden lg:inline text-[10px] font-bold not-italic tracking-[0.2em] opacity-40 border-l border-white/30 pl-4">Proceed to Checkout</span>
                </span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out" />
              </Link>
              
              <div className="space-y-2 text-center">
                <div className="h-[1px] w-12 bg-zinc-200 mx-auto" />
                <p className="text-[8px] font-bold text-zinc-300 tracking-[0.2em] uppercase">
                  安全な決済システムが適用されています
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}