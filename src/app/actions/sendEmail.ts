'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  try {
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // 独自ドメインがない間はこのまま
      to: 'あなたの受信用メールアドレス@gmail.com', // 自分が受け取りたいアドレス
      subject: `【Website Inquiry】${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}