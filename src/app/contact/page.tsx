'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここに送信処理を書きますが、まずは見た目と動きだけ！
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black mb-6 italic tracking-tighter">THANK YOU!</h1>
        <p className="text-gray-500 mb-10 text-sm">お問い合わせを受け付けました。返信まで少々お待ちください。</p>
        <button onClick={() => setSubmitted(false)} className="text-xs underline text-gray-400">戻る</button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <h1 className="text-3xl font-black italic tracking-tighter mb-12 border-b-2 border-black pb-4 uppercase">
        Contact Us
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
          <input 
            required
            type="text" 
            placeholder="お名前"
            className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
          <input 
            required
            type="email" 
            placeholder="メールアドレス"
            className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
          <textarea 
            required
            rows={5}
            placeholder="お問い合わせ内容を入力してください"
            className="w-full border border-gray-300 p-4 focus:border-black outline-none transition-colors text-sm resize-none"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-black text-white py-5 font-black hover:bg-gray-800 transition-all shadow-xl tracking-widest uppercase text-sm"
        >
          送信する
        </button>
      </form>
    </main>
  );
}