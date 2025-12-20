import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, totalAmount, items } = await req.json();

    const data = await resend.emails.send({
      from: 'Rabbiy <onboarding@resend.dev>', // 認証済みドメインがある場合はそれに書き換え
      to: [email],
      subject: '【Rabbiy】ご注文ありがとうございます',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h1 style="font-style: italic; font-weight: 900; letter-spacing: -2px;">Rabbiy<span style="color: #dc2626;">.</span></h1>
          <p>${customerName} 様</p>
          <p>この度はご注文いただき誠にありがとうございます。</p>
          <hr />
          <h3>注文内容</h3>
          <p>合計金額: ¥${totalAmount.toLocaleString()}</p>
          <p>発送準備が整い次第、改めてご連絡いたします。</p>
          <hr />
          <p style="font-size: 12px; color: #888;">本メールは自動送信されています。</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}