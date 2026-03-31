import { requireSession } from "@/lib/auth-helpers"
import { db } from "@/db"
import { routes, routeStops } from "@/db/schema"
import { eq, count, desc } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import Link from "next/link"

export default async function RoutesPage() {
  const session = await requireSession()

  const allRoutes = await db
    .select({
      id: routes.id,
      startedAt: routes.startedAt,
      endedAt: routes.endedAt,
      notes: routes.notes,
      stopCount: count(routeStops.id),
    })
    .from(routes)
    .leftJoin(routeStops, eq(routeStops.routeId, routes.id))
    .where(eq(routes.driverId, session.user.id))
    .groupBy(routes.id)
    .orderBy(desc(routes.startedAt))

  return (
    <div>
      <Header title="My Routes" />
      <main style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {allRoutes.length === 0 && (
          <p style={{
            color: "var(--text-3)",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.875rem",
            textAlign: "center",
            marginTop: "2rem",
          }}>
            No routes yet. Start one from the dashboard.
          </p>
        )}
        {allRoutes.map((route) => (
          <Link key={route.id} href={`/routes/${route.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "var(--bg-2)",
              border: `1px solid ${route.endedAt ? "var(--bg-4)" : "var(--lime)"}`,
              borderRadius: "0.75rem",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.25rem",
                }}>
                  {!route.endedAt && (
                    <span style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--lime)",
                      display: "inline-block",
                    }} />
                  )}
                  <span style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "var(--text-1)",
                  }}>
                    {new Date(route.startedAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.7rem",
                  color: "var(--text-3)",
                }}>
                  {new Date(route.startedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {route.endedAt &&
                    ` – ${new Date(route.endedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: 900,
                  fontSize: "1.75rem",
                  color: route.endedAt ? "var(--text-1)" : "var(--lime)",
                }}>
                  {route.stopCount}
                </div>
                <div style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.65rem",
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                }}>
                  stops
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}
