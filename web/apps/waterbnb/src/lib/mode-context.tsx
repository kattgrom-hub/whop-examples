"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Mode = "hosting" | "traveling";

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: "hosting",
  toggleMode: () => {},
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("hosting");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("waterbnb-mode");
    if (saved === "hosting" || saved === "traveling") {
      setMode(saved);
    }
    setMounted(true);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "hosting" ? "traveling" : "hosting";
      localStorage.setItem("waterbnb-mode", next);
      return next;
    });
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
