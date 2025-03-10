"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";

const DashboardPage = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      redirect("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Hello Dashboard Page</h1>
      <TRDWButton variant={ButtonVariant.DANGER} onClick={handleLogout}>
        Logout
      </TRDWButton>
    </div>
  );
};

export default DashboardPage;
