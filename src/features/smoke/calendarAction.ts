"use server";

import { auth } from "@/src/auth";
import { getCalendarData, type CalendarDay } from "./queries";

export async function getCalendarDataAction(year: number): Promise<CalendarDay[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  return getCalendarData(session.user.id, year);
}
