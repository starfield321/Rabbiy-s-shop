'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Clock, CheckCircle, Package, ArrowRight, MapPin } from "lucide-react";
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.email) {
        // のテーブル構造に基づき email で取得
        const { data, error } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount, email, items, address')
          .eq('email', session.user.email)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("注文履歴の取得に失敗:", error);
        } else {
          setOrders(data || []);
        }
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchOrders();
  }, [session, status]);

  if (status === "loading" || loading) return null;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-white pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      {/* 共通ドット背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* パンくずリストを配置 */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        {/* ヘッダーデザイン：最新のトンマナ */}
        <div className="relative mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Orders<span className="text-red-600 animate-pulse">.</span>
            </h1>

            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  Transaction Logs
              </span>
            </div>
          </div>

          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        <div className="space-y-16">
          {orders.length === 0 ? (
            <div className="py-20 text-center border-4 border-dashed border-zinc-100">
               <p className="text-zinc-300 font-black italic tracking-widest">No transaction data found.</p>
            </div>
          ) : (
            orders.map((order) => {
              // --- ステータス判定のロジックを強化 ---
              // のデフォルト値 'pending' や、Stripeの 'succeeded' などを
              // 「発送準備中」として扱います。明示的に 'shipped' (お届け済み) 以外は全て準備中へ。
              const isShipped = order.status === 'shipped' || order.status === 'delivered';
              const statusLabel = isShipped ? "お届け済み" : "発送準備中";
              const statusColor = isShipped ? "text-emerald-400" : "text-red-500";
              const StatusIcon = isShipped ? CheckCircle : Clock;

              return (
                <div key={order.id} className="border-4 border-black bg-white relative overflow-hidden">
                  
                  <div className="bg-black text-white px-8 py-4 flex flex-wrap justify-between items-center gap-4 font-mono">
                    <div className="flex items-center gap-6">
                      <span className="text-xs font-black italic tracking-[0.3em] tabular-nums">ID: {order.id.slice(0, 8)}</span>
                      <span className="text-[10px] font-bold text-zinc-500 italic">
                        {new Date(order.created_at).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-black italic tracking-widest ${statusColor}`}>
                      <StatusIcon size={12} />
                      {statusLabel}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    <div className="lg:col-span-8 p-8 md:p-12 space-y-10 border-b-2 lg:border-b-0 lg:border-r-2 border-zinc-100">
                      {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                        <Link key={idx} href={`/goods/${item.id}`} className="flex gap-8 group/item hover:opacity-80 transition-opacity">
                          <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-50 border-2 border-zinc-100 shrink-0 relative overflow-hidden group-hover/item:border-black transition-colors">
                            {item.image ? (
                              <Image src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name} fill className="object-contain p-2" unoptimized />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-zinc-200">
                                <Package size={32} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl md:text-3xl font-black italic tracking-tighter leading-none group-hover/item:text-red-600 transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-lg font-black italic tabular-nums leading-none">¥{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-6 font-mono">
                              <div>
                                <p className="text-[9px] font-black text-zinc-300 italic tracking-widest">Size</p>
                                <p className="text-xs font-black italic">{item.size || 'FREE'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-zinc-300 italic tracking-widest">Qty</p>
                                <p className="text-xs font-black italic tabular-nums">{item.quantity}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="lg:col-span-4 p-8 md:p-12 bg-zinc-50/30 flex flex-col justify-between space-y-16">
                      <div className="space-y-12">
                        {/* お届け先住所 の address カラムを表示 */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[11px] font-black italic tracking-[0.2em] text-zinc-400 font-mono">
                            <MapPin size={12} /> Delivery Address
                          </div>
                          <p className="text-[12px] font-bold text-black leading-relaxed pl-1">
                            {order.address}
                          </p>
                        </div>

                        {/* Payment Data デザイン再現 */}
                        <div className="space-y-8">
                          <div className="space-y-3">
                            <p className="text-[11px] font-black italic tracking-[0.2em] text-zinc-400 font-mono">Payment Data</p>
                            <div className="h-[6px] w-20 bg-red-600" />
                          </div>
                          
                          <div className="space-y-6">
                            <div className="flex justify-between items-center text-[13px] font-black italic tracking-widest text-zinc-400 font-mono">
                              <span>Subtotal</span>
                              <span className="text-black tabular-nums font-black">¥{(Number(order.total_amount) - 850).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[13px] font-black italic tracking-widest text-zinc-400 font-mono">
                              <span>Shipping</span>
                              <span className="text-black tabular-nums font-black">¥850</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right pt-8 border-t border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 italic tracking-widest mb-1 font-mono">Total Amount</p>
                        <p className="text-5xl font-black italic tracking-tighter text-black tabular-nums leading-none">
                          ¥{Number(order.total_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-32 flex justify-center">
            <Link href="/goods" className="group h-24 px-16 bg-white text-black flex items-center gap-8 transition-all duration-700 hover:bg-red-600 hover:text-white hover:border-red-600 relative overflow-hidden border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1">
                <div className="relative z-10 flex flex-col items-start">
                  <span className="text-sm font-black italic tracking-[0.4em] leading-none">Keep Walking</span>
                  <span className="text-[9px] font-bold tracking-[0.1em] mt-2">お買い物を続ける</span>
                </div>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out" />
            </Link>
        </div>
      </div>
    </main>
  );
}