'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 本来はここで決済処理（Stripe等）を行いますが、
    // 今回は「購入完了」のデモとしてSuccessページへ遷移させます
    router.push('/success');
  };

  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-mono">
        <p className="text-[10px] tracking-[0.5em] text-zinc-400 uppercase">Cart_is_Empty</p>
        <Link href="/products" className="mt-4 underline text-xs">Return to Goods</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* 左側：配送情報入力 */}
        <div className="space-y-12">
          <div className="border-b-4 border-black pb-4">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Shipping_Info.</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">First_Name</label>
                <input required type="text" className="w-full border-b-2 border-zinc-100 p-2 focus:border-black outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Last_Name</label>
                <input required type="text" className="w-full border-b-2 border-zinc-100 p-2 focus:border-black outline-none transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email_Address</label>
              <input required type="email" className="w-full border-b-2 border-zinc-100 p-2 focus:border-black outline-none transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Shipping_Address</label>
              <input required type="text" placeholder="Postal Code" className="w-full border-b-2 border-zinc-100 p-2 focus:border-black outline-none transition-colors" />
              <input required type="text" placeholder="Address" className="w-full border-b-2 border-zinc-100 p-2 focus:border-black outline-none transition-colors mt-2" />
            </div>

            <button type="submit" className="w-full h-16 bg-black text-white font-black italic tracking-[0.4em] uppercase hover:bg-red-600 transition-all mt-8">
              Complete_Order_Protocol
            </button>
          </form>
        </div>

        {/* 右側：注文内容サマリー */}
        <div className="bg-zinc-50 p-8 h-fit border border-zinc-100">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8">Order_Summary</h2>
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm font-bold">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white relative border border-zinc-100">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" unoptimized />
                  </div>
                  <div>
                    <p className="uppercase text-[11px]">{item.name}</p>
                    <p className="text-[9px] text-zinc-400 font-mono">QTY: {item.quantity} / SIZE: {item.size || 'FREE'}</p>
                  </div>
                </div>
                <p className="italic">¥{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-zinc-200 pt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400">
              <span>Subtotal</span>
              <span>¥{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-black mt-4">
              <span className="text-xs font-black uppercase tracking-widest">Total_Payment</span>
              <span className="text-3xl font-black italic tracking-tighter text-red-600">¥{cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}