'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isExit, setIsExit] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.2; // 進捗スピード
      });
    }, 20);

    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsExit(true);
        setTimeout(() => setIsVisible(false), 800);
      }, 1000); // 完了後に少し余韻を残す
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [progress]);

  if (!isVisible) return null;

  // キャラクターの横位置を計算（進捗50%で画面中央に到達し、そこから静止）
  const characterLeft = Math.min(progress, 50); 
  // 透明度（0%から70%くらいにかけてクッキリさせる）
  const characterOpacity = Math.min(progress / 70, 1);

  return (
    <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black transition-all duration-1000 ${isExit ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}>
      
      {/* 背景の微細なドット */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      <div className="relative w-full max-w-2xl px-10 flex flex-col items-center">
        
        {/* --- キャラクターエリア --- */}
        <div className="relative w-full h-64 md:h-80 mb-10 overflow-hidden">
          <div 
            className="absolute bottom-0 transition-all duration-700 ease-out"
            style={{ 
              left: `${characterLeft}%`, 
              transform: `translateX(-50%)`,
              opacity: characterOpacity
            }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <Image
                src="/rabbiy_dash.png"
                alt="Rabbiy"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* --- プログレスバー --- */}
        <div className="w-full h-[1px] bg-zinc-900 relative">
          <div 
            className="absolute inset-y-0 left-0 bg-red-600 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(220,38,38,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* --- ステータス表示 --- */}
        <div className="mt-8 w-full flex justify-between items-baseline font-black italic">
          <span className="text-[10px] tracking-[0.6em] text-zinc-600 uppercase">System Loading...</span>
          <span className="text-4xl text-white tracking-tighter tabular-nums">
            {Math.floor(progress)}<span className="text-xs ml-1 not-italic opacity-40">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}