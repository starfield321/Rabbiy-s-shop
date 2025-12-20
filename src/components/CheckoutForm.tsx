'use client';

// 個別のパーツをインポート
import { 
  useStripe, 
  useElements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement 
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 共通のスタイル設定
  const elementOptions = {
    style: {
      base: {
        fontSize: '14px',
        color: '#000',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        '::placeholder': { color: '#ccc' },
      },
      invalid: { color: '#dc2626' },
    }
  };

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
          // CardNumberElement を指定すれば、自動で他のパーツ（期限・CVC）も参照されます
          card: elements.getElement(CardNumberElement)!,
        },
      });

      if (result.paymentIntent?.status === 'succeeded') {
        // --- ここでメール送信APIを呼び出す ---
        await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email: (document.getElementsByName('email')[0] as HTMLInputElement).value,
            customerName: (document.getElementsByName('first_name')[0] as HTMLInputElement).value,
            totalAmount: cartTotal,
            }),
        });

        window.location.href = '/success';
      }

      if (result.error) {
        setError(result.error.message ?? '決済エラー');
        setLoading(false);
      } else {
        window.location.href = '/success';
      }
    } catch (err) {
      setError("通信エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      
      {/* --- SHIPPING_DESTINATION (デザイン維持) --- */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-l-2 border-black pl-4">SHIPPING_DESTINATION</h2>
        <div className="grid grid-cols-2 gap-6">
          <input required placeholder="First Name" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
          <input required placeholder="Last Name" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
        </div>
        <input required placeholder="Email Address" type="email" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
        <input required placeholder="Shipping Address" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm" />
      </div>

      {/* --- PAYMENT_METHOD (分割レイアウト) --- */}
      <div className="pt-6 space-y-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-l-2 border-red-600 pl-4 mb-8">PAYMENT_METHOD</h2>
        
        {/* カード番号 */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">CARD_NUMBER</label>
          <div className="border-b border-zinc-200 py-3">
            <CardNumberElement options={elementOptions} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          {/* 有効期限 */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">EXPIRY_DATE</label>
            <div className="border-b border-zinc-200 py-3">
              <CardExpiryElement options={elementOptions} />
            </div>
          </div>
          {/* CVC */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">CVC_CODE</label>
            <div className="border-b border-zinc-200 py-3">
              <CardCvcElement options={elementOptions} />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-[10px] font-bold uppercase animate-bounce">{error}</p>}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full h-16 bg-black text-white font-black italic tracking-[0.4em] uppercase hover:bg-red-600 transition-all flex items-center justify-center group"
      >
        <span className={loading ? "animate-pulse" : "group-hover:skew-x-[-10deg] transition-transform"}>
          {loading ? 'PROCESSING...' : 'AUTHORIZE_TRANSACTION_'}
        </span>
      </button>
    </form>
  );
}