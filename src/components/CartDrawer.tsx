'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* 背景オーバーレイ */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-500 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* カートパネル本体 */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[201] shadow-2xl transition-transform duration-500 ease-in-out transform ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          
          {/* ヘッダー：システムチックな装飾 */}
          <div className="p-6 border-b-4 border-black flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter">CART_LIST.</h2>
              <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-1">Status: Secure_Connection</p>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="group p-2">
              <span className="text-xs font-black uppercase tracking-widest group-hover:text-red-600 transition-colors">Close[×]</span>
            </button>
          </div>

          {/* カートアイテムリスト */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-300">
                <p className="font-mono text-[10px] tracking-[0.5em] uppercase">No_Items_Found</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 group relative">
                  <div className="relative w-24 aspect-square bg-zinc-50 border border-zinc-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" unoptimized />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-tight group-hover:text-red-600 transition-colors">{item.name}</h3>
                      <div className="flex gap-4 mt-1">
                        {item.size && <p className="text-[9px] font-mono text-zinc-400 underline decoration-red-600/30">SIZE: {item.size}</p>}
                        <p className="text-[9px] font-mono text-zinc-400 tracking-tighter uppercase">QTY: {item.quantity.toString().padStart(2, '0')}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black tracking-tighter italic">¥{item.price.toLocaleString()}</p>
                  </div>
                  {/* 削除ボタン */}
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-[9px] font-mono text-zinc-300 hover:text-red-600 uppercase tracking-tighter underline pt-1"
                  >Remove</button>
                </div>
              ))
            )}
          </div>

          {/* フッター：合計と決済 */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Total_Amount</span>
                <span className="text-3xl font-black italic tracking-tighter text-red-600">¥{cartTotal.toLocaleString()}</span>
              </div>
              
              <Link href="/checkout" className="block w-full h-16 bg-black text-white hover:bg-red-600 transition-all flex items-center justify-center group relative overflow-hidden shadow-xl">
                <span className="relative z-10 font-black italic tracking-[0.4em] uppercase text-sm">Proceed to Checkout_</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </Link>
              
              <p className="text-[7px] font-mono text-zinc-400 text-center tracking-widest leading-relaxed">
                ENCRYPTED_TRANSACTION_ESTABLISHED // RABBIY_SECURE_PAY
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}