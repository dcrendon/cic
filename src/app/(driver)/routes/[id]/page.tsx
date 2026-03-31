import { requireSession } from "@/lib/auth-helpers"
import { db } from "@/db"
import { routes, routeStops, locations } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import { notFound } from "next/navigation"

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await requireSession()

  const [route] = await db.select().from(routes).where(eq(routes.id, id)).limit(1)
  if (!route) notFound()
  if (route.driverId !== session.user.id && session.user.role !== "admin") notFound()

  const stops = await db
    .select({
      id: routeStops.id,
      locationName: locations.name,
      collectionType: locations.collectionType,
      fullnessPercent: routeStops.fullnessPercent,
      collectedAt: routeStops.collectedAt,
      vanCapacityAfter: routeStops.vanCapacityAfter,
    })
    .from(routeStops)
    .innerJoin(locations, eq(routeStops.locationId, locations.id))
    .where(eq(routeStops.routeId, id))
    .orderBy(asc(routeStops.collectedAt))

  const duration =
    route.endedAt
      ? Math.round(
          (new Date(route.endedAt).getTime() - new Date(route.startedAt).getTime()) / 60000,
        )
      : null

  return (
    <div>
      <Header title="Route Detail" />
      <main style={{ padding: "1.25rem" }}>
        {/* Summary card */}
        <div style={{
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--bg-4)",
          borderRadius: "0.75rem",
          padding: "1.25rem",
          marginBottom: "1.25rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            textAlign: "center",
          }}>
            <div>
              <div style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: 900,
                fontSize: "2rem",
                color: "var(--kraft)",
              }}>
                {stops.length}
              </div>
              <div style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.65rem",
                color: "var(--text-3)",
                textTransform: "uppercase",
              }}>
                Stops
              </div>
            </div>
            <div>
              <div style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: 900,
                fontSize: "2rem",
                color: "var(--kraft)",
              }}>
                {stops.at(-1)?.vanCapacityAfter ?? 0}%
              </div>
              <div style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.65rem",
                color: "var(--text-3)",
                textTransform: "uppercase",
              }}>
                Van Cap
              </div>
            </div>
            <div>
              <div style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: 900,
                fontSize: "2rem",
                color: "var(--kraft)",
              }}>
                {duration !== null ? `${duration}m` : "—"}
              </div>
              <div style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.65rem",
                color: "var(--text-3)",
                textTransform: "uppercase",
              }}>
                Duration
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {stops.map((stop, i) => (
            <div key={stop.id} style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}>
              {/* Timeline line + dot */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "20px",
              }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "var(--kraft)",
                  flexShrink: 0,
                }} />
                {i < stops.length - 1 && (
                  <div style={{
                    width: "2px",
                    flex: 1,
                    backgroundColor: "var(--bg-4)",
                    minHeight: "2rem",
                  }} />
                )}
              </div>
              {/* Stop card */}
              <div style={{
                flex: 1,
                backgroundColor: "var(--bg-2)",
                border: "1px solid var(--bg-4)",
                borderRadius: "0.5rem",
                padding: "0.875rem",
                marginBottom: "0.5rem",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}>
                  <div>
                    <div style={{
                      fontFamily: "IBM Plex Sans, sans-serif",
                      fontWeight: 600,
                      color: "var(--text-1)",
                      fontSize: "0.95rem",
                    }}>
                      {stop.locationName}
                    </div>
                    <div style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "0.7rem",
                      color: "var(--text-3)",
                      marginTop: "0.15rem",
                    }}>
                      {new Date(stop.collectedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      backgroundColor:
                        stop.collectionType === "dumpster"
                          ? "var(--kraft-dim)"
                          : "var(--bg-3)",
                      color:
                        stop.collectionType === "dumpster"
                          ? "var(--kraft-light)"
                          : "var(--text-3)",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.25rem",
                    }}>
                      {stop.collectionType}
                    </span>
                    <div style={{
                      fontFamily: "Barlow Condensed, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "var(--kraft)",
                    }}>
                      {stop.fullnessPercent}% full
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: "0.5rem",
                  fontSize: "0.7rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  color: "var(--text-3)",
                }}>
                  Van: {stop.vanCapacityAfter}% after
                </div>
              </div>
            </div>
          ))}
        </div>

        {stops.length === 0 && (
          <p style={{
            color: "var(--text-3)",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.875rem",
            textAlign: "center",
          }}>
            No stops logged yet.
          </p>
        )}
      </main>
    </div>
  )
}
