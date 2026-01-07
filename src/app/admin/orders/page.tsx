'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';
import { useRouter } from 'next/navigation';
import { ShieldCheck, RefreshCw, Package, Clock, User, CreditCard } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Authentication側の正しいUID
      const ADMIN_UID = '39bfee29-e299-4174-ac74-d99c284c53ac';

      if (user && user.id === ADMIN_UID) {
        setIsAuthorized(true);
        fetchOrders();
      } else {
        setTimeout(async () => {
          const { data: { user: retryUser } } = await supabase.auth.getUser();
          if (retryUser && retryUser.id === ADMIN_UID) {
            setIsAuthorized(true);
            fetchOrders();
          } else {
            router.replace('/admin/login');
          }
        }, 800);
      }
    };
    checkAdmin();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const toggleStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'shipped' ? 'paid' : 'shipped';
    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', orderId);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      fetchOrders();
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  if (!isAuthorized) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-zinc-200" size={32} />
        <p className="font-black italic tracking-widest text-[10px] text-black">Authorizing Access...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pt-20 pb-40 px-6 md:px-10 text-black font-sans relative overflow-x-hidden">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16 mt-20">
        
        {/* ヘッダーデザイン：ProductPageと統一 */}
        <div className="relative mb-24 group">
          <div className="relative flex items-end justify-between min-h-[64px] md:min-h-[96px]">
            <div className="flex items-baseline bg-white pr-6 z-10">
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
                Order List<span className="text-red-600 animate-pulse">.</span>
              </h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black tracking-[0.3em] text-zinc-400 mb-2 italic">Total Revenue</p>
              <p className="text-5xl font-black italic text-red-600 tracking-tighter">¥{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
          <div className="mt-2">
            <span className="text-xs font-black italic tracking-[0.2em] text-zinc-300">
                Customer Transaction History
            </span>
          </div>
        </div>

        {/* 注文一覧リスト */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black italic tracking-tighter border-l-4 border-black pl-4">
              Management Inventory
            </h2>
            <div className="px-3 py-1 bg-zinc-100 text-[10px] font-black italic rounded-full">
              {orders.length} RECORDS
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="group bg-zinc-50 border border-zinc-100 p-6 md:p-8 transition-all hover:border-black relative overflow-hidden">
                {/* ステータスに応じた背景アクセント */}
                <div className={`absolute top-0 left-0 w-1 h-full ${order.status === 'shipped' ? 'bg-zinc-200' : 'bg-red-600'}`} />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                  
                  {/* 日付とID */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold tracking-widest">Ordered At</span>
                    </div>
                    <p className="text-sm font-mono font-bold">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="text-[9px] font-bold text-zinc-300 tracking-tighter">ID: {order.id.slice(0, 18)}...</p>
                  </div>

                  {/* 顧客情報 */}
                  <div className="space-y-1 border-l border-zinc-200 pl-8">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <User size={12} />
                      <span className="text-[10px] font-bold tracking-widest">Customer info</span>
                    </div>
                    <p className="text-sm font-black italic tracking-tighter">{order.customer_name || 'Guest User'}</p>
                    <p className="text-[10px] font-bold text-zinc-400">{order.email}</p>
                  </div>

                  {/* 金額 */}
                  <div className="space-y-1 border-l border-zinc-200 pl-8">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <CreditCard size={12} />
                      <span className="text-[10px] font-bold tracking-widest">Payment</span>
                    </div>
                    <p className="text-2xl font-black italic tracking-tighter text-black">
                      ¥{order.total_amount?.toLocaleString()}
                    </p>
                  </div>

                  {/* アクションボタン：ProductPageのSaveボタン風デザイン */}
                  <div className="flex justify-end">
                    <button 
                      onClick={() => toggleStatus(order.id, order.status)}
                      className={`h-12 px-8 font-black italic text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${
                        order.status === 'shipped' 
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none' 
                        : 'bg-black text-white hover:bg-red-600 hover:-translate-y-1 active:translate-y-0'
                      }`}
                    >
                      <Package size={16} />
                      <span>{order.status === 'shipped' ? 'Shipped Done' : 'Mark as Shipped'}</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}

            {orders.length === 0 && !loading && (
              <div className="py-32 text-center border-2 border-dashed border-zinc-100 bg-zinc-50/50">
                <p className="text-[11px] font-black tracking-[0.3em] text-zinc-300 italic">No Orders Received In This Terminal</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}