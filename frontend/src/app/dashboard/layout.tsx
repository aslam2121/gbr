import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { DashboardLayout } from "@/modules/dashboard";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
