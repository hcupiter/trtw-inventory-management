"use client";

import DashboardItems from "@/components/ui/dashboard/dashboardItems/DashboardItems";
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <div className="h-screen flex w-screen">
      {/* Sidebar */}
      <aside className="w-[20vw] bg-blue flex flex-col justify-between pl-8 py-8">
        {/* Top */}
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="pe-8 pl-5 gap-0">
            <p className="text-base text-white">Aplikasi Manajemen Inventory</p>
            <p className="text-lg text-white font-bold">TRDW</p>
          </div>

          {/* Navigatior */}
          <div className="flex flex-col">
            <DashboardItems
              label={"Transaksi"}
              href={"/dashboard/transactions"}
              iconName={"icon-park-outline:transaction-order"}
            />
            <DashboardItems
              label={"Barang"}
              href={"/dashboard/items"}
              iconName={"majesticons:box-line"}
            />
            <DashboardItems
              label={"Vendor"}
              href={"/dashboard/vendors"}
              iconName={"material-symbols:person-outline"}
            />
            <DashboardItems
              label={"Lainnya"}
              href={"/dashboard/others"}
              iconName={"gravity-ui:gear"}
            />
          </div>
        </div>

        {/* Logout Button */}
        <div className="pe-8">
          <TRDWButton
            variant={ButtonVariant.PRIMARY}
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </TRDWButton>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex p-6 w-full h-screen">{children}</main>
    </div>
  );
};

export default DashboardLayout;
