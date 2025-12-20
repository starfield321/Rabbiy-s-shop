import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // 自サイト内決済(Elements)用のPaymentIntentを作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // カートの合計金額
      currency: 'jpy',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}