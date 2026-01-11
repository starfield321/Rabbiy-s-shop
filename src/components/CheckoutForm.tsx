'use client';

import React, { useState } from 'react';
import { 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowRight } from 'lucide-react';

interface CheckoutFormProps {
  initialEmail: string;
  initialName: string;
  initialPhone: string;
  initialPostalCode: string;
  initialAddress: string;
}

export default function CheckoutForm({ 
  initialEmail, 
  initialName,
  initialPhone,
  initialPostalCode,
  initialAddress
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const SHIPPING_FEE = 850;
  const finalAmount = cartTotal + SHIPPING_FEE;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const intentData = await response.json();
      if (intentData.error) throw new Error(intentData.error);

      const cardNumberElement = elements.getElement(CardNumberElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: cardNumberElement!,
          billing_details: {
            name: initialName,
            email: initialEmail,
            phone: initialPhone,
          },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent?.status === 'succeeded') {
        const orderId = `ORD-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
        
        const { error: supabaseError } = await supabase
          .from('orders')
          .insert([{
            customer_name: initialName,
            email: initialEmail,
            phone: initialPhone,
            total_amount: finalAmount, 
            items: cartItems,
            address: `〒${initialPostalCode} ${initialAddress}`,
            status: 'paid',
            stripe_payment_id: paymentIntent.id,
            user_id: '39bfee29-e299-4174-ac74-d99c284c53ac'
          }]);

        if (supabaseError) throw new Error("注文は完了しましたが、データベースへの保存に失敗しました。");

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: initialEmail,
            customerName: initialName,
            totalAmount: finalAmount,
            items: cartItems,
            address: `〒${initialPostalCode} ${initialAddress}`,
            orderId
          }),
        });

        clearCart();
        router.push('/checkout/success');
      }
    } catch (err: any) {
      setErrorMessage(err.message || "予期せぬエラーが発生しました。");
      setIsProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '18px',
        color: '#000',
        fontWeight: '700',
        fontFamily: 'Geist, sans-serif',
        '::placeholder': { color: '#d1d1d6' },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      <section className="space-y-12">
        {/* 見出し：赤いラベル付きデザイン */}
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white px-4 py-2 font-black italic text-sm tracking-tighter">
            Step 02
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter border-b-4 border-black pr-6">
            お支払い方法
          </h2>
        </div>

        {/* 入力エリア：下線ベースに統一 */}
        <div className="space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black italic text-zinc-400 uppercase tracking-[0.2em]">カード番号</label>
            <div className="border-b-2 border-black py-4 bg-transparent focus-within:border-red-600 transition-colors">
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black italic text-zinc-400 uppercase tracking-[0.2em]">有効期限</label>
              <div className="border-b-2 border-black py-4 bg-transparent focus-within:border-red-600 transition-colors">
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black italic text-zinc-400 uppercase tracking-[0.2em]">セキュリティコード (CVC)</label>
              <div className="border-b-2 border-black py-4 bg-transparent focus-within:border-red-600 transition-colors">
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 確定ボタン：光のスイープエフェクト & 文言変更 */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className={`w-full h-20 font-black italic tracking-[0.3em] transition-all flex items-center justify-center group relative overflow-hidden border-2 border-black bg-black text-white
            ${isProcessing 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-red-600 hover:border-red-600 shadow-xl active:scale-[0.98]'
            }`}
        >
          <span className="relative z-10 flex items-center gap-4 text-2xl font-['Geist',_'Geist_Fallback']">
            {isProcessing ? (
              '処理中...'
            ) : (
              <>
                注文を確定
                <span className="hidden lg:inline text-sm opacity-50 border-l border-white/30 pl-4 not-italic tracking-tighter tabular-nums font-bold">
                  ¥{finalAmount.toLocaleString()}
                </span>
              </>
            )}
          </span>

          {/* 光が走るアニメーション (Sweep Effect) */}
          {!isProcessing && (
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="border-2 border-red-600 p-6 bg-red-50 text-red-600">
          <p className="text-xs font-black uppercase tracking-widest flex items-center gap-3 italic">
            <span className="bg-red-600 text-white px-2 py-0.5 not-italic">ERROR</span>
            {errorMessage}
          </p>
        </div>
      )}
    </form>
  );
}