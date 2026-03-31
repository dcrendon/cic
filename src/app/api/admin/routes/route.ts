import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { routes, routeStops, user } from "@/db/schema"
import { eq, desc, count } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (sessionData.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const rows = await db
      .select({
        id: routes.id,
        driverId: routes.driverId,
        driverName: user.name,
        startedAt: routes.startedAt,
        endedAt: routes.endedAt,
        notes: routes.notes,
        stopCount: count(routeStops.id),
      })
      .from(routes)
      .leftJoin(user, eq(routes.driverId, user.id))
      .leftJoin(routeStops, eq(routeStops.routeId, routes.id))
      .groupBy(routes.id, user.name)
      .orderBy(desc(routes.startedAt))

    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
