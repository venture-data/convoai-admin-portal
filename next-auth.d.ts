import  { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    token?: string; 
    user?: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      profile_id?: string | null;
      token?: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
  }
}
