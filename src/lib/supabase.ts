import { createBrowserClient } from '@supabase/ssr';

// 環境変数からキーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createBrowserClient を使用してクライアントを作成
// これによりブラウザ側でセッションが適切に管理・共有されます
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);