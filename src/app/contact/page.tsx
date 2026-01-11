'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmail } from '@/app/actions/sendEmail';
import { ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSending(true);
    const result = await sendEmail(formData);
    setIsSending(false);
    
    if (result.success) {
      router.push('/contact/thanks');
    } else {
      alert('送信エラーが発生しました。時間を置いて再度お試しください。');
    }
  }

  return (
    <main className="min-h-screen bg-white pt-24 lg:pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* ヘッダーデザイン：最新のトンマナ */}
        <div className="relative mb-16 lg:mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Contact<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  Transmission_Interface
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* 左：キャッチコピーと垂直赤線 */}
          <div className="lg:col-span-5 space-y-12">
            <div className="flex items-start">
              <div className="w-[8px] h-24 bg-red-600 mr-8 flex-shrink-0" />
              <div className="space-y-4 pt-1">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-[1.1]">
                  Let's Talk<br />
                  About Your<br />
                  <span className="text-red-600">Vision.</span>
                </h2>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-sm">
                  商品に関するご質問、お仕事のご依頼、その他メッセージはこちらからお送りください。
                </p>
              </div>
            </div>
            <div className="p-8 border-2 border-zinc-100 bg-zinc-50/50 space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">プライバシーポリシー</span>
              </div>
              <p className="text-[11px] font-bold leading-relaxed text-zinc-500 italic">
                ご入力いただいた個人情報は、お問い合わせへの回答および対応のみに使用し、適切に管理いたします。
              </p>
            </div>

          </div>

          {/* 右：フォームセクション */}
          <div className="lg:col-span-7">
            <form action={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black tracking-[0.3em] text-zinc-400 font-mono group-focus-within:text-red-600 transition-colors">Name / お名前</label>
                  <input 
                    name="name"
                    required
                    type="text" 
                    placeholder="山田太郎"
                    className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent"
                  />
                </div>
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black tracking-[0.3em] text-zinc-400 font-mono group-focus-within:text-red-600 transition-colors">Email / メールアドレス</label>
                  <input 
                    name="email"
                    required
                    type="email" 
                    placeholder="example@mail.com"
                    className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black tracking-[0.3em] text-zinc-400 font-mono group-focus-within:text-red-600 transition-colors">Message / 内容</label>
                <textarea 
                  name="message"
                  required
                  rows={6}
                  placeholder="お問い合わせ内容をご記入ください"
                  className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparentZ"
                />
              </div>

              {/* 送信ボタン：ぬるっと光る演出 */}
              <button 
                disabled={isSending}
                className={`w-full h-24 font-black italic tracking-[0.3em] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center group relative overflow-hidden border-2 border-black
                  ${isSending 
                    ? 'bg-zinc-100 text-zinc-400 border-zinc-100 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-red-600 hover:border-red-600 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:scale-[0.98]'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-6 text-xl">
                  {isSending ? (
                    'Sending...'
                  ) : (
                    <>
                    <span className="hidden md:inline">Send Message / </span>
                    <span>送信する</span>
                    </>
                  )}
                  {!isSending && <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform duration-500" />}
                </span>

                {!isSending && (
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out" />
                )}
              </button>
            </form>

            <div className="mt-16 text-center border-t border-zinc-100 pt-10">
              <Link href="/" className="inline-flex items-center gap-3 text-[11px] font-black text-zinc-400 italic hover:text-black transition-all group">
                <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                Return to Base / トップページへ戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}