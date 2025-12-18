import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 md:py-32">
      {/* メインタイトル */}
      <div className="mb-20 border-b-4 border-black pb-4">
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
          Biography
        </h1>
        <p className="text-gray-400 text-xs tracking-[0.4em] mt-4 uppercase font-bold">
          Artist Profile / Rabbiy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* 左側：アーティスト名（固定表示風） */}
        <div className="md:col-span-4">
          <h2 className="text-4xl font-black sticky top-32 leading-none uppercase italic">
            Rabbiy
            <span className="block text-[10px] tracking-widest text-red-600 mt-2 not-italic">
              DJ / TRACK MAKER
            </span>
          </h2>
        </div>

        {/* 右側：バイオグラフィー本文 */}
        <div className="md:col-span-8 space-y-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl font-bold leading-relaxed tracking-tight text-gray-900 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
              千葉県出身。高校時代に邦ロックにのめり込みギターを始める。
              その後DTMでボーカロイドを用いた楽曲制作を始め、ロックだけでなくテクノポップやEDMに触れ、特に日本独自に発展した「kawaii future bass」に興味を持ち、サブカル系DJイベントに繰り出すようになる。
            </p>
            
            <p className="text-lg md:text-xl font-bold leading-relaxed tracking-tight text-gray-900 mt-8">
              次第に一人で場を沸かせることができるDJそのものにも興味を持ち始め、TOKYO DJ部に入部。影響を受けたkawaii future bass、ボーカロイド、J-POPを中心としたDJプレイを行う。
            </p>
            
            <p className="text-lg md:text-xl font-bold leading-relaxed tracking-tight text-gray-900 mt-8">
              2024年4月からは、エレクトロサウンドを中心としたオリジナル楽曲のストリーミング配信・YouTube投稿をスタートし、「DJ×トラックメイカー」のポジションを目指し活動中。
            </p>
          </div>

          {/* 活動実績などのリスト（もしあれば追加可能） */}
          <div className="pt-20 border-t border-gray-100">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-8 text-gray-400">
              Main Genres
            </h3>
            <ul className="grid grid-cols-2 gap-4 text-sm font-black italic uppercase tracking-tighter">
              <li>- Kawaii Future Bass</li>
              <li>- Vocaloid Music</li>
              <li>- Electro Pop</li>
              <li>- EDM</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}