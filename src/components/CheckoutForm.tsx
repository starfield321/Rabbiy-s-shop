'use client';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // 1. 以前作ったAPIを呼び出して「支払い意図(PaymentIntent)」を作成
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: cartTotal }),
    });
    
    const { clientSecret } = await res.json();

    // 2. Stripeで決済を実行
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      setError(result.error.message ?? '決済に失敗しました');
      setLoading(false);
    } else {
      // 3. 成功したらSuccessページへ
      window.location.href = '/success';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Card_Details</label>
        <div className="border-b-2 border-zinc-100 py-4 focus-within:border-black transition-colors">
          <CardElement options={{
            style: {
              base: {
                fontSize: '14px',
                fontFamily: 'monospace', // Rabbiy風に等幅フォント
                color: '#000',
                '::placeholder': { color: '#a1a1aa' },
              },
            }
          }} />
        </div>
      </div>

      {error && <p className="text-red-600 text-[10px] font-bold uppercase">{error}</p>}

      <button
        disabled={loading || !stripe}
        className="w-full h-16 bg-black text-white font-black italic tracking-[0.4em] uppercase hover:bg-red-600 transition-all"
      >
        {loading ? 'Processing_Payment...' : 'Authorize_Transaction_'}
      </button>
    </form>
  );
}