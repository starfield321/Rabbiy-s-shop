'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // 合計金額の計算
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black mb-6 italic tracking-tighter">YOUR CART IS EMPTY</h1>
        <p className="text-gray-500 mb-10 text-sm">カートに商品が入っていません。</p>
        <Link 
          href="/" 
          className="inline-block bg-black text-white px-10 py-4 font-bold hover:bg-gray-800 transition-all"
        >
          買い物を続ける
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-3xl font-black italic tracking-tighter mb-12 border-b-2 border-black pb-4">
        SHOPPING CART
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 左側：商品リスト */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 md:gap-6 border-b border-gray-100 pb-6 items-center">
              {/* 商品画像 */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-50 flex-shrink-0 border border-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>

              {/* 商品詳細 */}
              <div className="flex-grow">
                <h2 className="text-sm md:text-base font-bold text-gray-900">{item.name}</h2>
                <p className="text-gray-500 text-xs mt-1">数量: {item.quantity}</p>
                <p className="text-red-600 font-bold mt-2 text-sm md:text-base">
                  ¥{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* 削除ボタン */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-gray-400 underline hover:text-red-500 transition-colors"
              >
                削除
              </button>
            </div>
          ))}
        </div>

        {/* 右側：注文サマリー */}
        <div className="bg-gray-50 p-8 h-fit space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest border-b border-gray-200 pb-4">
            Order Summary
          </h2>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">商品合計</span>
            <span className="font-bold">¥{totalPrice.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">配送料</span>
            <span className="text-xs text-gray-400 uppercase">Calculated at checkout</span>
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-between items-end">
            <span className="font-black text-sm">合計（税込）</span>
            <span className="text-2xl font-black text-red-600">¥{totalPrice.toLocaleString()}</span>
          </div>

          <button className="w-full bg-black text-white py-5 font-black hover:bg-gray-800 transition-all shadow-lg tracking-widest uppercase text-sm">
            レジへ進む
          </button>
          
          <p className="text-[10px] text-gray-400 leading-relaxed text-center">
            ※まだ注文は確定されません。<br />
            次の画面で配送先とお支払い情報を入力します。
          </p>
        </div>
      </div>
    </main>
  );
}