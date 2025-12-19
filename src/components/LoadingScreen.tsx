'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isExit, setIsExit] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 2秒後に終了アニメーション開始
    const timer = setTimeout(() => {
      setIsExit(true);
      // 0.8秒（transition-duration分）待ってから完全に消す
      setTimeout(() => setIsVisible(false), 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center bg-black transition-all duration-700 ease-in-out ${isExit ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100'}`}>
      
      {/* 背景の微細なノイズ */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

      <div className="relative flex flex-col items-center">
        {/* ロゴ画像: パルスアニメーション */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 animate-pulse">
          <Image
            src="/rabbiy_3d.png"
            alt="Loading Rabbiy"
            fill
            className="object-contain filter grayscale brightness-125"
            priority
          />
        </div>

        {/* プログレスバー（Tailwind標準のpingと色の変化で代用） */}
        <div className="mt-8 w-48 h-[1px] bg-zinc-800 relative">
          <div className="absolute inset-0 bg-red-600 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        <p className="mt-4 text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase italic">
          Synchronizing...
        </p>
      </div>
    </div>
  );
}