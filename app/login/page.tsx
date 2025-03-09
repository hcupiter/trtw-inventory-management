"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, error } = useAuth();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const loginSuccess = await login(email, password);
    if (loginSuccess) {
      redirect("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-lvw h-lvh">
      <h1>Hello Login Page</h1>

      <form
        onSubmit={onSubmit}
        className="flex flex-col w-2xl items-center justify-center"
      >
        <input
          type="text"
          name="Email"
          placeholder="Masukkan email disini..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <input
          type="password"
          name="Password"
          placeholder="Masukkan password disini..."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        {error && <p className="text-red-500">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
