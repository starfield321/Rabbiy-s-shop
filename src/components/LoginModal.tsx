'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, AlertTriangle, Key, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await signIn('credentials', { 
      email: email.toLowerCase(), 
      password, 
      redirect: false 
    });

    if (result?.error) {
      setErrorMessage('パスワードが正しくないか、アカウントが見つかりません。');
      setIsSubmitting(false);
    } else if (result?.ok) {
      router.refresh(); 
      setIsSubmitting(false);
      onClose(); 
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* モーダル本体 */}
      <div className="relative w-full max-w-[500px] bg-white border-[6px] border-black shadow-[20px_20px_0px_0px_rgba(220,38,38,0.3)] animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* 左側デザイン（透かし画像） */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 grayscale mix-blend-multiply flex items-center justify-center">
          <div className="relative w-[150%] h-[150%]">
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

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-black hover:text-red-600 transition-colors z-50"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 p-8 md:p-12 space-y-8">
          {/* 見出し */}
          <div className="space-y-2 relative">
            <div className="flex items-start">
              <div className="w-[6px] h-10 bg-red-600 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter leading-none">
                  Identity Auth.
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] italic mt-2">
                  Enter your details below / ログイン
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Google ログイン */}
            <button 
              onClick={handleGoogleLogin}
              className="w-full h-16 border-2 border-black flex items-center justify-center gap-4 group hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none bg-white"
            >
              <svg className="w-5 h-5 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold italic text-sm">Googleでログイン</span>
            </button>

            <div className="flex items-center gap-4">
              <span className="h-[1px] w-full bg-zinc-100"></span>
              <span className="text-[10px] font-bold text-zinc-300">OR</span>
              <span className="h-[1px] w-full bg-zinc-100"></span>
            </div>

            {/* メールアドレスログイン */}
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 flex items-center gap-3 text-red-600">
                  <AlertTriangle size={18} />
                  <p className="text-[11px] font-bold leading-tight">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-px border border-zinc-100 rounded overflow-hidden">
                <input 
                  type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white p-4 text-sm font-medium outline-none placeholder:text-zinc-300 border-b border-zinc-100 text-black" required
                />
                <input 
                  type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white p-4 text-sm font-medium outline-none placeholder:text-zinc-300 text-black" required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 bg-black text-white px-6 font-bold italic text-sm hover:bg-red-600 transition-all flex items-center justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
              >
                <span>{isSubmitting ? '認証中...' : 'ログイン'}</span>
                <Key size={16} className="group-hover:rotate-12 transition-transform" />
              </button>
            </form>

            {/* 新規登録セクションを丸ごと差し替え */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
                <Link 
                    href="/signup?callbackUrl=/checkout" 
                    onClick={onClose}
                    className="w-full h-16 border-2 border-black flex items-center justify-between px-6 group hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none bg-white text-black"
                >
                    <span className="font-bold italic text-lg">アカウント作成</span>
                    <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}