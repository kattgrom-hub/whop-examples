import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      username: string;
      profile_pic_url: string;
    } & DefaultSession["user"];
  }
}

export interface WhopUser {
  id: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  name?: string;
}
