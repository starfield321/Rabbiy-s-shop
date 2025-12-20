'use client';

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
  const { cartTotal, cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stripe入力欄の共通デザイン設定
  const elementOptions = {
    style: {
      base: {
        fontSize: '14px',
        color: '#000',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        '::placeholder': { color: '#ccc' },
      },
      invalid: {
        color: '#dc2626',
      },
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // フォームデータの取得
    const formData = new FormData(e.currentTarget);
    const customerInfo = {
      firstName: formData.get('first_name') as string,
      lastName: formData.get('last_name') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
    };

    try {
      // 1. PaymentIntentの作成（サーバーAPI呼び出し）
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const { clientSecret, error: apiError } = await res.json();
      
      if (apiError) throw new Error(apiError);

      // 2. Stripeで決済確定
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
          }
        },
      });

      if (result.error) {
        setError(result.error.message ?? '決済に失敗しました');
        setLoading(false);
      } else if (result.paymentIntent?.status === 'succeeded') {
        
        // 3. 決済成功後、Resendを使用してメールを送信
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: customerInfo.email,
              customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
              totalAmount: cartTotal,
              items: cartItems,
            }),
          });
        } catch (mailErr) {
          console.error('Mail sending failed:', mailErr);
          // メール送信に失敗しても決済は完了しているため、リダイレクトは続行します
        }

        // 4. 成功ページへ遷移
        window.location.href = '/success';
      }
    } catch (err: any) {
      setError(err.message || "通信エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      
      {/* SHIPPING_DESTINATION */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-l-2 border-black pl-4">SHIPPING_DESTINATION</h2>
        <div className="grid grid-cols-2 gap-6">
          <input required name="first_name" placeholder="First Name" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm transition-colors" />
          <input required name="last_name" placeholder="Last Name" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm transition-colors" />
        </div>
        <input required name="email" placeholder="Email Address" type="email" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm transition-colors" />
        <input required name="address" placeholder="Shipping Address" type="text" className="w-full border-b border-zinc-200 p-2 focus:border-black outline-none font-medium text-sm transition-colors" />
      </div>

      {/* PAYMENT_METHOD */}
      <div className="pt-6 space-y-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-l-2 border-red-600 pl-4 mb-8">PAYMENT_METHOD</h2>
        
        {/* カード番号 */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">CARD_NUMBER</label>
          <div className="border-b border-zinc-200 py-3 focus-within:border-black transition-colors">
            <CardNumberElement options={elementOptions} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          {/* 有効期限 */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">EXPIRY_DATE</label>
            <div className="border-b border-zinc-200 py-3 focus-within:border-black transition-colors">
              <CardExpiryElement options={elementOptions} />
            </div>
          </div>
          {/* CVC */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">CVC_CODE</label>
            <div className="border-b border-zinc-200 py-3 focus-within:border-black transition-colors">
              <CardCvcElement options={elementOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="p-4 bg-red-50 border-l-2 border-red-600">
          <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* 決済実行ボタン */}
      <button
        type="submit"
        disabled={loading || !stripe}
        className={`w-full h-16 font-black italic tracking-[0.4em] uppercase transition-all flex items-center justify-center group ${
          loading ? 'bg-zinc-100 text-zinc-400' : 'bg-black text-white hover:bg-red-600'
        }`}
      >
        <span className={loading ? "animate-pulse" : "group-hover:skew-x-[-10deg] transition-transform"}>
          {loading ? 'PROCESSING_DATA...' : 'AUTHORIZE_TRANSACTION_'}
        </span>
      </button>
    </form>
  );
}