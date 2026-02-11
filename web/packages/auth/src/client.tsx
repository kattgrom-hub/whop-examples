"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";
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

  const user: WhopUser | null =
    status === "authenticated" && session?.user
      ? {
          id: session.user.id,
          username: session.user.username || "",
          email: session.user.email || "",
          profile_pic_url:
            session.user.profile_pic_url || session.user.image || undefined,
          name: session.user.name || undefined,
        }
      : null;

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    logout: () => {
      signOut({ callbackUrl: "/" });
    },
  };
}
