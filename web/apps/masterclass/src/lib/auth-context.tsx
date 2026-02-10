"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";

interface WhopUserInfo {
  id: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  name?: string;
}

interface AuthContextType {
  user: WhopUserInfo | null;
  tokens: { access_token: string } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();

  const user: WhopUserInfo | null =
    status === "authenticated" && session?.user
      ? {
          id: session.user.id,
          username: session.user.username || "",
          email: session.user.email || "",
          profile_pic_url: session.user.profile_pic_url || session.user.image || undefined,
          name: session.user.name || undefined,
        }
      : null;

  const tokens =
    status === "authenticated" && session?.accessToken
      ? { access_token: session.accessToken }
      : null;

  return {
    user,
    tokens,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    login: () => {},
    logout: () => {
      signOut({ callbackUrl: "/" });
    },
  };
}
