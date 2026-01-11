'use client';

import Link from 'next/link';
import { ShieldCheck, Mail, Lock, Eye, Database, Cookie, UserCheck, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Database size={16} />,
      title: '情報の収集',
      content: '当ショップは、商品のご購入、会員登録、お問い合わせの際に、氏名、住所、電話番号、メールアドレス、支払い情報などの個人情報を収集します。'
    },
    {
      icon: <Eye size={16} />,
      title: '情報の利用目的',
      content: '収集した情報は、商品の発送、決済処理、カスタマーサポート、新商品やサービスに関するご案内、および不正利用の防止のために利用します。'
    },
    {
      icon: <Lock size={16} />,
      title: '第三者への提供',
      content: '法令に基づく場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。ただし、決済（Stripe）や配送（配送業者）などの業務委託先には必要な範囲で開示します。'
    },
    {
      icon: <ShieldCheck size={16} />,
      title: '安全管理措置',
      content: '当ショップは、SSL暗号化通信の採用や適切なアクセス制御を行い、個人情報の漏洩、紛失、不正アクセスを防止するためのセキュリティ対策を講じています。'
    },
    {
      icon: <UserCheck size={16} />,
      title: 'お客様の権利',
      content: 'お客様は、ご自身の個人情報の照会、修正、削除を希望される場合、ダッシュボードまたはお問い合わせフォームより手続きを行うことができます。'
    },
    {
      icon: <Cookie size={16} />,
      title: 'クッキーの使用',
      content: '当ショップは、利便性の向上や利用状況の分析のためにクッキー（Cookie）を使用することがあります。ブラウザの設定でクッキーを無効にすることも可能です。'
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-24 lg:pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 背景ドット */}
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
              Privacy<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  Data Protection
              </span>
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        {/* 2. 導入 */}
        <div className="flex items-start mb-20">
          <div className="w-[8px] h-16 bg-red-600 mr-8 flex-shrink-0" />
          <div className="space-y-2 pt-1">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">Identity Protection.</h2>
            <p className="text-xs font-bold text-zinc-500 leading-relaxed italic">
              お客様の個人情報を安全に管理し、プライバシーを保護します。
            </p>
          </div>
        </div>

        {/* 3. ポリシーリスト + お問い合わせエリア */}
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
                    個人情報の取り扱いに関するお問い合わせ
                </p>
                <p className="text-[13px] text-zinc-500 font-bold italic leading-relaxed tracking-[0.15em] max-w-3xl">
                    お客様の個人情報の管理について、開示・訂正・削除のご要望やご不明な点がございましたら、専用フォームよりご連絡ください。内容を確認次第、速やかに対応させていただきます。
                </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}