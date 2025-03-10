"use client";

import { UserEntity } from "@/models/entity/UserEntity";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type AuthProps = {
  user: UserEntity | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Fetch session when app starts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session fetch failed:", err);
      }
    };

    fetchSession();
  }, []);

  // ✅ Login Function
  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      router.push("/dashboard"); // Redirect after login
      return true;
    } else {
      setError("Invalid email or password");
      return false;
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/login"); // Redirect after logout
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
