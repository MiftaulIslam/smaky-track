import { db } from "@/src/db";
import { cigaretteBrands } from "@/src/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getActiveBrands() {
  return db.query.cigaretteBrands.findMany({
    where: eq(cigaretteBrands.active, true),
    orderBy: asc(cigaretteBrands.sortOrder),
  });
}

export async function getBrandById(id: string) {
  return db.query.cigaretteBrands.findFirst({
    where: eq(cigaretteBrands.id, id),
  });
}
