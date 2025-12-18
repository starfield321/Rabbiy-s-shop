import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any, // 最新のAPIバージョンを使用
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    // Stripe用の商品リストを作成
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'jpy',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price, // すでに税込・円単位
      },
      quantity: item.quantity,
    }));

    // Stripeのチェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success`, // 成功時の戻り先
      cancel_url: `${req.headers.get('origin')}/cart`,    // キャンセル時の戻り先
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}