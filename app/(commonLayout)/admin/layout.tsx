import Link from "next/link";
import { redirect } from "next/navigation";

import { getProfile } from "@/services/user.service.server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileRes = await getProfile();

  if (!profileRes.success || !profileRes.data) {
    redirect("/login?redirect=/admin");
  }

  if (profileRes.data.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="mb-6 flex flex-wrap gap-4 border-b pb-4">
        <Link href="/admin" className="text-sm font-medium hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/users" className="text-sm font-medium hover:underline">
          Users
        </Link>
        <Link href="/admin/orders" className="text-sm font-medium hover:underline">
          Orders
        </Link>
        <Link href="/admin/categories" className="text-sm font-medium hover:underline">
          Categories
        </Link>
      </nav>
      {children}
    </div>
  );
}
