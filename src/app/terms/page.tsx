'use client';

import Link from 'next/link';
import { ShieldCheck, Mail, ArrowRight, Gavel, Ban, HelpCircle, Scale, ShoppingBag } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function TermsPage() {
  const sections = [
    {
      icon: <Gavel size={16} />,
      title: '利用規約への同意',
      content: '本規約は、Rabbiy（以下「当ショップ」）が運営するサービスを利用するすべてのお客様に適用されます。利用を開始した時点で、本規約に同意したものとみなします。'
    },
    {
      icon: <ShoppingBag size={16} />,
      title: '注文・配送ポリシー',
      content: '当ショップの製品はオンデマンド生産方式を採用しています。注文完了後のキャンセル、サイズ変更、お客様都合による返品は、商品の特性上お受けできません。'
    },
    {
      icon: <Ban size={16} />,
      title: '禁止事項',
      content: '営利目的の転売、デザインの著作権侵害、公序良俗に反する行為、システムへの不正アクセスを禁止します。違反が確認された場合、以降の取引をお断りすることがあります。'
    },
    {
      icon: <HelpCircle size={16} />,
      title: '免責事項',
      content: '配送遅延やシステム障害により発生した損害について、当ショップは一切の責任を負いません。また、モニター環境による色味の違いは不良品とはみなされません。'
    },
    {
      icon: <Scale size={16} />,
      title: '準拠法・管轄裁判所',
      content: '本規約の解釈および適用にあたっては日本法を準拠法とし、紛争が生じた場合は当ショップ所在地を管轄する裁判所を専属的合意管轄とします。'
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-24 lg:pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 背景ドットデザイン */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* 1. ヘッダー */}
        <div className="relative mb-16 lg:mb-24">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Terms<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  Service Agreement
              </span>
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {/* 2. 導入メッセージ */}
        <div className="flex items-start mb-20">
          <div className="w-[8px] h-16 bg-red-600 mr-8 flex-shrink-0" />
          <div className="space-y-2 pt-1">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">Rules of Conduct.</h2>
            <p className="text-xs font-bold text-zinc-500 leading-relaxed italic">
              安心・安全な取引のため、本規約の内容を必ずご確認ください。
            </p>
          </div>
        </div>

        {/* 3. ポリシーリスト */}
        <div className="space-y-0 border-t-2 border-black">
          {sections.map((section, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 border-b border-zinc-100 py-12 px-2">
              <div className="md:col-span-4 space-y-2 mb-4 md:mb-0">
                <div className="flex items-center gap-3 text-red-600">
                  {section.icon}
                  <span className="text-[11px] font-black tracking-[0.3em] italic">{section.title}</span>
                </div>
              </div>
              <div className="md:col-span-8 text-[13px] leading-[2.2] text-zinc-800 font-bold tracking-widest italic">
                {section.content}
              </div>
            </div>
          ))}

          {/* 4. お問い合わせ強調エリア */}
          <div className="bg-zinc-50 relative px-8 lg:px-16 py-16 space-y-10 mt-20">
            {/* 赤いアクセントバー */}
            <div className="absolute left-0 top-0 w-[6px] h-full bg-red-600" />
            
            {/* 上段：見出しとボタンの横並び */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                <div className="md:col-span-7 flex items-center justify-center md:justify-start gap-4 text-black">
                    <Mail size={32} className="text-red-600 flex-shrink-0" />
                    <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none">
                      Contact<span className="text-red-600">.</span>
                    </h3>
                </div>
                <div className="md:col-span-5 flex justify-center md:justify-end">
                    <Link 
                      href="/contact" 
                      className="w-full md:w-auto h-20 px-10 bg-black text-white font-black italic text-xs tracking-[0.2em] flex items-center justify-center gap-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-red-600 transition-all duration-300 group"
                    >
                      <span>お問い合わせフォームへ</span>
                      <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform duration-500" />
                    </Link>
                </div>
            </div>

            {/* 下段：独立した説明テキスト */}
            <div className="space-y-3 pt-4 border-t border-zinc-200/50">
                <p className="text-[12px] font-black tracking-[0.4em] text-black italic">
                    規約およびサービスに関するお問い合わせ
                </p>
                <p className="text-[13px] text-zinc-500 font-bold italic leading-relaxed tracking-[0.15em] max-w-3xl">
                    本規約の内容や、サービスの利用方法についてご不明な点がございましたら、専用フォームよりご連絡ください。内容を確認次第、速やかに対応させていただきます。
                </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}