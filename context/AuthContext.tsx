"use client";

import { UserEntity } from "@/models/entity/UserEntity";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchUserSessionUseCase } from "@/usecase/auth/FetchUserSessionUseCase";
import { LoginUserSessionUseCase } from "@/usecase/auth/LoginUserUseCase";
import { LogoutUserSessionUseCase } from "@/usecase/auth/LogoutUserSessionUseCase";

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
        const user = await FetchUserSessionUseCase();
        setUser(user);
      } catch (err) {
        console.error("Session fetch failed:", err);
      }
    };

    fetchSession();
  }, []);

  // ✅ Login Function
  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);

    try {
      const user = await LoginUserSessionUseCase({
        email: email,
        password: password,
      });
      if (user) {
        setUser(user);
        router.push("/dashboard"); // Redirect after login
        return Promise.resolve(true);
      } else {
        setError("Invalid email or password");
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    try {
      const result = await LogoutUserSessionUseCase();
      if (result) {
        setUser(null);
        router.push("/login"); // Redirect after logout
      }
    } catch (error) {
      console.log(error);
    }
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
