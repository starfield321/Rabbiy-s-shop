import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any, 
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    // 1. 商品リストの作成
    const lineItems = items.map((item: any) => {
      // 画像URLがカンマ区切りの文字列だった場合に備え、1枚目だけを抽出
      const firstImage = typeof item.image === 'string' 
        ? item.image.split(',')[0].trim() 
        : item.image;

      return {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: item.name,
            images: firstImage ? [firstImage] : [],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      };
    });

    // 2. 送料項目（全国一律 850円）をラインアイテムの最後に追加
    lineItems.push({
      price_data: {
        currency: 'jpy',
        product_data: {
          name: '送料 (全国一律)',
          description: 'Standard Shipping Fee',
        },
        unit_amount: 850, // 850円
      },
      quantity: 1,
    });

    // 3. Stripeのチェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // success_url と cancel_url を現在のアプリのパス構造に合わせて調整
      success_url: `${req.headers.get('origin')}/checkout/success`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      // 配送先住所をStripe側で入力させる場合は以下を有効にできます
      shipping_address_collection: {
        allowed_countries: ['JP'],
      },
      shipping_options: [
        {
          shipping_rate: 'shr_1SrKLBPBweQ46o8tokrfp7iE', // ここに 850円で作成した ID を貼り付け
        },
      ]
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}