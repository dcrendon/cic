import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { locations } from "@/db/schema"
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

  try {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1)

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    return NextResponse.json(location)
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

  const { name, address, collectionType } = body as Record<string, unknown>

  try {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1)

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    const isAdmin = sessionData.user.role === "admin"
    const isCreator = location.createdById === sessionData.user.id

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updates: Partial<typeof locations.$inferInsert> = {}
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return NextResponse.json({ error: "name is required" }, { status: 422 })
      }
      updates.name = name.trim()
    }
    if (address !== undefined) {
      if (typeof address !== "string" && address !== null) {
        return NextResponse.json({ error: "address must be a string or null" }, { status: 422 })
      }
      updates.address = address
    }
    if (collectionType !== undefined) {
      if (collectionType !== "bin" && collectionType !== "dumpster") {
        return NextResponse.json(
          { error: "collectionType must be 'bin' or 'dumpster'" },
          { status: 422 },
        )
      }
      updates.collectionType = collectionType as "bin" | "dumpster"
    }

    const [updated] = await db
      .update(locations)
      .set(updates)
      .where(eq(locations.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await params

  try {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1)

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    const isAdmin = sessionData.user.role === "admin"
    const isCreator = location.createdById === sessionData.user.id

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.delete(locations).where(eq(locations.id, id))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
