import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { locations, user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const rows = await db
      .select({
        id: locations.id,
        name: locations.name,
        address: locations.address,
        collectionType: locations.collectionType,
        createdAt: locations.createdAt,
        createdById: locations.createdById,
        createdByName: user.name,
      })
      .from(locations)
      .leftJoin(user, eq(locations.createdById, user.id))

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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 422 })
  }

  const { name, address, collectionType } = body as Record<string, unknown>

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 422 })
  }
  if (!collectionType || (collectionType !== "bin" && collectionType !== "dumpster")) {
    return NextResponse.json(
      { error: "collectionType must be 'bin' or 'dumpster'" },
      { status: 422 },
    )
  }
  if (address !== undefined && typeof address !== "string") {
    return NextResponse.json({ error: "address must be a string" }, { status: 422 })
  }

  try {
    const [created] = await db
      .insert(locations)
      .values({
        name: name.trim(),
        address: typeof address === "string" ? address : undefined,
        collectionType: collectionType as "bin" | "dumpster",
        createdById: sessionData.user.id,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
