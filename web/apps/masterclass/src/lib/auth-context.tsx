"use client";

import { useSession } from "next-auth/react";
export { AuthProvider } from "@whop-examples/auth/client";
export { type WhopUser } from "@whop-examples/auth/client";
import { useAuth as useBaseAuth } from "@whop-examples/auth/client";

interface MasterclassUser {
  id: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  name?: string;
  companyId: string;
}

interface MasterclassAuthContextType {
  user: MasterclassUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export function useAuth(): MasterclassAuthContextType {
  const base = useBaseAuth();
  const { data: session } = useSession();

  const user: MasterclassUser | null = base.user
    ? {
        ...base.user,
        companyId: (session?.user as unknown as { companyId?: string })?.companyId || "",
      }
    : null;

  return {
    ...base,
    user,
  };
}
