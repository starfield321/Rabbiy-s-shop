'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
        alert('ログインエラー: ' + error.message);
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        const ADMIN_UID = '39bfee29-e299-4174-ac74-d99c284c53ac';

        if (data.user.id !== ADMIN_UID) {
          await supabase.auth.signOut();
          alert('管理者権限がありません。');
          setLoading(false);
          return;
        }

        // 重要: セッションをブラウザに確実に刻み込む
        await supabase.auth.setSession(data.session);
        
        // 重要: router.push ではなく、window.location.href で強制リロード遷移
        // これにより、管理画面側で「ログイン情報が見つからない」現象を回避します
        window.location.href = '/admin/orders';
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6 text-black font-sans">
      <div className="w-full max-w-sm space-y-10">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600 mb-2">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Administrator Only</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter leading-none">
                Admin<br/>Portal<span className="text-red-600">.</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] italic uppercase">
                管理画面へのアクセス
            </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-px border border-zinc-100 rounded overflow-hidden shadow-sm">
            <div className="relative border-b border-zinc-100">
                <Mail className="absolute left-4 top-5 text-zinc-300" size={16} />
                <input 
                    type="email" 
                    placeholder="メールアドレス" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white p-5 pl-12 text-sm font-medium outline-none text-black focus:bg-zinc-50 transition-colors"
                    required 
                />
            </div>
            <div className="relative">
                <Lock className="absolute left-4 top-5 text-zinc-300" size={16} />
                <input 
                    type="password" 
                    placeholder="パスワード" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white p-5 pl-12 text-sm font-medium outline-none text-black focus:bg-zinc-50 transition-colors"
                    required 
                />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-black text-white px-8 font-bold italic text-lg hover:bg-red-600 transition-all flex items-center justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] disabled:bg-zinc-400"
          >
            <span>{loading ? '認証中...' : 'ログイン'}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </main>
  );
}