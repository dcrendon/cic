import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public paths
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: req.headers })

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Admin-only paths
  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
