'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isExit, setIsExit] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 擬似的に進捗を進めるタイマー
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // 最初は速く、後半は少しゆっくり進む演出
        const increment = prev < 70 ? 2 : 1;
        return prev + increment;
      });
    }, 30);

    // 100%になったら少し待ってからフェードアウト
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsExit(true);
        setTimeout(() => setIsVisible(false), 800);
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black transition-all duration-700 ${isExit ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      
      {/* 背景のグリッド（うっすらデジタル感を出す） */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md px-10">
        
        {/* --- キャラクターの走行エリア --- */}
        <div className="relative w-full h-32 mb-4">
          <div 
            className="absolute bottom-0 transition-all duration-300 ease-out"
            style={{ 
              left: `${progress}%`, 
              transform: `translateX(-50%)`, // 自分の中心を基準に移動
              opacity: progress / 100 + 0.2 // 徐々に濃くなる（最低0.2確保）
            }}
          >
            {/* キャラクター画像 */}
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <Image
                src="/rabbiy_dash.png" // ここを走らせるキャラクター画像に
                alt="Loading..."
                fill
                className="object-contain animate-bounce" // 上下にぴょこぴょこ跳ねながら走る
                style={{ animationDuration: '0.6s' }}
                priority
              />
            </div>
          </div>
        </div>

        {/* --- プログレスバー --- */}
        <div className="w-full h-[2px] bg-zinc-800 relative overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* --- テキスト情報 --- */}
        <div className="mt-6 flex justify-between items-end font-black italic">
          <div className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase">
            Synchronizing...
          </div>
          <div className="text-2xl text-white leading-none">
            {progress}<span className="text-[10px] ml-1">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}