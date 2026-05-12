import { count, desc, eq, ilike, max, or, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { smokeEntries, users } from "@/src/db/schema";

export type AdminUserListRow = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isBlacklisted: boolean;
  blacklistedAt: Date | null;
  blacklistReason: string | null;
  createdAt: Date;
  totalSmokes: number;
  totalSpendMinor: number;
  lastSmokeAt: Date | null;
};

export async function getAdminUsers(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<{ rows: AdminUserListRow[]; total: number }> {
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, Math.min(params.pageSize, 100));
  const offset = (page - 1) * pageSize;
  const search = params.search?.trim();

  const where =
    search && search.length > 0
      ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
      : undefined;

  const totalRows = await db
    .select({ value: count() })
    .from(users)
    .where(where);
  const total = Number(totalRows[0]?.value ?? 0);

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      isBlacklisted: users.isBlacklisted,
      blacklistedAt: users.blacklistedAt,
      blacklistReason: users.blacklistReason,
      createdAt: users.createdAt,
      totalSmokes: count(smokeEntries.id),
      totalSpendMinor: sql<number>`coalesce(sum(${smokeEntries.priceMinor}), 0)`,
      lastSmokeAt: max(smokeEntries.smokedAt),
    })
    .from(users)
    .leftJoin(smokeEntries, eq(smokeEntries.userId, users.id))
    .where(where)
    .groupBy(
      users.id,
      users.name,
      users.email,
      users.image,
      users.isBlacklisted,
      users.blacklistedAt,
      users.blacklistReason,
      users.createdAt
    )
    .orderBy(desc(users.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    rows: rows.map((row) => ({
      ...row,
      totalSmokes: Number(row.totalSmokes ?? 0),
      totalSpendMinor: Number(row.totalSpendMinor ?? 0),
    })),
    total,
  };
}

export async function getAdminUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}
