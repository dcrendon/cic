import { requireAdmin } from "@/lib/auth-helpers"
import { AdminNav } from "@/components/layout/AdminNav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--bg-1)" }}>
      <AdminNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1.25rem" }}>
        {children}
      </main>
    </div>
  )
}
