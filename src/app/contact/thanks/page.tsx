'use client';

import Link from 'next/link';

export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 text-white text-center">
      <div className="max-w-xl space-y-12">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none uppercase">
            Sent<span className="text-red-600 not-italic">!</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.4em] italic text-zinc-500">
            Message_Received_Successfully
          </p>
        </div>

        <div className="border-y-2 border-zinc-800 py-12 space-y-6">
          <p className="text-sm font-black uppercase leading-loose italic">
            お問い合わせありがとうございます。<br />
            内容を確認次第、担当者より折り返しご連絡いたします。<br />
            通常、2営業日以内に返信しております。
          </p>
        </div>

        <Link 
          href="/" 
          className="inline-block bg-white text-black px-12 py-5 font-black italic uppercase text-sm hover:bg-red-600 hover:text-white transition-all tracking-widest"
        >
          Back_to_Home_
        </Link>
      </div>
    </main>
  );
}