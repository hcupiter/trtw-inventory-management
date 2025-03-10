"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return user ? router.replace("/dashboard") : router.replace("/login");
}
