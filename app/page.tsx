"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, getSession } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return user ? redirect("/dashboard") : redirect("/login");
}
