'use client';

import Link from 'next/link';
import { ShieldCheck, Mail, ArrowRight, Info, User, MapPin, Phone, CreditCard, Truck, RefreshCcw } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function LegalPage() {
  const legalData = [
    { label: '販売業者', value: 'dot. CREATION.（星野 智）', icon: <User size={16} /> },
    { label: '代表責任者', value: '星野 智', icon: <Info size={16} /> },
    { label: '所在地', value: '274-0825 千葉県船橋市前原西1-13-18-202', icon: <MapPin size={16} /> },
    { label: '電話番号', value: '080-8740-2920', icon: <MapPin size={16} /> },
    { label: 'メールアドレス', value: 'rabbiy@dotcreation.jp', icon: <Mail size={16} /> },
    { label: '販売価格', value: '各商品詳細ページに税込価格を表示', icon: <Info size={16} /> },
    { label: '商品代金以外の必要料金', value: '送料（全国一律850円）', icon: <Info size={16} /> },
    { label: '支払方法', value: 'クレジットカード決済（Stripe）', icon: <CreditCard size={16} /> },
    { label: '支払時期', value: '注文確定時（クレジットカード決済の場合、即時処理されます）', icon: <CreditCard size={16} /> },
    { label: '商品の引渡時期', value: '決済完了確認後、通常3〜7営業日以内に発送いたします', icon: <Truck size={16} /> },
    { label: '返品・交換・キャンセル', value: '商品に欠陥がある場合を除き、お客様都合による返品・交換・キャンセルには応じられません。商品の欠陥による返品・交換をご希望の場合は、商品到着後7日以内にメールにてご連絡ください。その際の送料は当方が負担いたします。', icon: <RefreshCcw size={16} /> },
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
              Legal<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  Compliance
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
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">Transparency.</h2>
            <p className="text-xs font-bold text-zinc-500 leading-relaxed italic">
              特定商取引法に基づく表記。法令に基づき、運営情報を公開いたします。
            </p>
          </div>
        </div>

        {/* 3. 法令データリスト */}
        <div className="space-y-0 border-t-2 border-black">
          {legalData.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 border-b border-zinc-100 py-10 px-2">
              <div className="md:col-span-4 space-y-2 mb-4 md:mb-0">
                <div className="flex items-center gap-3 text-red-600">
                  {item.icon}
                  <span className="text-[11px] font-black tracking-[0.3em] italic">{item.label}</span>
                </div>
              </div>
              <div className="md:col-span-8 text-[13px] leading-[2.2] text-zinc-800 font-bold tracking-widest italic">
                {item.value}
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
                    運営および取引に関するお問い合わせ
                </p>
                <p className="text-[13px] text-zinc-500 font-bold italic leading-relaxed tracking-[0.15em] max-w-3xl">
                    表記内容や取引の詳細、商品に関するご不明な点がございましたら、専用フォームよりご連絡ください。内容を確認次第、速やかに対応させていただきます。
                </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}