'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, Save, AlertTriangle, ShieldCheck, Key } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    postal_code: '',
    prefecture: '',
    address1: '',
    address2: '',
  });

  const fetchAddressFromPostalCode = async (code: string) => {
    const cleanCode = code.replace(/[^0-9]/g, '');
    if (cleanCode.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`);
        const data = await res.json();
        if (data.results) {
          const result = data.results[0];
          setProfile(prev => ({
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
      // 修正ポイント：sessionからidを取得
      const userId = (session?.user as any)?.id;

      if (userId) {
        const { data } = await supabase
          .from('users')
          .select('name, phone, postal_code, prefecture, address1, address2')
          .eq('id', userId) // emailではなくidで検索
          .maybeSingle();
        
        if (data) {
          setProfile({
            name: data.name || '',
            phone: data.phone || '',
            postal_code: data.postal_code || '',
            prefecture: data.prefecture || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
          });
        }
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  const handleDeleteAccount = async () => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId); // idで指定して削除

      if (error) throw error;
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      console.error('Delete error:', err);
      alert('アカウントの削除に失敗しました。');
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const userId = (session?.user as any)?.id;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          phone: profile.phone,
          postal_code: profile.postal_code,
          prefecture: profile.prefecture,
          address1: profile.address1,
          address2: profile.address2,
        })
        .eq('id', userId); // 修正ポイント：emailではなくidで更新

      if (error) throw error;
      
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return null;

  return (
    <main className="max-w-4xl mx-auto min-h-screen bg-white pt-24 lg:pt-40 pb-40 px-6 md:px-10 text-black font-sans relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <Breadcrumbs />
        </div>
        
        <div className="relative mb-16 lg:mb-24 group">
          <div className="relative flex items-end min-h-[64px] md:min-h-[96px]">
            <h1 className="relative z-10 text-6xl md:text-8xl font-black italic tracking-tighter leading-none flex items-baseline bg-white pr-6">
              Setting<span className="text-red-600 animate-pulse">.</span>
            </h1>
            <div className="absolute right-0 bottom-1 md:bottom-2 z-0 pointer-events-none">
              <span className="text-xl md:text-4xl font-black italic tracking-[0.2em] text-zinc-100 select-none whitespace-nowrap">
                  Profile Update
              </span>
            </div>
          </div>
          <div className="h-[6px] w-full bg-black mt-4 flex">
            <div className="h-full w-32 bg-red-600"></div>
          </div>
        </div>

        <div className="flex items-start mb-20">
          <div className="w-[8px] h-16 bg-red-600 mr-8 flex-shrink-0" />
          <div className="space-y-2 pt-1">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">Update Your Identity.</h2>
            <p className="text-xs font-bold text-zinc-500 leading-relaxed">
              お届け先や連絡先を最新の状態に保ちます。
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4 group">
            <label className="text-[11px] font-black tracking-[0.2em] text-zinc-400 group-focus-within:text-red-600 transition-colors italic font-mono">Name / お名前</label>
            <input 
              required
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent"
            />
          </div>

          <div className="space-y-4 group">
            <label className="text-[11px] font-black tracking-[0.2em] text-zinc-400 group-focus-within:text-red-600 transition-colors italic font-mono">Phone / 電話番号</label>
            <input 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              placeholder="090-0000-0000"
              className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent tabular-nums"
            />
          </div>

          <div className="space-y-4 group">
            <label className="text-[11px] font-black tracking-[0.2em] text-zinc-400 group-focus-within:text-red-600 transition-colors italic font-mono">Postal Code / 郵便番号</label>
            <input 
              value={profile.postal_code} 
              onChange={(e) => {
                setProfile({...profile, postal_code: e.target.value});
                fetchAddressFromPostalCode(e.target.value);
              }} 
              placeholder="0000000" 
              className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent tabular-nums" 
            />
          </div>

          <div className="space-y-4 group">
            <label className="text-[11px] font-black tracking-[0.2em] text-zinc-400 group-focus-within:text-red-600 transition-colors italic font-mono">Prefecture / 都道府県</label>
            <div className="relative">
              <select 
                value={profile.prefecture} 
                onChange={(e) => setProfile({...profile, prefecture: e.target.value})} 
                className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent tabular-nums"
              >
                <option value="">選択してください</option>
                {PREFECTURES.map(pref => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 group">
            <label className="text-[11px] font-black tracking-[0.2em] text-zinc-400 group-focus-within:text-red-600 transition-colors italic font-mono">Address 1 / 市区町村・番地</label>
            <input 
              value={profile.address1} 
              onChange={(e) => setProfile({...profile, address1: e.target.value})} 
              placeholder="市区町村、番地" 
              className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent tabular-nums" 
            />
          </div>

          <div className="space-y-4 group">
            <label className="text-[11px] font-black tracking-[0.2em] text-zinc-400 group-focus-within:text-red-600 transition-colors italic font-mono">Address 2 / 建物名・部屋番号</label>
            <input 
              value={profile.address2} 
              onChange={(e) => setProfile({...profile, address2: e.target.value})} 
              placeholder="マンション名・号室" 
              className="w-full border-b-2 border-black py-4 font-bold text-lg outline-none focus:border-red-600 transition-colors bg-transparent tabular-nums" 
            />
          </div>

          <div className="mt-24 lg:mt-32 pt-16 lg:pt-24 border-t-2 border-zinc-100">
            <div className="flex items-start mb-12">
              <div className="w-[8px] h-12 bg-black mr-8 flex-shrink-0" />
              <div className="space-y-2 pt-1">
                <h2 className="text-2xl font-black italic tracking-tighter">Security Access.</h2>
                <p className="text-[10px] font-bold text-zinc-400 tracking-widest italic">Password Management / パスワード設定</p>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-100 p-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-black leading-relaxed italic tracking-wider">
                  セキュリティ保護のため、定期的な更新を推奨します。
                </p>
                <p className="text-[10px] text-zinc-400 font-medium">
                  ご登録のメールアドレスへ再設定用のリンクを送信します。
                </p>
              </div>
              <Link 
                href="reset-password" 
                className="h-16 px-10 bg-black text-white font-black italic text-xs tracking-[0.2em] flex items-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
              >
                <span>パスワードを再設定する</span>
                <Key size={18} className="group-hover:rotate-12 transition-transform duration-500" />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4">
             <ShieldCheck size={18} className="text-red-600" />
             <span className="text-[10px] font-mono text-zinc-300 tracking-widest italic font-bold">End-to-end encrypted profile data</span>
          </div>

          <button 
            disabled={saving}
            className={`w-full h-24 font-black italic tracking-[0.3em] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center group relative overflow-hidden border-2 border-black
              ${saving 
                ? 'bg-zinc-100 text-zinc-400 border-zinc-100 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-red-600 hover:border-red-600 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:scale-[0.98]'
              }`}
          >
            <span className="relative z-10 flex items-center gap-6 text-xl">
              {saving ? 'Saving...' : '変更内容を保存する'}
              {!saving && <Save size={22} className="group-hover:scale-110 transition-transform duration-500" />}
            </span>
            {!saving && (
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out" />
            )}
          </button>
        </form>

        <div className="mt-32 lg:mt-40 pt-16 lg:pt-24 border-t-2 border-zinc-100">
            <div className="bg-red-50/20 border-2 border-dashed border-red-100 p-12 text-center space-y-6">
                <div className="flex items-center justify-center gap-4 text-red-600 font-black italic">
                  <AlertTriangle size={24} />
                  <h3>Danger Zone</h3>
                </div>
                <p className="text-[11px] font-bold text-red-800/60 leading-relaxed italic mx-auto">
                アカウントを削除すると、これまでの全てのデータが消去され、復元することはできません。
                </p>
                <div className="pt-4 flex flex-col items-center">
                {!showDeleteConfirm ? (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="h-14 px-10 border-2 border-red-600 text-red-600 font-black italic text-xs tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-500 shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] hover:shadow-none translate-y-0 active:translate-y-1"
                    >
                      アカウントを削除する
                    </button>
                ) : (
                    <div className="flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-2 duration-500">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className={`h-14 px-10 bg-red-600 text-white border-2 border-red-600 font-black italic text-xs tracking-[0.2em] transition-all shadow-xl
                        ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}
                      `}
                    >
                        {isDeleting ? 'Deleting...' : '本当に削除する'}
                    </button>
                    <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-[11px] font-black text-zinc-400 hover:text-black transition-all italic border-b border-transparent hover:border-black pb-1"
                    >
                        キャンセル
                    </button>
                    </div>
                )}
                </div>
            </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-3 text-[11px] font-black text-zinc-400 italic hover:text-black transition-all group">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            Dashboard / 戻る
          </Link>
        </div>
      </div>
    </main>
  );
}