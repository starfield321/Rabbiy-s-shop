import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 md:py-32">
      {/* メインタイトル */}
      <div className="mb-20 border-b-4 border-black pb-4">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
          Biography
        </h1>
        <p className="text-gray-400 text-[10px] tracking-[0.3em] mt-2 uppercase">
          Artist Profile / Rabbiy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* 左側：画像とアーティスト名 */}
        <div className="md:col-span-4 space-y-6">
          <div className="sticky top-32">
            {/* アーティスト画像 */}
            <div className="aspect-[3/4] relative bg-gray-100 mb-6 overflow-hidden shadow-xl">
              <Image 
                src="/rabbiy.jpg" // あなたの画像パスに書き換えてください
                alt="Rabbiy"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-4xl font-black leading-none uppercase italic">
              Rabbiy
              <span className="block text-[10px] tracking-widest text-red-600 mt-2 not-italic">
                DJ / TRACK MAKER
              </span>
            </h2>
          </div>
        </div>

        {/* 右側：バイオグラフィー本文とジャンル、YouTubeリンク */}
        <div className="md:col-span-8">
          <div className="space-y-8 text-base md:text-lg font-medium leading-relaxed tracking-tight text-gray-800">
            <p>
              千葉県出身。高校時代に邦ロックにのめり込みギターを始める。
              その後DTMでボーカロイドを用いた楽曲制作を始め、ロックだけでなくテクノポップやEDMに触れ、特に日本独自に発展した「kawaii future bass」に興味を持ち、サブカル系DJイベントに繰り出すようになる。
            </p>
            <p>
              次第に一人で場を沸かせることができるDJそのものにも興味を持ち始め、自身でもDJを始める。影響を受けたkawaii future bass、ボーカロイド、J-POPを中心としたDJプレイを行う。
            </p>
            <p>
              2024年4月からは、エレクトロサウンドを中心としたオリジナル楽曲のストリーミング配信・YouTube投稿をスタートし、「DJ×トラックメイカー」のポジションを目指し活動中。
            </p>
          </div>

          {/* ジャンルセクション */}
          <div className="pt-20 mt-20 border-t border-gray-100">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-8 text-gray-400">
              Main Genres
            </h3>
            <ul className="grid grid-cols-2 gap-4 text-sm font-black italic uppercase tracking-tighter mb-12">
              <li>- Kawaii Future Bass</li>
              <li>- Vocaloid Music</li>
              <li>- Electro Pop</li>
              <li>- EDM</li>
            </ul>

            {/* YouTube リンクボタン (追加！) */}
            <Link 
              href="https://www.youtube.com/@Rabbiychannel" 
              target="_blank"
              className="inline-flex items-center justify-center w-full md:w-auto bg-red-600 text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-lg active:scale-[0.98]"
            >
              <span className="mr-3 text-lg">▶</span>
              Subscribe on YouTube
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}