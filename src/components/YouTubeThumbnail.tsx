'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function YouTubeThumbnail({ videoId, alt }: { videoId: string; alt: string }) {
  // 最初は最大サイズ(maxresdefault)を試す
  const [imgSrc, setImgSrc] = useState(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
      unoptimized
      // 読み込みエラーが起きたら標準サイズ(hqdefault)に切り替える
      onError={() => {
        setImgSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      }}
    />
  );
}