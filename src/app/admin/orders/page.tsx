'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNav from '@/components/AdminNav';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. データを取得する関数
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. ステータスを更新する関数
  const toggleStatus = async (orderId: string, currentStatus: string) => {
    // ステータスが 'paid' なら 'shipped' へ、それ以外なら 'paid' に戻す
    const nextStatus = currentStatus === 'shipped' ? 'paid' : 'shipped';
    
    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', orderId);

    if (error) {
      alert('Update failed: ' + error.message);
      console.error(error);
    } else {
      // 成功したら一覧を再取得して表示を更新
      fetchOrders();
    }
  };

  // 売上合計の計算
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="font-black italic animate-pulse tracking-widest text-xs">LOADING_DATABASE...</p>
    </div>
  );

  return (
    <>
    <AdminNav />
    <div className="min-h-screen bg-white pt-32 pb-20 px-10">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end border-b-8 border-black pb-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Management_Terminal</p>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase">Order_List.</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total_Revenue</p>
            <p className="text-4xl font-black italic text-red-600">¥{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-6">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Total_Orders_</p>
            <p className="text-3xl font-black italic">{orders.length}</p>
          </div>
          <div className="border-2 border-zinc-100 p-6">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">System_Status_</p>
            <p className="text-3xl font-black italic text-green-500">LIVE_DATABASE</p>
          </div>
        </div>

        {/* ORDER TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="py-6 px-4">Date</th>
                <th className="py-6 px-4">Order_ID</th>
                <th className="py-6 px-4">Customer</th>
                <th className="py-6 px-4 text-right">Amount</th>
                <th className="py-6 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-zinc-50 transition-colors">
                  <td className="py-6 px-4 font-mono text-[10px]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-6 px-4 font-black italic uppercase text-xs tracking-tighter">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase">{order.customer_name || 'Guest'}</span>
                      <span className="text-[9px] font-mono text-zinc-400">{order.customer_email}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right font-black italic">
                    ¥{order.total_amount?.toLocaleString()}
                  </td>
                  <td className="py-6 px-4 text-center">
                    <button 
                      onClick={() => toggleStatus(order.id, order.status)}
                      className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                        order.status === 'shipped' 
                        ? 'bg-zinc-100 border-zinc-100 text-zinc-400' 
                        : 'bg-black border-black text-white hover:bg-red-600 hover:border-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                      }`}
                    >
                      {order.status === 'shipped' ? 'SHIPPED_DONE' : 'MARK_AS_SHIPPED_'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-zinc-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No_Orders_Received_Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}