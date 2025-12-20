'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function SuccessPage() {
  const { cartItems } = useCart();

  // 本来はここでカートをクリアする処理を入れるのが一般的です
  
  return (
    <main className="h-screen flex items-center justify-center bg-white px-6 text-center">
      <div className="space-y-8">
        <div className="w-20 h-20 border-4 border-black flex items-center justify-center mx-auto mb-10 relative">
          <div className="w-10 h-[4px] bg-red-600 rotate-45 translate-x-1 translate-y-1"></div>
          <div className="w-5 h-[4px] bg-red-600 -rotate-45 -translate-x-3 translate-y-2 absolute"></div>
        </div>
        
        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
          Order_Received<span className="text-red-600">.</span>
        </h1>
        
        <p className="text-xs font-medium text-zinc-500 max-w-sm mx-auto leading-relaxed">
          ご注文が正常に完了しました。確認メールを送信しましたので、内容をご確認ください。
        </p>

        <Link href="/products" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.5em] border-b-2 border-black pb-1 hover:text-red-600 hover:border-red-600 transition-all">
          Continue_to_Goods_Index
        </Link>
      </div>
    </main>
  );
}