import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { routes, routeStops } from "@/db/schema"
import { eq, isNull, and, desc, count } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (sessionData.user.role === "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const rows = await db
      .select({
        id: routes.id,
        driverId: routes.driverId,
        startedAt: routes.startedAt,
        endedAt: routes.endedAt,
        notes: routes.notes,
        stopCount: count(routeStops.id),
      })
      .from(routes)
      .leftJoin(routeStops, eq(routeStops.routeId, routes.id))
      .where(eq(routes.driverId, sessionData.user.id))
      .groupBy(routes.id)
      .orderBy(desc(routes.startedAt))

    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (sessionData.user.role === "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let notes: string | undefined
  try {
    const body = await req.json()
    if (body?.notes !== undefined) {
      if (typeof body.notes !== "string") {
        return NextResponse.json({ error: "notes must be a string" }, { status: 422 })
      }
      notes = body.notes
    }
  } catch {
    // body is optional; ignore parse errors
  }

  try {
    const [activeRoute] = await db
      .select({ id: routes.id })
      .from(routes)
      .where(and(eq(routes.driverId, sessionData.user.id), isNull(routes.endedAt)))
      .limit(1)

    if (activeRoute) {
      return NextResponse.json(
        { error: "Driver already has an active route" },
        { status: 422 },
      )
    }

    const [created] = await db
      .insert(routes)
      .values({
        driverId: sessionData.user.id,
        notes: notes,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
