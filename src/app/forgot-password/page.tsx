'use client';

import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage({ type: 'error', text: 'エラーが発生しました: ' + error.message });
    } else {
      setMessage({ 
        type: 'success', 
        text: 'パスワード再設定用のメールを送信しました。メールボックスを確認してください。' 
      });
    }
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col overflow-hidden">
      
      <nav className="p-6 flex justify-between items-center z-20 shrink-0">
        <Link href="/login" className="flex items-center gap-2 text-[11px] font-bold group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>ログインへ戻る</span>
        </Link>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row items-stretch overflow-hidden">
        
        {/* 左側デザイン */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-end relative bg-zinc-50/50 border-r border-zinc-100 overflow-hidden text-black">
          <div className="space-y-4 relative z-10">
            <h1 className="text-6xl lg:text-[7rem] font-black italic tracking-tight leading-[0.9] text-black font-sans">
              Reset<br/>Access<span className="text-red-600 animate-pulse">.</span>
            </h1>
          </div>
        </div>

        {/* 右側：コンテンツ */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
          <div className="max-w-sm w-full mx-auto space-y-8">
            
            <div className="space-y-6">
            <div className="space-y-2 relative">
              <div className="flex items-start">
                <div className="w-[6px] h-10 bg-red-600 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter leading-none font-sans">
                    Access Recovery.
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] italic mt-2">
                    パスワードをお忘れですか？
                  </p>
                </div>
              </div>
              </div>
              <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                ご登録済みのメールアドレスを入力してください。<br />
                パスワードを再設定するためのリンクをお送りします。
              </p>

              <form onSubmit={handleResetRequest} className="space-y-4">
                {message && (
                  <div className={`p-4 border-l-4 flex items-center gap-3 animate-in fade-in duration-300 ${
                    message.type === 'success' ? 'bg-green-50 border-green-600 text-green-700' : 'bg-red-50 border-red-600 text-red-600'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-[11px] font-bold leading-tight">{message.text}</p>
                  </div>
                )}

                <div className="border border-zinc-100 rounded overflow-hidden">
                  <input 
                    type="email" 
                    placeholder="メールアドレス" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white p-4 text-sm font-medium outline-none placeholder:text-zinc-300 text-black" 
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-14 bg-black text-white px-6 font-bold italic text-sm hover:bg-red-600 transition-all flex items-center justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] disabled:bg-zinc-400"
                >
                  <span>{isSubmitting ? '送信中...' : '再設定メールを送信'}</span>
                  <Mail size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="pt-4">
                <p className="text-[10px] font-bold text-zinc-400 text-center tracking-widest">
                  Secure Identity Recovery System
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}