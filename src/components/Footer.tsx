import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* 1. ブランド/ロゴエリア */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-black italic tracking-tighter mb-4">Rabbiy</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              音楽系アイテムを中心に取り揃えるECサイト。
              お笑いやサブカル系アイテムも充実しています。
            </p>
          </div>

          {/* 2. ショッピング */}
          <div>
            <h3 className="text-sm font-bold mb-4">SHOPPING</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/collections/pickup" className="hover:underline">特集一覧</Link></li>
              <li><Link href="/collections/all" className="hover:underline">全商品一覧</Link></li>
              <li><Link href="/collections/limited" className="hover:underline">限定アイテム</Link></li>
            </ul>
          </div>

          {/* 3. ガイド/規約 */}
          <div>
            <h3 className="text-sm font-bold mb-4">GUIDE</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/pages/guide" className="hover:underline">ご利用ガイド</Link></li>
              <li><Link href="/pages/terms" className="hover:underline">利用規約</Link></li>
              <li><Link href="/pages/privacy" className="hover:underline">プライバシーポリシー</Link></li>
              <li><Link href="/pages/low" className="hover:underline">特定商取引法に基づく表示</Link></li>
            </ul>
          </div>

          {/* 4. お問い合わせ/SNS */}
          <div>
            <h3 className="text-sm font-bold mb-4">SUPPORT</h3>
            <ul className="space-y-2 text-xs text-gray-600 mb-4">
              <li><Link href="/contact" className="hover:underline">お問い合わせ</Link></li>
              <li><Link href="/pages/about" className="hover:underline">運営会社</Link></li>
            </ul>
            <div className="flex space-x-4">
              {/* アイコンの代わりにテキストで簡易表示 */}
              <span className="text-xs font-bold border border-black px-2 py-1">Instagram</span>
              <span className="text-xs font-bold border border-black px-2 py-1">X</span>
            </div>
          </div>
        </div>

        {/* 下部コピーライト */}
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-[10px] text-gray-400">
            &copy; {currentYear} Rabbiy (Demo EC Store). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};