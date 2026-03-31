import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import { asc } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const sessionData = await auth.api.getSession({ headers: req.headers })
  if (!sessionData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (sessionData.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        banned: user.banned,
      })
      .from(user)
      .orderBy(asc(user.createdAt))

    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
