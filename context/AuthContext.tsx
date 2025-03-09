"use client";

import { UserEntity } from "@/models/entity/UserEntity";
import { createContext, useContext, useState } from "react";

import { getCookie, setCookie, deleteCookie } from "@/utils/cookieUtils";
import { authService } from "@/utils/appModule";

export type CustomizationProps = {
  user: UserEntity | null;
  error: string | null;
  logout: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  getSession: () => Promise<boolean>;
};

const initialState: CustomizationProps = {
  user: null,
  error: null,
  logout: async () => false,
  login: async (email: string, password: string) => false,
  getSession: async () => false,
};

const AuthContext = createContext(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [error, setError] = useState<any | null>(null);

  const logout = async (): Promise<boolean> => {
    setUser(null);
    deleteCookie("user");
    setError(null);
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email.length == 0 || password.length == 0) {
      setError("Email dan Password harus diisi!");
      return false;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setCookie("user", data.user.email);
      setError(null);
      return true;
    } else {
      setError("Email dan Password tidak sesuai!");
      return false;
    }
  };

  const getSession = async (): Promise<boolean> => {
    const response = await fetch("/api/auth/session");
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setError(null);
      return true;
    } else {
      setError("User tidak teridentifikasi!");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, logout, login, getSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
