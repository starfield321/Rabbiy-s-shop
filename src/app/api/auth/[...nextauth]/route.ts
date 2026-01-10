import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Resend } from 'resend';
import { createClient } from "@supabase/supabase-js";
import bcrypt from 'bcryptjs';

const resend = new Resend(process.env.RESEND_API_KEY);

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

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) return null;

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
    strategy: "jwt",
  },

  pages: {
    signIn: '/', 
  },

  callbacks: {
    // ★追加：Googleログイン時に既存ユーザーと紐付け、または新規作成するロジック
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const normalizedEmail = user.email.toLowerCase();
        
        // 既存のユーザーをチェック
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (!existingUser) {
          // ユーザーが存在しない場合、usersテーブルに新規作成
          await supabaseAdmin.from('users').insert([{
            name: user.name,
            email: normalizedEmail,
            role: 'user'
          }]);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // 初回ログイン時、DBから最新のIDを取得してトークンにセットする
      if (user) {
        const { data: dbUser } = await supabaseAdmin
          .from('users')
          .select('id, role')
          .eq('email', user.email?.toLowerCase())
          .maybeSingle();

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        } else {
          token.id = user.id;
        }
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