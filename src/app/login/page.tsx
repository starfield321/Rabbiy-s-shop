'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft, Key, UserPlus, AlertTriangle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Imageをインポート

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await signIn('credentials', { 
      email: email.toLowerCase(), 
      password, 
      redirect: false 
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrorMessage('パスワードが正しくないか、アカウントが見つかりません。');
    } else if (result?.ok) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col overflow-hidden">
      
      <nav className="p-6 flex justify-between items-center z-20 shrink-0">
        <Link href="/" className="flex items-center gap-2 text-[11px] font-bold group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>ストアへ戻る</span>
        </Link>
        <div className="text-[10px] font-mono text-zinc-400">Auth_v2.6</div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row items-stretch overflow-hidden">
        
        {/* 左側デザイン */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-end relative bg-zinc-50 border-r border-zinc-100 overflow-hidden group">
          
          {/* 透かし画像レイヤー */}
          <div className="absolute inset-0 z-0 pointer-events-none transition-transform duration-[2000ms] flex items-center justify-center">
            <div className="relative w-[150%] h-[150%] opacity-40 grayscale mix-blend-multiply">
                <Image 
                src="/hello.png" 
                alt="Watermark" 
                fill 
                className="object-contain" // 大きく表示
                priority
                />
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h1 className="text-6xl lg:text-[7rem] font-black italic tracking-tighter leading-[0.9] mix-blend-difference font-sans">
              System<br/>Identify<span className="text-red-600 animate-pulse">.</span>
            </h1>
          </div>
        </div>

        {/* 右側：コンテンツ */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
          <div className="max-w-sm w-full mx-auto space-y-8">
            
            <div className="space-y-8">
              
              {/* Google ログイン */}
              <div className="space-y-3">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full h-16 border-2 border-black flex items-center justify-center gap-4 group hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                  <svg className="w-5 h-5 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-bold italic text-sm">Googleでログイン</span>
                </button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <span className="h-[1px] w-full bg-zinc-100"></span>
                <span className="text-[10px] font-bold text-zinc-300">OR</span>
                <span className="h-[1px] w-full bg-zinc-100"></span>
              </div>

              {/* 資格情報ログイン */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-400 tracking-wider">メールアドレスでログイン</p>
                
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
                      className="w-full bg-white p-4 text-sm font-medium outline-none placeholder:text-zinc-300 border-b border-zinc-100" required
                    />
                    <input 
                      type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white p-4 text-sm font-medium outline-none placeholder:text-zinc-300" required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Link 
                      href="/forgot-password" 
                      className="text-[10px] font-bold text-zinc-400 hover:text-black flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle size={12} />
                      <span>パスワードを忘れた方はこちら</span>
                    </Link>
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
              </div>

              {/* 新規登録 */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-300 shrink-0">初めての方はこちら</span>
                  <span className="h-[1px] w-full bg-zinc-100"></span>
                </div>
                <Link 
                  href="/signup" 
                  className="w-full h-16 border-2 border-black flex items-center justify-between px-6 group hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                  <span className="font-bold italic text-lg">アカウント作成</span>
                  <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}