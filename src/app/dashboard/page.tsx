'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingBag, 
  LogOut, 
  ArrowRight, 
  Truck,
  User // 人型アイコン用
} from "lucide-react";
import Image from "next/image";
import Breadcrumbs from '@/components/Breadcrumbs';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // ログインユーザーのIDをNextAuthセッションから取得
      const userId = (session?.user as any)?.id;

      if (userId) {
        const { data } = await supabase
          .from('users')
          .select('name, phone, postal_code, prefecture, address1, address2')
          .eq('id', userId) // email指定からid指定に変更
          .maybeSingle();
        
        if (data) setProfile(data);
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  if (status === "loading") return null;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-white pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* ヘッダーデザイン：最新のトンマナ */}
        <div className="relative mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Dashboard<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  User Portal
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {/* 上段レイアウト */}
        <div className="mt-8 md:mt-0 text-left font-mono text-zinc-300">
            <p className="text-[10px] tracking-tighter uppercase leading-none">ログイン承認済み // 正常に接続されています</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center mb-32">
          
          {/* 左：キャラクター */}
          <div className="lg:col-span-4 flex justify-center items-center relative aspect-square scale-110 lg:scale-125">
             <Image 
                src="/welcome.png" 
                alt="Rabbiy 3D" 
                fill 
                className="object-contain"
                priority
             />
          </div>

          {/* 右：登録情報パネル */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-start">
              <div className="w-[8px] h-20 bg-red-600 mr-8 flex-shrink-0" />
              <div className="space-y-3 pt-1">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-tight text-black">
                  Welcome to, <span className="text-red-600 not-italic">{profile?.name || session.user?.name}</span>！
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 tracking-[0.5em] uppercase leading-none font-mono tracking-widest">
                  現在の登録情報を確認しています
                </p>
              </div>
            </div>

            {/* 情報カード（左右並べ替え + 透かしアイコン） */}
            <div className="bg-white border-2 border-zinc-100 p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
              
              {/* 背景の透かし人型アイコン */}
              <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-black pointer-events-none transition-transform duration-1000">
                <User size={320} strokeWidth={1} />
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-12 mb-12">
                
                {/* 左側：お届け先住所（広く取る） */}
                <div className="md:col-span-5 space-y-4">
                  <p className="text-[10px] font-black text-zinc-300 tracking-widest italic font-mono border-l-4 border-red-600 pl-3">Shipping Address / お届け先</p>
                  <div className="text-lg font-black italic leading-relaxed tracking-tight">
                    {profile?.postal_code ? (
                      <div className="space-y-1">
                        <p className="tabular-nums text-lg text-zinc-400">〒{profile.postal_code}</p>
                        <p className="text-xl leading-tight">{profile.prefecture}{profile.address1}</p>
                        {profile.address2 && <p className="text-xl">{profile.address2}</p>}
                      </div>
                    ) : (
                      <p className="text-zinc-200">お届け先住所が登録されていません</p>
                    )}
                  </div>
                </div>

                {/* 右側：連絡先情報 */}
                <div className="md:col-span-7 space-y-10 border-t md:border-t-0 md:border-l border-zinc-100 pt-10 md:pt-0 md:pl-12">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-300 tracking-widest italic font-mono border-l-4 border-red-600 pl-3">Email / メールアドレス</p>
                    <p className="text-lg font-black italic break-all tracking-tight leading-none">{session.user?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-300 tracking-widest italic font-mono border-l-4 border-red-600 pl-3">Phone / 電話番号</p>
                    <p className="text-xl font-black italic tracking-tight tabular-nums leading-none">{profile?.phone || "未登録"}</p>
                  </div>
                </div>
              </div>

              <Link 
                href="/dashboard/edit" 
                className="w-full h-16 bg-black text-white font-black italic tracking-[0.3em] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center group relative overflow-hidden border-2 border-black hover:bg-red-600 hover:border-red-600"
              >
                <span className="relative z-10 flex items-center gap-4 text-xs">
                  Edit Profile / 登録情報を編集する
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out" />
              </Link>
            </div>
          </div>
        </div>

        {/* 下段：アクションボタン */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Link href="/goods" className="group border-4 border-black p-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden h-72 flex flex-col justify-between shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-black hover:text-white translate-y-0 active:translate-y-1">
            <ShoppingBag size={40} strokeWidth={2.5} />
            <div>
              <h2 className="text-3xl font-black italic leading-none tracking-tighter">Go Shopping</h2>
              <p className="text-[10px] font-bold mt-4 opacity-40 tracking-widest uppercase italic font-mono">最新のコレクションを見る</p>
            </div>
            <ArrowRight className="absolute bottom-10 right-10 group-hover:translate-x-3 transition-transform duration-500" />
          </Link>

          <Link href="/dashboard/orders" className="group border-4 border-black p-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden h-72 flex flex-col justify-between shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-black hover:text-white translate-y-0 active:translate-y-1">
            <Truck size={40} strokeWidth={2.5} />
            <div>
              <h2 className="text-3xl font-black italic leading-none tracking-tighter">Order History</h2>
              <p className="text-[10px] font-bold mt-4 opacity-40 tracking-widest uppercase italic font-mono">配送状況と購入履歴の確認</p>
            </div>
            <ArrowRight className="absolute bottom-10 right-10 group-hover:translate-x-3 transition-transform duration-500" />
          </Link>

          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group border-4 border-red-600 p-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden h-72 flex flex-col justify-between text-red-600 shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] hover:shadow-none hover:bg-red-600 hover:text-white translate-y-0 active:translate-y-1"
          >
            <LogOut size={40} strokeWidth={2.5} />
            <div className="text-left">
              <h2 className="text-3xl font-black italic leading-none tracking-tighter">Logout</h2>
              <p className="text-[10px] font-bold mt-4 opacity-40 tracking-widest uppercase italic font-mono">セッションを終了します</p>
            </div>
            <ArrowRight className="absolute bottom-10 right-10 group-hover:translate-x-3 transition-transform duration-500" />
          </button>
        </div>

      </div>
    </main>
  );
}