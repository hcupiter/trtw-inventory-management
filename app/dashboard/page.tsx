import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/dashboard/transactions");
};

export default DashboardPage;
