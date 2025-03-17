/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, account, credentials }) {
      try {
        if (account?.provider === "credentials") {
          const mode = (credentials as any)?.mode;
          const endpoint = mode === 'register' 
            ? `${process.env.BASE_URL}/api/v1/register`
            : `${process.env.BASE_URL}/api/v1/login`;

          console.log("credentials", credentials)

          console.log("user", user)

          const requestBody = mode === 'register' 
            ? {
                email: user?.email,
                password: credentials?.password,
                full_name: credentials?.name
              }
            : {
                username: user?.email,
                password: credentials?.password
              };

          console.log("requestBody", requestBody)

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();
          console.log("data", JSON.stringify(data, null, 2));
          if (data.detail) {
            console.error("Full error details:", JSON.stringify(data.detail, null, 2));
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
            (user as any).subscription = data.subscription;
            return true;
          }
        }
        return false;
      } catch (error: any) {
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
        session.subscription=token.subscription
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
 