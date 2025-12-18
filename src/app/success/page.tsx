'use client'; // 状態操作（clearCart）を行うため client に変更

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  // ページが表示された瞬間に1回だけ実行
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-green-100 p-6 animate-bounce">
          <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">Thank you for your order!</h1>
      <p className="text-gray-500 mb-4 text-sm">
        決済が正常に完了しました。ご登録のメールアドレスに領収書をお送りしています。
      </p>
      <p className="text-gray-400 mb-12 text-xs">
        商品の発送準備が整い次第、改めてご連絡いたします。
      </p>
      <Link 
        href="/" 
        className="inline-block bg-black text-white px-10 py-4 font-bold hover:bg-gray-800 transition-all shadow-lg"
      >
        トップページに戻る
      </Link>
    </main>
  );
}