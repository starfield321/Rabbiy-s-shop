'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// 固定ルートのマッピング
const routeMap: { [key: string]: string } = {
  dashboard: 'Dashboard',
  edit: 'Edit Profile',
  orders: 'Order History',
  news: 'News',
  checkout: 'Checkout',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((v) => v);
  const [dynamicLabels, setDynamicLabels] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDynamicLabel = async () => {
      const targets = [
        { key: 'goods', table: 'goods', column: 'name' },
        { key: 'news', table: 'news', column: 'title' }
      ];

      for (const target of targets) {
        const parentIndex = pathSegments.indexOf(target.key);
        if (parentIndex !== -1 && pathSegments[parentIndex + 1]) {
          const id = pathSegments[parentIndex + 1];
          if (dynamicLabels[id]) continue;

          const { data, error } = await supabase
            .from(target.table)
            .select(target.column)
            .eq('id', id)
            .single();

          if (!error && data) {
            // 型安全に値を取り出すため、型アサーション(as any)を使用
            const label = (data as any)[target.column];
            if (label) {
              setDynamicLabels(prev => ({ ...prev, [id]: label }));
            }
          }
        }
      }
    };

    fetchDynamicLabel();
  }, [pathSegments, dynamicLabels]);

  if (pathname === '/' || pathSegments.length === 0) return null;

  return (
    <nav className="relative z-50 flex flex-wrap items-center gap-4 py-6 font-mono" aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="text-[10px] font-black italic tracking-[0.2em] text-zinc-300 hover:text-black transition-colors"
      >
        Home
      </Link>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        
        // ラベルの決定
        const label = routeMap[segment] || dynamicLabels[segment] || segment;

        return (
          <div key={href} className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-200">/</span>
            {isLast ? (
              <span className="text-[10px] font-black italic tracking-[0.2em] text-red-600 capitalize">
                {label}
              </span>
            ) : (
              <Link 
                href={href}
                className="text-[10px] font-black italic tracking-[0.2em] text-zinc-300 hover:text-black transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}