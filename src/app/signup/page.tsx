'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { signIn } from 'next-auth/react';
import { ArrowLeft, UserPlus, CheckCircle, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import bcrypt from 'bcryptjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const normalizedEmail = email.toLowerCase().trim();

      // ロジック修正：RLSポリシー (auth.uid() = id) との整合性を保つため、
      // 登録時に email を小文字に正規化し、確実にインサートします。
      const { error } = await supabase
        .from('users')
        .insert([{ 
          name, 
          email: normalizedEmail, 
          password: hashedPassword, 
          role: 'user' 
        }]);

      if (error) {
        // RLS違反エラーや重複エラーのハンドリング
        if (error.code === '23505') {
          throw new Error('このメールアドレスは既に登録されています。');
        } else if (error.message.includes('row-level security')) {
          throw new Error('セキュリティ設定により登録がブロックされました。INSERTポリシーを確認してください。');
        }
        throw error;
      }

      setIsRegistered(true);

      // 自動ログインの実行。ここでログインすることでセッションにIDが乗り、
      // その後のプロフィール編集でIDベースの更新が可能になります。
      setTimeout(() => {
        signIn('credentials', { 
          email: normalizedEmail, 
          password, 
          callbackUrl: callbackUrl 
        });
      }, 2000);

    } catch (err: any) {
      setErrorMessage(err.message || '登録に失敗しました。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col overflow-hidden">
      <nav className="p-6 flex justify-between items-center z-30 shrink-0">
        <Link href="/login" className="flex items-center gap-2 text-[11px] font-bold group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>ログインへ戻る</span>
        </Link>
        <div className="text-[10px] font-mono text-zinc-400">Join_Us_v1.0</div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row items-stretch overflow-hidden">
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-end relative bg-zinc-50 border-r border-zinc-100 overflow-hidden group">
          <div className="absolute inset-0 z-0 pointer-events-none transition-transform duration-[2000ms] flex items-center justify-center">
            <div className="relative w-[150%] h-[150%] opacity-40 grayscale mix-blend-multiply">
              <Image 
                src="/hello.png" 
                alt="Watermark" 
                fill 
                className="object-contain" 
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            <h1 className="text-6xl lg:text-[7rem] font-black italic tracking-tighter leading-[0.9] mix-blend-difference font-sans">
              Create<br/>Account<span className="text-red-600 animate-pulse">.</span>
            </h1>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto z-20">
          <div className="max-w-sm w-full mx-auto">
            {isRegistered ? (
              <div className="text-center space-y-6 py-20">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-emerald-400 shadow-[8px_8px_0px_0px_rgba(52,211,153,0.2)]">
                    <CheckCircle size={40} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic tracking-tighter font-sans">Welcome</h2>
                  <p className="text-sm font-bold text-zinc-400 italic">アカウントを作成しました。自動でログインします。</p>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="space-y-2 relative">
                    <div className="flex items-start">
                    <div className="w-[6px] h-10 bg-red-600 mr-4 flex-shrink-0" />
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter leading-none font-sans">
                        Join the Club.
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] italic mt-2">
                        Enter your details below / 新規登録
                        </p>
                    </div>
                    </div>
                </div>
                <form onSubmit={handleSignUp} className="space-y-8">
                  {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 flex items-center gap-3 text-red-600">
                      <AlertTriangle size={18} />
                      <p className="text-[11px] font-bold leading-tight">{errorMessage}</p>
                    </div>
                  )}

                  <div className="space-y-px border border-zinc-100 rounded overflow-hidden">
                    <input 
                      type="text" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-white p-5 text-sm font-medium outline-none border-b border-zinc-100 placeholder:text-zinc-300 text-black" required 
                    />
                    <input 
                      type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-white p-5 text-sm font-medium outline-none border-b border-zinc-100 placeholder:text-zinc-300 text-black" required 
                    />
                    <input 
                      type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-white p-5 text-sm font-medium outline-none placeholder:text-zinc-300 text-black" required 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full h-16 bg-black text-white px-8 font-bold italic text-lg hover:bg-red-600 transition-all flex items-center justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] disabled:bg-zinc-400"
                  >
                    <span>{isSubmitting ? '登録中...' : 'アカウントを作成する'}</span>
                    <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </form>
                <p className="text-center text-[10px] font-bold text-zinc-300 tracking-widest">
                  Secure Database Sync
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold italic">LOADING...</div>}>
      <SignUpForm />
    </Suspense>
  );
}