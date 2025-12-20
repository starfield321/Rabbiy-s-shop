'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  // cart ではなく cartItems に修正。cartTotal も Context から取得できます
  const { cartItems, removeFromCart, cartTotal } = useCart();

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-12">
          Your_Cart<span className="text-red-600">.</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border-y border-zinc-100">
            <p className="text-zinc-400 font-mono text-[10px] tracking-[0.5em] uppercase">Cart_is_Empty</p>
            <Link href="/products" className="inline-block mt-8 text-xs font-bold underline hover:text-red-600 transition-colors">
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-6 border-b border-zinc-50 pb-8">
                <div className="relative w-24 h-24 bg-zinc-50 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" unoptimized />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-black uppercase tracking-tight">{item.name}</h2>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">SIZE: {item.size || 'FREE'} / QTY: {item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-[9px] font-mono text-red-600 mt-4 uppercase underline tracking-tighter"
                  >
                    Remove_Item
                  </button>
                </div>
                <p className="text-lg font-black italic">¥{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}

            <div className="pt-10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Total_Payment</p>
                <p className="text-4xl font-black italic tracking-tighter">¥{cartTotal.toLocaleString()}</p>
              </div>
              <Link 
                href="/checkout" 
                className="bg-black text-white px-12 h-14 flex items-center justify-center font-black italic uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl"
              >
                Checkout_
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}