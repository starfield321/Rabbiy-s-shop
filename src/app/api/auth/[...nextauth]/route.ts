import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials"; // 追加
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Resend } from 'resend';
import { createClient } from "@supabase/supabase-js"; // クライアントが必要
import bcrypt from 'bcryptjs';

const resend = new Resend(process.env.RESEND_API_KEY);

// 認証用のSupabaseクライアント
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    // 1. パスワード認証 (Credentials) - 追加
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email.toLowerCase())
          .single();

        if (error || !user) return null;

        // ★ここでパスワードを照合
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) return null; // 違えばログイン拒否

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "【ショップ名】ログイン用リンクのご案内",
            html: `<div>...</div>`,
          });
          if (error) throw new Error(error.message);
        } catch (error) {
          throw new Error("SEND_VERIFICATION_EMAIL_ERROR");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt", // Credentialsを使う場合はJWTが推奨されます
  },

  pages: {
    signIn: '/', 
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };