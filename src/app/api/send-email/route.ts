import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, totalAmount, items } = await req.json();

    // 注文された商品リストをテキスト化
    const itemsList = items.map((item: any) => 
      `- ${item.name} (QTY: ${item.quantity} / SIZE: ${item.size || 'FREE'})`
    ).join('\n');

    const data = await resend.emails.send({
      from: 'Rabbiy <onboarding@resend.dev>', // 独自ドメイン認証済みならそのアドレス
      // 配列にすることで、お客さんとあなた（管理者）の両方に送ります
      to: [email, 'starfield.business@gmail.com'], 
      subject: `【Rabbiy】新着注文通知 - ${customerName} 様`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="font-style: italic; font-weight: 900;">Rabbiy<span style="color: #dc2626;">.</span></h1>
          
          <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px; border-left: 4px solid #000;">
            <p style="margin: 0; font-size: 12px; font-weight: bold;">ADMIN_NOTIFICATION</p>
            <p style="margin: 5px 0 0 0;">新しい注文が入りました。</p>
          </div>

          <p><strong>顧客名:</strong> ${customerName} 様</p>
          <p><strong>メール:</strong> ${email}</p>
          <hr />
          <h3>注文内容</h3>
          <pre style="font-family: monospace; background: #eee; padding: 10px;">${itemsList}</pre>
          <p><strong>合計金額:</strong> ¥${totalAmount.toLocaleString()}</p>
          <hr />
          <p style="font-size: 10px; color: #888;">System_Status: Order_Confirmed</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Resend Error Detail:", error); // サーバー側のログに詳細が出ます
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}