"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useMemo, useCallback, type ReactNode } from "react";
import type { WhopUser } from "./types";

export type { WhopUser };

interface AuthContextType {
  user: WhopUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();

  const user: WhopUser | null = useMemo(() => {
    if (status !== "authenticated" || !session?.user) return null;
    return {
      id: session.user.id,
      username: session.user.username || "",
      email: session.user.email || "",
      profile_pic_url:
        session.user.profile_pic_url || session.user.image || undefined,
      name: session.user.name || undefined,
    };
  }, [status, session?.user?.id, session?.user?.username, session?.user?.email, session?.user?.profile_pic_url, session?.user?.image, session?.user?.name]);

  const logout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    logout,
  };
}
