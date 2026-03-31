import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { routes, routeStops } from "@/db/schema"
import { eq, isNull, and } from "drizzle-orm"

const VALID_FULLNESS = [25, 50, 75, 100] as const

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 422 })
  }

  const { locationId, fullnessPercent, vanCapacityAfter } = body as Record<string, unknown>

  if (!locationId || typeof locationId !== "string") {
    return NextResponse.json({ error: "locationId is required" }, { status: 422 })
  }
  if (
    fullnessPercent === undefined ||
    !VALID_FULLNESS.includes(fullnessPercent as (typeof VALID_FULLNESS)[number])
  ) {
    return NextResponse.json(
      { error: "fullnessPercent must be 25, 50, 75, or 100" },
      { status: 422 },
    )
  }
  if (vanCapacityAfter === undefined || typeof vanCapacityAfter !== "number") {
    return NextResponse.json({ error: "vanCapacityAfter is required and must be a number" }, { status: 422 })
  }

  try {
    const [route] = await db
      .select()
      .from(routes)
      .where(
        and(
          eq(routes.id, id),
          eq(routes.driverId, sessionData.user.id),
        ),
      )
      .limit(1)

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    if (route.driverId !== sessionData.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (route.endedAt !== null) {
      return NextResponse.json({ error: "Route is already ended" }, { status: 422 })
    }

    const [stop] = await db
      .insert(routeStops)
      .values({
        routeId: id,
        locationId,
        fullnessPercent: fullnessPercent as number,
        vanCapacityAfter: vanCapacityAfter as number,
      })
      .returning()

    return NextResponse.json(stop, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
