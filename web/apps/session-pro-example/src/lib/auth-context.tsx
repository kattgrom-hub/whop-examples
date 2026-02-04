"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getTokens,
  getStoredUser,
  storeTokens,
  storeUser,
  clearAuthData,
  isTokenExpired,
  type AuthTokens,
  type UserInfo,
} from "./auth";

interface AuthContextType {
  user: UserInfo | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens, user: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tokens: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    const storedTokens = getTokens();
    const storedUser = getStoredUser();

    if (storedTokens && storedUser) {
      // Check if tokens are expired
      if (isTokenExpired(storedTokens)) {
        clearAuthData();
      } else {
        setTokens(storedTokens);
        setUser(storedUser);
      }
    }

    setIsLoading(false);
  }, []);

  const login = (newTokens: AuthTokens, newUser: UserInfo) => {
    storeTokens(newTokens);
    storeUser(newUser);
    setTokens(newTokens);
    setUser(newUser);
  };

  const logout = () => {
    clearAuthData();
    setTokens(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        isAuthenticated: !!user && !!tokens,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
