'use client';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Collection_of_Information',
      content: '当ショップは、商品のご購入、会員登録、お問い合わせの際に、氏名、住所、電話番号、メールアドレス、支払い情報などの個人情報を収集します。'
    },
    {
      title: 'Use_of_Information',
      content: '収集した情報は、商品の発送、決済処理、カスタマーサポート、新商品やサービスに関するご案内、および不正利用の防止のために利用します。'
    },
    {
      title: 'Third_Party_Sharing',
      content: '法令に基づく場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。ただし、決済（Stripe）や配送（配送業者）などの業務委託先には必要な範囲で開示します。'
    },
    {
      title: 'Data_Security',
      content: '当ショップは、SSL暗号化通信の採用や適切なアクセス制御を行い、個人情報の漏洩、紛失、不正アクセスを防止するためのセキュリティ対策を講じています。'
    },
    {
      title: 'User_Rights',
      content: 'お客様は、ご自身の個人情報の照会、修正、削除を希望される場合、ダッシュボードまたはお問い合わせフォームより手続きを行うことができます。'
    },
    {
      title: 'Cookies',
      content: '当ショップは、利便性の向上や利用状況の分析のためにクッキー（Cookie）を使用することがあります。ブラウザの設定でクッキーを無効にすることも可能です。'
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10 text-black">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b-8 border-black pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-4">Privacy_Security_v1.0</p>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-black">
            Privacy_Policy<span className="text-red-600">.</span>
          </h1>
          <p className="mt-6 text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em]">プライバシーポリシー（個人情報保護方針）</p>
        </div>

        {/* POLICY CONTENT */}
        <div className="space-y-0 border-t-2 border-black">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-3 border-b border-zinc-100 py-16 hover:bg-zinc-50 transition-colors px-6 group"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-6 md:mb-0 group-hover:text-black transition-colors">
                {section.title}_
              </div>
              <div className="md:col-span-2 text-[13px] leading-[2.2] text-zinc-800 font-bold uppercase tracking-wider">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT INFO */}
        <div className="mt-20 p-10 bg-zinc-50 border-l-8 border-black">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">Inquiry_Contact</p>
          <p className="text-sm font-bold uppercase leading-loose tracking-wide">
            個人情報の取り扱いに関するお問い合わせは、<br className="hidden md:block" />
            <span className="text-red-600 border-b-2 border-red-600 pb-0.5">starfield.business@gmail.com</span> までご連絡ください。
          </p>
        </div>

        <footer className="mt-32 pt-12 border-t border-zinc-100 text-center">
          <p className="text-[8px] font-mono text-zinc-300 tracking-[0.5em] uppercase">
            Rabbiy_Official_Store // Data_Protection_Compliant
          </p>
        </footer>
      </div>
    </main>
  );
}