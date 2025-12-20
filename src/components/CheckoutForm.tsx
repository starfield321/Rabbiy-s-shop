// src/components/CheckoutForm.tsx
'use client';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // これを真っ先に実行
    console.log("Submit button clicked!"); // ブラウザの検証画面(Console)でこれが出るか確認

    if (!stripe || !elements) {
      console.log("Stripe not loaded");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. PaymentIntent作成APIを叩く
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const { clientSecret } = await res.json();

      // 2. 決済確定
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message ?? '決済エラー');
      } else {
        window.location.href = '/success';
      }
    } catch (err: any) {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-10">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-4">CARD_DETAILS</label>
        {/* カード入力欄を見えやすくするために一時的に高さを出す */}
        <div className="border-b border-zinc-200 py-3">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000',
                fontFamily: 'monospace',
                '::placeholder': { color: '#ccc' },
              },
            }
          }} />
        </div>
      </div>

      {error && <p className="text-red-600 text-[10px] mb-4 font-bold uppercase">{error}</p>}

      <button
        type="submit" // ★ これが抜けていると絶対に反応しません
        disabled={loading || !stripe}
        className="w-full h-16 bg-black text-white font-black italic tracking-[0.4em] uppercase hover:bg-red-600 transition-all flex items-center justify-center"
      >
        <span className={loading ? "animate-pulse" : ""}>
          {loading ? 'PROCESSING...' : 'AUTHORIZE_TRANSACTION_'}
        </span>
      </button>
    </form>
  );
}