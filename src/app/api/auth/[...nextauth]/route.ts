/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, account, credentials }) {
      console.log("Sign-in callback called with:", { 
        email: user?.email, 
        provider: account?.provider, 
        mode: (credentials as any)?.mode 
      });
      
      try {
        if (account?.provider === "credentials") {
          const mode = (credentials as any)?.mode;
          const endpoint = mode === 'register' 
            ? `${process.env.BASE_URL}/auth/register`
            : `${process.env.BASE_URL}/auth/login`;

          console.log("Sending request to:", endpoint);
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user?.email,
              password: credentials?.password,
              name: credentials?.name || 'User',
              provider: 'manual',
            }),
          });

          const data = await response.json();
          console.log("Backend response:", data);

          console.log("data",data);
          if (data.detail) {
            throw new Error(data.detail);
          }

          if (!response.ok) {
            throw new Error("Authentication failed");
          }

          if (data.token) {
            (user as any).token = data.token;
            (user as any).email = data.email;
            (user as any).name = data.name;
            return true;
          }
          
          throw new Error("Invalid response from authentication server");
        } else if (account?.provider === "google") {
          console.log(process.env.BASE_URL)
          const endpoint = `${process.env.BASE_URL}/auth/login`;
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user?.email,
              name: user?.name,
              provider: 'google',
              profile_id: account?.providerAccountId,
            }),
          });
          const data = await response.json();
          if (data.token) {
            (user as any).token = data.token;
            (user as any).email = data.email;
            (user as any).name = data.name;
            return true;
          }
        }
        return false;
      } catch (error: any) {
        console.log("Sign-in error details:", error);
        throw new Error(error.message || "Authentication failed");
      }
    },
    async jwt({ token,user, account }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.provider = account?.provider; 
        token.token=user.token;
      }
      return token;
    },
    async session({ session, token }:any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.provider = token.provider;
        session.token=token.token;
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      allowDangerousEmailAccountLinking:true
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any) {
        try {
          return {
            email: credentials?.email,
            password: credentials?.password,
            id: credentials?.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET!,
  debug: true,

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },

  jwt: {
    maxAge: 30 * 60,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
 