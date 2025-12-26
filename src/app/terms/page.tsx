'use client';

export default function TermsPage() {
  const sections = [
    {
      title: 'Agreement',
      content: '本規約は、Rabbiy（以下「当ショップ」）が運営するサービスを利用するすべてのお客様に適用されます。利用を開始した時点で、本規約に同意したものとみなします。'
    },
    {
      title: 'Ordering_Policy',
      content: '当ショップの製品はオンデマンド生産方式を採用しています。注文完了後のキャンセル、サイズ変更、お客様都合による返品は、商品の特性上お受けできません。'
    },
    {
      title: 'Prohibited_Actions',
      content: '営利目的の転売、デザインの著作権侵害、公序良俗に反する行為、システムへの不正アクセスを禁止します。違反が確認された場合、以降の取引をお断りすることがあります。'
    },
    {
      title: 'Disclaimers',
      content: '配送遅延やシステム障害により発生した損害について、当ショップは一切の責任を負いません。また、モニター環境による色味の違いは不良品とはみなされません。'
    },
    {
      title: 'Jurisdiction',
      content: '本規約の解釈および適用にあたっては日本法を準拠法とし、紛争が生じた場合は当ショップ所在地を管轄する裁判所を専属的合意管轄とします。'
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10 text-black">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-20 border-b-8 border-black pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-4">Terms_and_Conditions_v1.0</p>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
            User_Terms<span className="text-red-600">.</span>
          </h1>
          <p className="mt-6 text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em]">利用規約</p>
        </div>

        <div className="space-y-0 border-t-2 border-black">
          {sections.map((section, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 border-b border-zinc-100 py-16 hover:bg-zinc-50 transition-colors px-6 group">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-6 md:mb-0 group-hover:text-black">
                {section.title}_
              </div>
              <div className="md:col-span-2 text-[13px] leading-[2.2] text-zinc-800 font-bold uppercase tracking-wider">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-32 pt-12 border-t border-zinc-100 text-center text-[8px] font-mono text-zinc-300 tracking-[0.5em] uppercase">
          Rabbiy_Official_Store // User_Agreement_Confirmed
        </footer>
      </div>
    </main>
  );
}