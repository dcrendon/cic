import { db } from "@/db"
import { user, routes } from "@/db/schema"
import { count, isNull } from "drizzle-orm"

export default async function AdminPage() {
  const [{ total: totalUsers }] = await db.select({ total: count() }).from(user)
  const [{ total: totalRoutes }] = await db.select({ total: count() }).from(routes)
  const [{ total: activeRoutes }] = await db.select({ total: count() }).from(routes).where(isNull(routes.endedAt))

  return (
    <div>
      <h1 style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 900,
        fontSize: "2rem",
        color: "var(--text-1)",
        marginBottom: "1.5rem",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}>
        Overview
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { label: "Total Users", value: String(totalUsers) },
          { label: "Total Routes", value: String(totalRoutes) },
          { label: "Active Routes", value: String(activeRoutes), accent: true },
        ].map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: "var(--bg-2)",
            border: `1px solid ${stat.accent ? "var(--lime)" : "var(--bg-4)"}`,
            borderRadius: "0.75rem",
            padding: "1.5rem",
          }}>
            <div style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontWeight: 900,
              fontSize: "3rem",
              color: stat.accent ? "var(--lime)" : "var(--kraft)",
              lineHeight: 1,
            }}>{stat.value}</div>
            <div style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.7rem",
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginTop: "0.5rem",
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
