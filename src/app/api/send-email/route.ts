import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, totalAmount, items } = await req.json();

    // 管理者のメールアドレス（Resendに登録した自分のアドレス）
    const adminEmail = 'starfield.business@gmail.com'; 

    // 注文商品リストの作成
    const itemsList = items.map((item: any) => 
      `<li>${item.name} (QTY: ${item.quantity} / SIZE: ${item.size || 'FREE'}) - ¥${item.price.toLocaleString()}</li>`
    ).join('');

    /**
     * 【重要：Resendのテストモード制限対策】
     * 独自ドメイン認証前は、Resendに登録した自分のアドレス以外には送信できません。
     * 本番公開（ドメイン認証後）は、このロジックをシンプルに [email, adminEmail] に戻してください。
     */
    const recipients = [adminEmail];
    if (email === adminEmail) {
      // 購入者が自分の場合（テスト時など）はそのまま送信
    } else {
      // 購入者が他人の場合、ドメイン認証前はエラーになる可能性があるため
      // ひとまず管理者（自分）にだけ送る、もしくは認証後に制限を解除してください
      console.log(`Note: Customer email ${email} was skipped due to Resend sandbox restrictions.`);
    }

    const data = await resend.emails.send({
      from: 'Rabbiy <onboarding@resend.dev>', // ドメイン認証後は 'info@yourdomain.com' 等に変更可能
      to: recipients,
      subject: `【Rabbiy】ORDER_CONFIRMED: ${customerName} 様`,
      html: `
        <div style="font-family: 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #000; color: #000;">
          <h1 style="font-style: italic; font-weight: 900; font-size: 32px; letter-spacing: -1px; margin-bottom: 20px; border-bottom: 4px solid #000; pb: 10px;">
            Rabbiy<span style="color: #dc2626;">.</span>
          </h1>
          
          <div style="background: #000; color: #fff; padding: 10px 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.2em; margin-bottom: 30px;">
            ORDER_RECEIPT_NOTIFICATION
          </div>

          <p style="font-size: 14px; line-height: 1.6;">
            <strong>CUSTOMER:</strong> ${customerName} 様<br />
            <strong>EMAIL:</strong> ${email}
          </p>

          <div style="margin: 40px 0;">
            <h3 style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #888; border-bottom: 1px solid #eee; padding-bottom: 8px;">Order_Items</h3>
            <ul style="list-style: none; padding: 0; font-size: 14px;">
              ${itemsList}
            </ul>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000;">
            <span style="font-size: 10px; font-weight: bold; letter-spacing: 0.2em;">TOTAL_AMOUNT</span>
            <span style="font-size: 24px; font-weight: 900; font-style: italic; color: #dc2626;">¥${totalAmount.toLocaleString()}</span>
          </div>

          <div style="margin-top: 60px; text-align: center; border-top: 1px solid #eee; pt: 20px;">
            <p style="font-size: 9px; color: #aaa; font-family: monospace; letter-spacing: 0.1em;">
              ENCRYPTED_TRANSACTION_SUCCESSFUL // RABBIY_OFFICIAL_STORE
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Resend API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}