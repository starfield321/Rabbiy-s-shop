'use client';

export default function LegalPage() {
  const legalData = [
    { label: 'Seller_Name', value: 'あなたの氏名（個人の場合）または 法人名' },
    { label: 'Representative', value: '代表者名（個人の場合は氏名と同じ）' },
    { label: 'Address', value: '〒000-0000 〇〇県〇〇市...（正確な住所）' },
    { label: 'Phone_Number', value: '090-0000-0000（連絡のつく番号）' },
    { label: 'Email_Address', value: 'starfield.business@gmail.com' },
    { label: 'Price', value: '各商品詳細ページに税込価格を表示' },
    { label: 'Other_Costs', value: '送料（全国一律850円）、銀行振込時の振込手数料' },
    { label: 'Payment_Method', value: 'クレジットカード決済（Stripe）' },
    { label: 'Payment_Period', value: 'クレジットカード決済の場合、注文時に即時処理されます' },
    { label: 'Delivery_Time', value: '決済確認後、通常3〜7営業日以内に発送いたします' },
    { label: 'Returns_Refunds', value: '商品に欠陥がある場合を除き、基本的には返品・交換には応じられません' },
  ];

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10 text-black">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b-8 border-black pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-2">Compliance_Check_v1.0</p>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-black">
            Legal_Notice<span className="text-red-600">.</span>
          </h1>
          <p className="mt-4 text-[10px] font-mono uppercase text-zinc-400">特定商取引法に基づく表記</p>
        </div>

        {/* DATA LIST */}
        <div className="space-y-0 border-t-2 border-black">
          {legalData.map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-3 border-b border-zinc-100 py-10 hover:bg-zinc-50 transition-colors px-6 group"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-3 md:mb-0 group-hover:text-black transition-colors">
                {item.label}_
              </div>
              <div className="md:col-span-2 font-bold text-base leading-relaxed uppercase tracking-tight">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 pt-10 border-t border-zinc-100 text-center">
          <p className="text-[8px] font-mono text-zinc-300 tracking-[0.4em] uppercase">
            Rabbiy_Official_Store // Authorized_Transaction_Only
          </p>
        </footer>
      </div>
    </main>
  );
}