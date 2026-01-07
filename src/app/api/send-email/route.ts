import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, totalAmount, items, address, orderId } = await req.json();

    // ★管理者（あなた）のメールアドレス
    const adminEmail = 'starfield.business@gmail.com'; 

    const itemsList = items.map((item: any) => 
      `<li style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 13px; font-weight: bold; color: #000;">
          ${item.name} <span style="font-size: 11px; color: #71717a; margin-left: 8px;">(x${item.quantity}${item.size ? ` / ${item.size}` : ''})</span>
        </span>
        <span style="font-size: 13px; font-weight: 900; font-family: monospace;">¥${(item.price * item.quantity).toLocaleString()}</span>
      </li>`
    ).join('');

    // 送信先に「お客様」と「自分」の両方を指定
    const recipients = [email, adminEmail];

    const { data, error } = await resend.emails.send({
      // 独自ドメイン info@rabbiy.jp を使用
      from: 'Rabbiy <info@rabbiy.jp>', 
      to: recipients,
      subject: `【Rabbiy】ORDER_CONFIRMED: ${orderId}`,
      html: `
        <div style="font-family: 'Helvetica', sans-serif; background-color: #ffffff; color: #000000; padding: 40px; max-width: 600px; margin: auto; border: 10px solid #000000;">
          <div style="margin-bottom: 40px;">
            <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5em; color: #a1a1aa; margin-bottom: 5px;">Order_Receipt_v2.5</p>
            <h1 style="font-size: 56px; font-weight: 900; font-style: italic; letter-spacing: -3px; text-transform: uppercase; line-height: 0.8; margin: 0;">
              Confirmed<span style="color: #dc2626;">.</span>
            </h1>
          </div>
          
          <div style="border-left: 8px solid #dc2626; padding-left: 20px; margin-bottom: 40px;">
            <p style="font-size: 14px; font-weight: 900; text-transform: uppercase;">
              Thank you, ${customerName} 様
            </p>
            <p style="font-size: 11px; font-weight: bold; color: #71717a; margin-top: 5px; line-height: 1.6;">
              Rabbiyでのご注文を承りました。<br/>
              現在、オンデマンド生産の準備段階に入っております。
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="font-size: 10px; font-weight: 900; color: #a1a1aa; text-transform: uppercase; border-bottom: 1px solid #f4f4f5; padding-bottom: 5px;">Transaction_Detail</p>
            <p style="font-size: 14px; font-weight: 900; font-family: monospace; margin-top: 10px;">ID: #${orderId}</p>
          </div>

          <div style="margin-bottom: 40px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${itemsList}
            </ul>
          </div>

          <div style="background-color: #f4f4f5; padding: 25px; margin-bottom: 40px;">
            <p style="font-size: 10px; font-weight: 900; color: #a1a1aa; text-transform: uppercase; margin-bottom: 8px;">Shipping_To</p>
            <p style="font-size: 12px; font-weight: 900; line-height: 1.6;">${address}</p>
          </div>

          <div style="text-align: right; border-top: 6px solid #000; padding-top: 25px;">
            <p style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #a1a1aa; letter-spacing: 2px;">Total_Paid</p>
            <p style="font-size: 42px; font-weight: 900; font-style: italic; color: #dc2626; margin: 0;">¥${totalAmount.toLocaleString()}</p>
          </div>

          <div style="margin-top: 50px; text-align: center; border-top: 1px solid #f4f4f5; padding-top: 30px;">
            <p style="font-size: 10px; font-weight: bold; color: #71717a; margin-bottom: 15px;">
              ご不明な点は、以下の公式ターミナルよりご連絡ください。
            </p>
            <a href="https://rabbiy.jp/contact" style="display: inline-block; background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">
              Contact_Support_
            </a>
          </div>

          <p style="font-size: 8px; font-family: monospace; color: #d4d4d8; text-align: center; margin-top: 40px; letter-spacing: 2px;">
            AUTHORIZED_TRANSACTION // RABBIY_OFFICIAL_STORE
          </p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}