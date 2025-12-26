'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('LOGIN_ERROR: ' + error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        // セッションをブラウザに反映
        router.refresh(); 
        
        // クッキーの書き込み時間を確保してから遷移
        setTimeout(() => {
          router.push('/admin/products');
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // 1. Supabase側でセッションを破棄
      await supabase.auth.signOut();

      // 2. ブラウザのクッキーとキャッシュを完全にクリアしてトップへ飛ばす
      // router.push ではなく window.location.href を使うことで
      // ページを完全に再読み込みさせ、Middleware を強制的に走らせます
      window.location.href = '/';
      
    } catch (err: any) {
      console.error('Logout failed:', err.message);
      // エラーが起きても強制的に飛ばす
      window.location.href = '/';
    }
  };
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-mono">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase underline decoration-red-600">Admin_Portal.</h1>
          <p className="text-[10px] text-zinc-500 mt-4 tracking-[0.3em]">SECURE_ACCESS_REQUIRED</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="EMAIL_ADDRESS" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border-2 border-zinc-800 p-4 font-black text-xs outline-none focus:border-white transition-all uppercase text-white"
            required 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border-2 border-zinc-800 p-4 font-black text-xs outline-none focus:border-white transition-all uppercase text-white"
            required 
          />
          <button 
            disabled={loading}
            className="w-full bg-white text-black py-5 font-black italic uppercase hover:bg-red-600 hover:text-white transition-all text-sm tracking-widest disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Establish_Session_'}
          </button>
        </form>

        <p className="text-center text-[8px] text-zinc-600 uppercase tracking-widest leading-loose">
          Unauthorized access to this system is prohibited by RLS policies. // Secure connection established via Supabase Auth.
        </p>
      </div>
    </main>
  );
}