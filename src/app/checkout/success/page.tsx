'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="h-screen bg-white text-black flex flex-col overflow-hidden">
      {/* ナビゲーション */}
      <nav className="p-6 flex justify-between items-center z-30 shrink-0">
        <div className="text-[10px] font-mono text-zinc-400 font-bold">Transaction_ID: #SUCCESS_01</div>
        <Link href="/" className="flex items-center gap-2 text-[11px] font-bold group">
          <span>ストアへ戻る</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row items-stretch overflow-hidden">
        
        {/* 左側：コンテンツエリア (左寄せ + 100vhに収まるよう配置) */}
        <div className="w-full md:w-1/2 px-8 py-10 md:px-20 flex flex-col justify-center bg-white relative z-20">
          <div className="max-w-md w-full space-y-12">
            
            {/* メインタイトル */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-[6px] h-16 bg-red-600 mr-6 flex-shrink-0" />
                <div>
                  <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] font-sans">
                    Order<br/>Done<span className="text-red-600">.</span>
                  </h1>
                  <p className="text-[10px] font-bold text-zinc-400 tracking-[0.4em] italic mt-4">
                    Payment Successful / 決済完了
                  </p>
                </div>
              </div>
            </div>

            {/* メッセージ：2行構成・左寄せ */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                    <CheckCircle2 size={20} strokeWidth={3} />
                    <span className="text-[10px] font-black tracking-[0.3em]">Identity Verified</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black italic tracking-tight leading-tight">
                    注文確認メールを送信しました。<br/>
                    <span className="text-zinc-400 font-bold">内容をご確認ください。</span>
                </h3>
                <p className="text-[11px] font-mono text-zinc-500 leading-relaxed tracking-[0.15em] max-w-sm">
                    Your order has been successfully processed. 
                    Please check your inbox for the details.
                </p>
            </div>

            {/* アクションボタン */}
            <div className="pt-2">
                <Link 
                    href="/" 
                    className="w-full h-20 bg-black text-white px-10 font-black italic text-sm hover:bg-red-600 transition-all flex items-center justify-between group shadow-[10px_10px_0px_0px_rgba(220,38,38,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                    <span className="tracking-[0.2em]">Rertuen to Home</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
          </div>
        </div>

        {/* 右側：画像エリア */}
        <div className="hidden md:flex md:w-1/2 relative bg-zinc-50 overflow-hidden group">
          
          {/* 修正版：位置を上にずらしたステッカー */}
          <div className="absolute top-[20%] left-[55%] z-30 animate-[bounce_4s_infinite]">
            <div className="bg-white border-[3px] border-black px-8 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-3xl font-black italic tracking-tighter block">
                Thank you!
              </span>
            </div>
          </div>

          {/* 背景の巨大文字 */}
          <div className="absolute top-10 right-[-5%] pointer-events-none select-none">
            <span className="text-[12rem] font-black italic leading-none uppercase tracking-tighter text-zinc-100">
                01
            </span>
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
            <div className="relative w-[80%] h-[80%] transition-transform duration-[3000ms] group-hover:scale-105">
              <Image 
                src="/welcome.png" 
                alt="Success Character" 
                fill 
                className="object-contain object-center drop-shadow-[20px_20px_0px_rgba(0,0,0,0.05)]" 
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}