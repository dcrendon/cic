import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { locations } from "@/db/schema"
import { eq } from "drizzle-orm"

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
