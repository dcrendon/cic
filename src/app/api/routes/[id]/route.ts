import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { routes, routeStops, locations } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await params
  const isAdmin = sessionData.user.role === "admin"

  try {
    const [route] = await db
      .select()
      .from(routes)
      .where(eq(routes.id, id))
      .limit(1)

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    if (!isAdmin && route.driverId !== sessionData.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const stops = await db
      .select({
        id: routeStops.id,
        routeId: routeStops.routeId,
        locationId: routeStops.locationId,
        locationName: locations.name,
        fullnessPercent: routeStops.fullnessPercent,
        collectedAt: routeStops.collectedAt,
        vanCapacityAfter: routeStops.vanCapacityAfter,
      })
      .from(routeStops)
      .leftJoin(locations, eq(routeStops.locationId, locations.id))
      .where(eq(routeStops.routeId, id))

    return NextResponse.json({ ...route, stops })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
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

  const { endedAt } = body as Record<string, unknown>

  if (!endedAt || typeof endedAt !== "string") {
    return NextResponse.json({ error: "endedAt is required and must be a string" }, { status: 422 })
  }

  const endedAtDate = new Date(endedAt)
  if (isNaN(endedAtDate.getTime())) {
    return NextResponse.json({ error: "endedAt is not a valid date" }, { status: 422 })
  }

  try {
    const [route] = await db
      .select()
      .from(routes)
      .where(eq(routes.id, id))
      .limit(1)

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    if (route.driverId !== sessionData.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [updated] = await db
      .update(routes)
      .set({ endedAt: endedAtDate })
      .where(eq(routes.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
