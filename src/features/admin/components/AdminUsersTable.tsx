import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { formatBDT } from "@/src/lib/money";
import { toggleBlacklistAction } from "@/src/features/admin/actions";
import type { AdminUserListRow } from "@/src/features/admin/queries";

type AdminUsersTableProps = {
  rows: AdminUserListRow[];
  search: string;
  page: number;
  totalPages: number;
};

async function toggleUserBlacklist(userId: string, nextState: boolean, formData: FormData) {
  "use server";
  await toggleBlacklistAction(userId, nextState, formData);
}

export function AdminUsersTable({ rows, search, page, totalPages }: AdminUsersTableProps) {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Users</CardTitle>
          <Badge variant="secondary">{rows.length} on this page</Badge>
        </div>
        <form className="flex gap-2" action="/admin-dashboard" method="get">
          <Input name="q" defaultValue={search} placeholder="Search by name or email" />
          <input type="hidden" name="page" value="1" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-[rgba(0,0,0,0.35)] text-muted-foreground">
              <tr className="border-y border-border">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total smokes</th>
                <th className="px-4 py-3 text-right font-medium">Total spend</th>
                <th className="px-4 py-3 text-left font-medium">Last activity</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-caption text-muted-foreground">
                    No users found for this filter.
                  </td>
                </tr>
              ) : (
                rows.map((user) => (
                  <tr key={user.id} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{user.name ?? "Unnamed user"}</p>
                        <p className="text-caption text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.isBlacklisted ? (
                        <Badge variant="destructive">Blacklisted</Badge>
                      ) : (
                        <Badge variant="accent">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-subtle">{user.totalSmokes}</td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {formatBDT(user.totalSpendMinor)}
                    </td>
                    <td className="px-4 py-3 text-caption text-foreground-subtle">
                      {user.lastSmokeAt
                        ? formatDistanceToNow(new Date(user.lastSmokeAt), { addSuffix: true })
                        : "No activity"}
                    </td>
                    <td className="px-4 py-3 text-caption text-foreground-subtle">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin-dashboard/users/${user.id}`}>View stats</Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin-dashboard/users/${user.id}?mode=edit`}>Edit</Link>
                        </Button>
                        <form action={toggleUserBlacklist.bind(null, user.id, !user.isBlacklisted)}>
                          <input
                            type="hidden"
                            name="reason"
                            value={user.isBlacklisted ? "" : "Blacklisted from admin dashboard"}
                          />
                          <Button
                            type="submit"
                            size="sm"
                            variant={user.isBlacklisted ? "outline" : "destructive"}
                          >
                            {user.isBlacklisted ? "Unblacklist" : "Blacklist"}
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-caption text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" disabled={page <= 1}>
                <Link href={`/admin-dashboard?page=${Math.max(1, page - 1)}&q=${encodeURIComponent(search)}`}>
                  Previous
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
                <Link
                  href={`/admin-dashboard?page=${Math.min(totalPages, page + 1)}&q=${encodeURIComponent(search)}`}
                >
                  Next
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
