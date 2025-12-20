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
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message ?? '決済エラー');
        setLoading(false);
      } else {
        window.location.href = '/success';
      }
    } catch (err) {
      setError("通信エラー");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* 配送先入力欄をここ（Form内）に移動 */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-l-2 border-black pl-4">SHIPPING_DESTINATION</h2>
        <div className="grid grid-cols-2 gap-6">
          <input required placeholder="First Name" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
          <input required placeholder="Last Name" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
        </div>
        <input required placeholder="Email Address" type="email" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
        <input required placeholder="Shipping Address" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
      </div>

      {/* 決済入力欄 */}
      <div className="pt-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-l-2 border-red-600 pl-4 mb-6">PAYMENT_METHOD</h2>
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-2">CARD_DETAILS</label>
        <div className="border-b border-zinc-200 py-3 min-h-[40px]">
          <CardElement options={{
            style: {
              base: { fontSize: '16px', color: '#000', fontFamily: 'monospace', '::placeholder': { color: '#ccc' } },
            }
          }} />
        </div>
      </div>

      {error && <p className="text-red-600 text-[10px] font-bold uppercase">{error}</p>}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full h-16 bg-black text-white font-black italic tracking-[0.4em] uppercase hover:bg-red-600 transition-all flex items-center justify-center"
      >
        {loading ? 'PROCESSING...' : 'AUTHORIZE_TRANSACTION_'}
      </button>
    </form>
  );
}