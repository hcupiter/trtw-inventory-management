"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, getSession } = useAuth();

  useEffect(() => {
    getSession();
  }, []);

  return <div>{user ? redirect("/dashboard") : redirect("/login")}</div>;
}
