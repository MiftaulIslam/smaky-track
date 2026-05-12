import { Users } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { AdminUsersTable } from "@/src/features/admin/components/AdminUsersTable";
import { getAdminUsers } from "@/src/features/admin/queries";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; page?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const search = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const pageSize = 12;

  const { rows, total } = await getAdminUsers({
    page,
    pageSize,
    search,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-heading-sm font-heading font-semibold text-ghost-white">
            User Management
          </h2>
          <p className="text-caption text-slate-text">
            Browse users, inspect their stats, and manage account status.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {total.toLocaleString()} total users
        </Badge>
      </section>

      <AdminUsersTable rows={rows} search={search} page={page} totalPages={totalPages} />
    </div>
  );
}
