"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

import TRDWTextField from "@/components/ui/shared/textfield/TRDWTextField";
import TRDWButton from "@/components/ui/shared/button/TRDWButton";

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
      <div className="flex flex-col items-start w-2xl gap-8">
        <div className="gap-0">
          <h1 className="text-2xl font-bold">TRDW</h1>
          <p className="text-lg text-gray">Inventory management app</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full items-center justify-center gap-8"
        >
          <div className="flex flex-col w-full items-start justify-center gap-2">
            <div className="flex flex-col w-full items-start justify-center gap-4">
              <TRDWTextField
                mandatory
                type="text"
                label="Email"
                placeholder="Masukkan email disini..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <TRDWTextField
                type="password"
                label="Password"
                placeholder="Masukkan password disini..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            {error && <span className="text-base text-red">{error}</span>}
          </div>

          <TRDWButton type="submit" fullWidth>
            Login
          </TRDWButton>
        </form>
      </div>
    </div>
  );
}
