import { requireSession } from "@/lib/auth-helpers"
import { BottomNav } from "@/components/layout/BottomNav"
import { redirect } from "next/navigation"

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  if (session.user.role === "admin") redirect("/admin")
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", paddingBottom: "4.5rem" }}>
      <div style={{ flex: 1 }}>{children}</div>
      <BottomNav />
    </div>
  )
}
