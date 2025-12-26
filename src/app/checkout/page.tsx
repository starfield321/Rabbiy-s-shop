'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import LoginModal from '@/components/LoginModal';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { supabase } from '@/lib/supabase';
import { UserCheck, ArrowRight, Truck, Minus, Plus, ChevronLeft, Lock } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, updateQuantity } = useCart();
  const { data: session, status } = useSession();
  const [savedProfile, setSavedProfile] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '', email: '', phone: '', postal_code: '', prefecture: '', address1: '', address2: ''
  });

  const SHIPPING_FEE = 850;
  const finalAmount = cartTotal + SHIPPING_FEE;

  const fetchAddressFromPostalCode = async (code: string) => {
    const cleanCode = code.replace(/[^0-9]/g, '');
    if (cleanCode.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`);
        const data = await res.json();
        if (data.results) {
          const result = data.results[0];
          setFormValues(prev => ({
            ...prev,
            prefecture: result.address1,
            address1: result.address2 + result.address3,
            postal_code: code 
          }));
        }
      } catch (error) {
        console.error("住所取得失敗:", error);
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        const { data } = await supabase.from('users').select('*').eq('email', session.user.email).maybeSingle();
        if (data) {
          setSavedProfile(data);
          setFormValues({
            name: data.name || '',
            email: session.user?.email || '',
            phone: data.phone || '',
            postal_code: data.postal_code || '',
            prefecture: data.prefecture || '',
            address1: data.address1 || '',
            address2: data.address2 || ''
          });
        }
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  const handleApplyProfile = () => {
    if (savedProfile) {
      setFormValues({
        name: savedProfile.name || '',
        email: session?.user?.email || savedProfile.email || '',
        phone: savedProfile.phone || '',
        postal_code: savedProfile.postal_code || '',
        prefecture: savedProfile.prefecture || '',
        address1: savedProfile.address1 || '',
        address2: savedProfile.address2 || ''
      });
    }
  };

  if (status === "loading") return null;

  return (
    <main className="min-h-screen bg-white pt-40 pb-40 px-6 md:px-10 text-black font-sans relative">
      <div className="max-w-6xl mx-auto relative z-10">

        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        <div className="relative mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Checkout<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none font-['Geist',_'Geist_Fallback'] whitespace-nowrap">
                  Artist Profile
              </span>
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          <div className="lg:col-span-7 space-y-16">
            
            {status === "unauthenticated" ? (
              <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 p-12 md:p-20 text-center space-y-10">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
                    <Lock size={32} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase font-['Geist',_'Geist_Fallback']">
                    Authentication Required_
                  </h2>
                  <p className="text-sm font-bold text-zinc-400 italic tracking-widest leading-relaxed">
                    ご購入手続きを続けるには、アカウントへのログインが必要です。
                  </p>
                </div>
                <div className="pt-6 flex flex-col items-center gap-6">
                  <button onClick={() => setIsLoginModalOpen(true)} className="bg-black text-white px-12 py-6 font-black italic tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-4 group">
                    ログインして進む
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <Link href="/signup" className="text-[10px] font-black italic text-zinc-400 hover:text-black transition-colors border-b border-zinc-200 pb-1 uppercase tracking-widest">
                    新規会員登録はこちら
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                <section className="space-y-12 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-black text-white px-4 py-2 font-black italic text-sm tracking-tighter tabular-nums">
                      Step 01
                    </div>
                    <div className="relative">
                      <h2 className="text-2xl font-black italic tracking-tighter border-b-4 border-red-600 pr-4">
                        配送先情報
                      </h2>
                    </div>
                  </div>

                  {savedProfile && (
                    <div className="bg-zinc-50 border border-zinc-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-3">
                        <UserCheck size={20} className="text-zinc-400" />
                        <p className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">保存済みの情報を反映できます</p>
                      </div>
                      <button onClick={handleApplyProfile} className="bg-white border-2 border-black px-6 py-3 font-black italic text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 group">
                        情報を反映する
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 px-2">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 tracking-widest italic uppercase">お名前</label>
                      <input type="text" placeholder="山田 太郎" value={formValues.name} onChange={e => setFormValues({...formValues, name: e.target.value})} className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 tracking-widest italic uppercase">メールアドレス</label>
                      <input type="email" placeholder="example@mail.com" value={formValues.email} onChange={e => setFormValues({...formValues, email: e.target.value})} className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 tracking-widest italic uppercase">電話番号</label>
                      <input type="tel" placeholder="09012345678" value={formValues.phone} onChange={e => setFormValues({...formValues, phone: e.target.value})} className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 tracking-widest italic uppercase">郵便番号 (自動入力)</label>
                      <input type="text" placeholder="1234567" value={formValues.postal_code} onChange={e => { const val = e.target.value; setFormValues({...formValues, postal_code: val}); fetchAddressFromPostalCode(val); }} className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 tracking-widest italic uppercase">都道府県</label>
                      <select value={formValues.prefecture} onChange={e => setFormValues({...formValues, prefecture: e.target.value})} className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent appearance-none cursor-pointer">
                        <option value="">選択してください</option>
                        {PREFECTURES.map(pref => <option key={pref} value={pref}>{pref}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 tracking-widest italic uppercase">住所1 (市区町村・番地)</label>
                      <input type="text" placeholder="渋谷区道玄坂 1-2-3" value={formValues.address1} onChange={e => setFormValues({...formValues, address1: e.target.value})} className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 tracking-widest italic uppercase">住所2 (建物名・部屋番号)</label>
                      <input type="text" placeholder="ラビィビル 404号室" value={formValues.address2} onChange={e => setFormValues({...formValues, address2: e.target.value})} className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent" />
                    </div>
                  </div>
                </section>

                <section className="bg-zinc-50 p-10 md:p-14 relative border-black">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600" />
                  <Elements stripe={stripePromise} key={formValues.email + formValues.postal_code}>
                    <CheckoutForm 
                      initialEmail={formValues.email} 
                      initialName={formValues.name}
                      initialPhone={formValues.phone}
                      initialPostalCode={formValues.postal_code}
                      initialAddress={`${formValues.prefecture}${formValues.address1} ${formValues.address2}`.trim()}
                    />
                  </Elements>
                </section>
              </div>
            )}
          </div>

          {/* 右側：Sticky機能の適用 */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-32 space-y-12">
            <div className="border border-black p-10 bg-white">
              <div className="mb-12 flex items-center">
                {/* 下線を削除し、左横の縦線に変更 */}
                <div className="w-[6px] h-8 bg-red-600 mr-4" />
                <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                  <Truck size={24} /> 注文内容の確認
                </h2>
              </div>

              <div className="space-y-10 mb-12 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-6 border-b border-zinc-100 pb-8 last:border-0 last:pb-0">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-zinc-50 border border-zinc-100 shrink-0 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
                        {item.image && <Image src={Array.isArray(item.image) ? item.image[0] : item.image.split(',')[0]} alt={item.name} fill className="object-cover" unoptimized />}
                      </div>
                      <div className="space-y-3">
                        <p className="font-black text-sm italic leading-tight">{item.name}</p>
                        <p className="text-[9px] font-bold text-zinc-400 tracking-widest italic uppercase">SIZE: {item.size || 'FREE'}</p>
                        <div className="flex items-center border border-black w-fit bg-white">
                          <button onClick={() => updateQuantity(item.id, item.size, -1)} className="px-2 py-1 hover:bg-zinc-100 transition-colors"><Minus size={10}/></button>
                          <span className="text-xs font-black px-3 border-x border-black tabular-nums">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, 1)} className="px-2 py-1 hover:bg-zinc-100 transition-colors"><Plus size={10}/></button>
                        </div>
                      </div>
                    </div>
                    <p className="font-black italic text-lg tabular-nums">¥{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t-4 border-black pt-10">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 tracking-widest italic uppercase">
                  <span>商品小計</span>
                  <span className="tabular-nums">¥{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 tracking-widest italic uppercase">
                  <span>配送料</span>
                  <span className="tabular-nums">¥850</span>
                </div>
                <div className="flex justify-between items-end pt-10 mt-6 border-t border-zinc-100">
                  <span className="text-lg font-black italic tracking-[0.2em] uppercase font-['Geist',_'Geist_Fallback']">Total</span>
                  <span className="text-5xl font-black italic text-red-600 leading-none tabular-nums tracking-tighter font-['Geist',_'Geist_Fallback']">
                    ¥{finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 px-2">
              <Link href="/goods" className="w-full bg-white border-2 border-black py-4 font-black italic text-xs tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-4 group uppercase">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                お買い物を続ける
              </Link>
            </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </main>
  );
}