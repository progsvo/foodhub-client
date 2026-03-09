import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserStatusButton } from "@/components/modules/admin/UserStatusButton";
import { getProfile } from "@/services/user.service.server";
import { getAdminUsers } from "@/services/admin.service.server";
import type { UserProfile } from "@/types";

export default async function AdminUsersPage() {
  const profileRes = await getProfile();
  if (!profileRes.success || !profileRes.data || profileRes.data.role !== "ADMIN") {
    return null;
  }

  const usersRes = await getAdminUsers({ sortOrder: "desc" });
  const users: UserProfile[] = usersRes.data ?? [];

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin">← Back to dashboard</Link>
        </Button>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Manage Users</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role ?? "—"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "SUSPENDED" ? "destructive" : "default"}>
                      {user.status ?? "ACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserStatusButton
                      userId={user.id}
                      currentStatus={user.status ?? "ACTIVE"}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
