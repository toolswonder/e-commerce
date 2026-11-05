import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

export const metadata = {
  title: "Admin Command Center | AURA Living",
  description: "Enterprise e-commerce operations, order fulfillment, and catalog control.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-zinc-100/60 flex">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pl-0 lg:pl-64">
        <AdminHeader user={session.user} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
