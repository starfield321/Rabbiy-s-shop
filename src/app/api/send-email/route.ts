import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, totalAmount, items, address, orderId } = await req.json();

    // ★管理者（あなた）のメールアドレス
    const adminEmail = 'starfield.business@gmail.com'; 

    const itemsList = items.map((item: any) => 
      `<li style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; display: flex; justify-content: space-between;">
        <span>${item.name} (x${item.quantity}${item.size ? ` / ${item.size}` : ''})</span>
        <span style="font-weight: bold;">¥${(item.price * item.quantity).toLocaleString()}</span>
      </li>`
    ).join('');

    // ★送信先に「お客様」と「自分」の両方を指定
    const recipients = [email, adminEmail];

    const { data, error } = await resend.emails.send({
      from: 'Rabbiy <onboarding@resend.dev>', // ドメイン取得後は変更可能
      to: recipients,
      subject: `【Rabbiy】ORDER_CONFIRMED: ${orderId}`,
      html: `
        <div style="font-family: 'Helvetica', sans-serif; background-color: #ffffff; color: #000000; padding: 40px; max-width: 600px; margin: auto; border: 10px solid #000000;">
          <h1 style="font-size: 48px; font-weight: 900; font-style: italic; letter-spacing: -2px; text-transform: uppercase; line-height: 0.9; margin-bottom: 30px;">
            Order<br/>Confirmed<span style="color: #dc2626;">.</span>
          </h1>
          
          <div style="background-color: #000; color: #fff; padding: 5px 10px; font-size: 10px; font-weight: 900; display: inline-block; margin-bottom: 20px;">
            OFFICIAL_RECEIPT_NOTIFICATION
          </div>

          <p style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
            Customer: ${customerName} 様
          </p>

          <div style="margin-bottom: 30px;">
            <p style="font-size: 10px; font-weight: 900; color: #a1a1aa; text-transform: uppercase; margin-bottom: 5px;">Order_ID</p>
            <p style="font-size: 16px; font-weight: 900; font-family: monospace;">#${orderId}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="font-size: 10px; font-weight: 900; color: #a1a1aa; text-transform: uppercase; margin-bottom: 10px;">Purchased_Items</p>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${itemsList}
            </ul>
          </div>

          <div style="background-color: #f4f4f5; padding: 20px; margin-bottom: 30px;">
            <p style="font-size: 10px; font-weight: 900; color: #a1a1aa; text-transform: uppercase; margin-bottom: 5px;">Shipping_Address</p>
            <p style="font-size: 12px; font-weight: 900; text-transform: uppercase;">${address}</p>
          </div>

          <div style="text-align: right; border-top: 4px solid #000; padding-top: 20px;">
            <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #a1a1aa;">Total_Amount</p>
            <p style="font-size: 32px; font-weight: 900; font-style: italic; color: #dc2626;">¥${totalAmount.toLocaleString()}</p>
          </div>

          <p style="font-size: 8px; font-family: monospace; color: #d4d4d8; text-align: center; margin-top: 40px; letter-spacing: 1px;">
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