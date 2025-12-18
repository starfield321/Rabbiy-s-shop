'use client';

import { useState } from 'react';
import { sendEmail } from '@/app/actions/sendEmail';

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSending(true);
    const result = await sendEmail(formData);
    setIsSending(false);
    
    if (result.success) {
      setIsSent(true);
    } else {
      alert('エラーが発生しました。時間を置いて再度お試しください。');
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 md:py-32">
      <div className="mb-16 border-b-4 border-black pb-4">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Contact</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 text-sm font-bold text-gray-500 uppercase tracking-widest leading-loose">
          {isSent ? "Thank you!" : "Get in touch."}
        </div>

        <div className="md:col-span-8">
          {isSent ? (
            <div className="py-20 text-center bg-gray-50 border-2 border-dashed border-gray-200">
              <p className="text-xl font-black uppercase italic tracking-tighter">Message Sent Successfully.</p>
              <p className="text-xs font-bold mt-4 text-gray-400">メッセージを送信しました。返信まで少々お待ちください。</p>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-6">
              {/* 入力欄は前回と同じ（省略せずに実装してください） */}
              <div className="space-y-6">
                <input type="text" name="name" required placeholder="NAME" className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 text-sm font-bold bg-transparent" />
                <input type="email" name="email" required placeholder="EMAIL" className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 text-sm font-bold bg-transparent" />
                <input type="text" name="subject" placeholder="SUBJECT" className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 text-sm font-bold bg-transparent" />
                <textarea name="message" required rows={5} placeholder="MESSAGE" className="w-full border-2 border-gray-200 focus:border-black outline-none p-4 text-sm font-bold bg-transparent" />
              </div>

              <button 
                disabled={isSending}
                className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-gray-800 transition-all disabled:bg-gray-400"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}