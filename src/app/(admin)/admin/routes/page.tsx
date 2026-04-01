import { db } from "@/db"
import { routes, user, routeStops } from "@/db/schema"
import { eq, count, desc } from "drizzle-orm"
import Link from "next/link"

export default async function AdminRoutesPage() {
  const allRoutes = await db
    .select({
      id: routes.id,
      startedAt: routes.startedAt,
      endedAt: routes.endedAt,
      driverName: user.name,
      driverEmail: user.email,
      stopCount: count(routeStops.id),
    })
    .from(routes)
    .innerJoin(user, eq(routes.driverId, user.id))
    .leftJoin(routeStops, eq(routeStops.routeId, routes.id))
    .groupBy(routes.id, user.name, user.email)
    .orderBy(desc(routes.startedAt))

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
        All Routes <span style={{ color: "var(--text-3)", fontSize: "1.25rem" }}>({allRoutes.length})</span>
      </h1>

      <div style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1.5fr 1fr 80px 80px",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid var(--bg-4)",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.65rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          <span>Driver</span>
          <span>Started</span>
          <span>Status</span>
          <span>Stops</span>
          <span></span>
        </div>
        {allRoutes.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)", fontFamily: "IBM Plex Mono, monospace", fontSize: "0.875rem" }}>
            No routes yet.
          </div>
        )}
        {allRoutes.map((route, i) => (
          <div key={route.id} style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1.5fr 1fr 80px 80px",
            padding: "1rem 1.25rem",
            borderBottom: i < allRoutes.length - 1 ? "1px solid var(--bg-4)" : "none",
            alignItems: "center",
          }}>
            <div>
              <div style={{ fontFamily: "IBM Plex Sans, sans-serif", fontWeight: 600, color: "var(--text-1)", fontSize: "0.9rem" }}>
                {route.driverName}
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.7rem", color: "var(--text-3)" }}>
                {route.driverEmail}
              </div>
            </div>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.8rem", color: "var(--text-2)" }}>
              {new Date(route.startedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
            <span>
              <span style={{
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: route.endedAt ? "var(--bg-3)" : "var(--lime-dim)",
                color: route.endedAt ? "var(--text-3)" : "var(--lime)",
                border: `1px solid ${route.endedAt ? "var(--bg-4)" : "var(--lime)"}`,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {route.endedAt ? "Done" : "Active"}
              </span>
            </span>
            <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-1)", textAlign: "center" }}>
              {route.stopCount}
            </span>
            <Link href={`/admin/routes/${route.id}`} style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.7rem",
              color: "var(--kraft)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              View →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
