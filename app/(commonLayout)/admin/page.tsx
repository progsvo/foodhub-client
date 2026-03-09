import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfile } from "@/services/user.service.server";
import { getAdminUsers, getAdminOrders } from "@/services/admin.service.server";

export default async function AdminDashboardPage() {
  const profileRes = await getProfile();
  if (!profileRes.success || !profileRes.data || profileRes.data.role !== "ADMIN") {
    return null;
  }

  const [usersRes, ordersRes] = await Promise.all([
    getAdminUsers({ limit: 1 }),
    getAdminOrders({ limit: 1 }),
  ]);

  const totalUsers = usersRes.meta?.total ?? 0;
  const totalOrders = ordersRes.meta?.total ?? 0;

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <Button variant="link" className="p-0" asChild>
              <Link href="/admin/users">View users →</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <Button variant="link" className="p-0" asChild>
              <Link href="/admin/orders">View orders →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/admin/users">Manage Users</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/orders">View All Orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/categories">Manage Categories</Link>
        </Button>
      </div>
    </div>
  );
}
