import { requireAdmin } from "@/lib/auth-helpers"
import { db } from "@/db"
import { routes, routeStops, locations, user } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function AdminRouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAdmin()

  const [route] = await db
    .select({
      id: routes.id,
      startedAt: routes.startedAt,
      endedAt: routes.endedAt,
      driverName: user.name,
      driverEmail: user.email,
    })
    .from(routes)
    .innerJoin(user, eq(routes.driverId, user.id))
    .where(eq(routes.id, id))
    .limit(1)

  if (!route) notFound()

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 900,
            fontSize: "2rem",
            color: "var(--text-1)",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            marginBottom: "0.25rem",
          }}>
            Route Detail
          </h1>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.85rem", color: "var(--text-3)" }}>
            Driver: <span style={{ color: "var(--text-1)", fontWeight: 600 }}>{route.driverName}</span> ({route.driverEmail})
          </div>
        </div>
        <Link href="/admin/routes" style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.75rem",
          color: "var(--text-2)",
          textDecoration: "none",
          padding: "0.5rem 0.75rem",
          backgroundColor: "var(--bg-2)",
          border: "1px solid var(--bg-4)",
          borderRadius: "0.5rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          ← Back
        </Link>
      </div>

      {/* Summary card */}
      <div style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        marginBottom: "2rem",
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

      <h2 style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 800,
        fontSize: "1.5rem",
        color: "var(--text-1)",
        marginBottom: "1rem",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}>
        Timeline
      </h2>

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
          padding: "2rem",
          backgroundColor: "var(--bg-2)",
          borderRadius: "0.5rem",
          border: "1px solid var(--bg-4)",
        }}>
          No stops logged yet.
        </p>
      )}
    </div>
  )
}
