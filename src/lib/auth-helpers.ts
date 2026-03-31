import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect("/login")
  return session
}

export async function requireAdmin() {
  const session = await requireSession()
  if (session.user.role !== "admin") redirect("/dashboard")
  return session
}
