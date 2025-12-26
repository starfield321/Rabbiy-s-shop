'use client';

import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'パスワードが一致しません。' });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password: password });
    setIsSubmitting(false);

    if (error) {
      setMessage({ type: 'error', text: '更新に失敗しました: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'パスワードを更新しました。ログイン画面へ移動します...' });
      setTimeout(() => { router.push('/login'); }, 2000);
    }
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col overflow-hidden">
      {/* ナビゲーション */}
      <nav className="p-6 flex justify-between items-center z-30 shrink-0">
        <Link href="/login" className="flex items-center gap-2 text-[11px] font-bold group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>ログインへ戻る</span>
        </Link>
        <div className="text-[10px] font-mono text-zinc-400">Security_v2.0</div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row items-stretch overflow-hidden">
        
        {/* 左側：デザインエリア（透かし画像） */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-end relative bg-zinc-50 border-r border-zinc-100 overflow-hidden group">
          <div className="absolute inset-0 z-0 pointer-events-none transition-transform duration-[2000ms] group-hover:scale-110 flex items-center justify-center">
            <div className="relative w-[150%] h-[150%] opacity-60 grayscale mix-blend-multiply">
              <Image 
                src="/hello.jpg" 
                alt="Watermark" 
                fill 
                className="object-contain" 
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            <h1 className="text-6xl lg:text-[7rem] font-black italic tracking-tight leading-[0.9] mix-blend-difference font-sans">
              Reset<br/>Security<span className="text-red-600 animate-pulse">.</span>
            </h1>
          </div>
        </div>

        {/* 右側：コンテンツ */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto z-20">
          <div className="max-w-sm w-full mx-auto space-y-10">
            
            <div className="space-y-2 relative">
              <div className="flex items-start">
                <div className="w-[6px] h-10 bg-red-600 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter leading-none font-sans">
                    New Password.
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] italic mt-2">
                    Update your credentials / パスワードの再設定
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-8">
              {message && (
                <div className={`p-4 border-l-4 flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-red-50 border-red-600 text-red-600'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <p className="text-[11px] font-bold leading-tight">{message.text}</p>
                </div>
              )}

              <div className="space-y-px border border-zinc-100 rounded overflow-hidden">
                <input 
                  type="password" 
                  placeholder="新しいパスワード" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white p-5 text-sm font-medium outline-none border-b border-zinc-100 placeholder:text-zinc-300 text-black" 
                  required
                  minLength={6}
                />
                <input 
                  type="password" 
                  placeholder="確認用パスワード" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white p-5 text-sm font-medium outline-none placeholder:text-zinc-300 text-black" 
                  required
                  minLength={6}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-16 bg-black text-white px-8 font-bold italic text-sm hover:bg-red-600 transition-all flex items-center justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] disabled:bg-zinc-400"
              >
                <span>{isSubmitting ? '更新中...' : 'パスワードを更新'}</span>
                <Lock size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}