'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  // --- Stripe決済実行関数 ---
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信を防止
    setLoading(true);

    try {
      // 以前作成した api/checkout/route.ts を呼び出す
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }), // カートの中身をStripe用APIに送る
      });

      const data = await response.json();

      if (data.url) {
        // Stripeの安全な決済ページへリダイレクト
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('決済セッションの作成に失敗しました。');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('通信エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  // カートが空の場合の表示
  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-mono bg-white px-6">
        <p className="text-[10px] tracking-[0.5em] text-zinc-400 uppercase animate-pulse">Cart_is_Empty</p>
        <Link href="/products" className="mt-8 text-xs font-black italic border-b border-black pb-1 hover:text-red-600 hover:border-red-600 transition-colors">
          RETURN_TO_GOODS_INDEX
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* 左側：配送情報入力（デザイン維持） */}
        <div className="space-y-12">
          <div className="border-b-4 border-black pb-4">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Shipping_Info<span className="text-red-600">.</span></h1>
          </div>
          
          <form onSubmit={handleStripeCheckout} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">First_Name</label>
                <input required type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none transition-colors font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Last_Name</label>
                <input required type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none transition-colors font-medium text-sm" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Email_Address</label>
              <input required type="email" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none transition-colors font-medium text-sm" />
            </div>

            <div className="space-y-2 pb-6">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Shipping_Address</label>
              <input required type="text" placeholder="Postal Code" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none transition-colors font-medium text-sm" />
              <input required type="text" placeholder="Address" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none transition-colors font-medium text-sm mt-4" />
            </div>

            {/* 本物の決済へ繋がるボタン */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full h-16 font-black italic tracking-[0.4em] uppercase transition-all relative overflow-hidden ${
                loading ? 'bg-zinc-100 text-zinc-400' : 'bg-black text-white hover:bg-red-600'
              }`}
            >
              <span className="relative z-10">
                {loading ? 'Processing_Data...' : 'Complete_Order_Protocol'}
              </span>
              {/* ローディングアニメーション（オプション） */}
              {loading && (
                <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
              )}
            </button>
            <p className="text-[8px] font-mono text-zinc-400 text-center tracking-widest mt-4">
              SECURE_STRIPE_CONNECTION_ESTABLISHED
            </p>
          </form>
        </div>

        {/* 右側：注文サマリー（デザイン維持） */}
        <div className="bg-zinc-50 p-10 h-fit border border-zinc-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 select-none pointer-events-none">
             <span className="text-6xl font-black italic tracking-tighter">ORDER</span>
          </div>
          
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-10 border-l-2 border-red-600 pl-4">Order_Summary</h2>
          
          <div className="space-y-8 mb-10">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between items-center group">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-white relative border border-zinc-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" unoptimized />
                  </div>
                  <div>
                    <p className="font-black uppercase text-[12px] tracking-tight group-hover:text-red-600 transition-colors">{item.name}</p>
                    <p className="text-[9px] text-zinc-400 font-mono mt-0.5 tracking-tighter">QTY: {item.quantity} / SIZE: {item.size || 'FREE'}</p>
                  </div>
                </div>
                <p className="font-black italic text-sm tabular-nums">¥{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-zinc-200 pt-8 space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span>Subtotal</span>
              <span className="tabular-nums">¥{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span>Shipping_Fee</span>
              <span>FREE_DELIVERY</span>
            </div>
            <div className="flex justify-between items-end pt-6 border-t-2 border-black mt-6">
              <span className="text-xs font-black uppercase tracking-[0.3em]">Total_Amount</span>
              <span className="text-4xl font-black italic tracking-tighter text-red-600 tabular-nums">¥{cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}