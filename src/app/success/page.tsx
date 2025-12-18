import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-green-100 p-6">
          <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-black italic tracking-tighter mb-4">PAYMENT SUCCESSFUL!</h1>
      <p className="text-gray-500 mb-12">
        ご購入ありがとうございます。商品の発送まで今しばらくお待ちください。
      </p>
      <Link 
        href="/" 
        className="inline-block bg-black text-white px-10 py-4 font-bold hover:bg-gray-800 transition-all"
      >
        トップページに戻る
      </Link>
    </main>
  );
}