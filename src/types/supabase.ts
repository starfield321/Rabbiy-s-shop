// src/types/supabase.ts

// 💡 注意: これはビルドエラーを回避するための仮の型定義です。
// 実際にはSupabase CLIで生成される必要があります。

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          slug: string;
          price: number;
          description: string;
          image_url: string | null;
        };
        Insert: {};
        Update: {};
        
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};