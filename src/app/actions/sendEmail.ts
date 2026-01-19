'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string || 'お客様'; 
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    // 1. 管理者（あなた）への通知メール
    const adminEmail = resend.emails.send({
      from: 'Rabbiy Support <rabbiy@dotcreation.jp>',
      to: 'rabbiy@dotcreation.jp',
      subject: `【ショップに関するお問い合わせ】${name} 様より`,
      html: `
        <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #000; border-bottom: 2px solid #dc2626;">お問い合わせを受信しました</h2>
          <p><strong>名前:</strong> ${name}</p>
          <p><strong>メールアドレス:</strong> ${email}</p>
          <p><strong>お問い合わせ内容:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // 2. お客様への自動返信メール
    const customerEmail = resend.emails.send({
      from: 'Rabbiy Store <rabbiy@dotcreation.jp>', //
      to: email, // フォームに入力されたお客様のアドレス宛
      subject: `【Rabbiy Store】お問い合わせを受け付けました`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="font-size: 24px; color: #000;">お問い合わせいただきありがとうございます</h1>
          <p>${name} 様</p>
          <p>この度は Rabbiy Store へお問い合わせいただき、誠にありがとうございます。</p>
          <p>内容を確認し、担当者より折り返しご連絡いたします。今しばらくお待ちくださいませ。</p>
          
          <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="font-size: 12px; color: #666; margin-bottom: 10px;">ご入力内容：</p>
            <p style="font-size: 14px; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            ※本メールは自動送信専用です。心当たりがない場合は破棄してください。<br />
            Rabbiy / dot. CREATION JPN
          </p>
        </div>
      `,
    });

    // 両方のメール送信が完了するのを待つ
    const results = await Promise.all([adminEmail, customerEmail]);

    // いずれかでエラーが出ていないか確認
    if (results.some(res => res.error)) {
      return { success: false, error: 'Failed to send one or more emails.' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}