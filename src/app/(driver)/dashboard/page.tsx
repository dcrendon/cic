import { requireSession } from "@/lib/auth-helpers"
import { db } from "@/db"
import { routes, routeStops } from "@/db/schema"
import { eq, isNull, and, count, gte, desc } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import { StartRouteButton } from "@/components/routes/StartRouteButton"
import { ActiveRoutePanel } from "@/components/routes/ActiveRoutePanel"

export default async function DashboardPage() {
  const session = await requireSession()
  const userId = session.user.id

  // Active route
  const [activeRoute] = await db
    .select()
    .from(routes)
    .where(and(eq(routes.driverId, userId), isNull(routes.endedAt)))
    .limit(1)

  // Today's completed routes count
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [{ value: todayCount }] = await db
    .select({ value: count() })
    .from(routes)
    .where(
      and(
        eq(routes.driverId, userId),
        gte(routes.startedAt, today),
      )
    )

  // Stop count for active route
  let stopCount = 0
  let vanCapacity = 0
  if (activeRoute) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(routeStops)
      .where(eq(routeStops.routeId, activeRoute.id))
    stopCount = Number(value)

    // Get latest van capacity
    const [latestStop] = await db
      .select({ vanCapacityAfter: routeStops.vanCapacityAfter })
      .from(routeStops)
      .where(eq(routeStops.routeId, activeRoute.id))
      .orderBy(desc(routeStops.collectedAt))
      .limit(1)
    vanCapacity = latestStop?.vanCapacityAfter ?? 0
  }

  return (
    <div>
      <Header title="Dashboard" />
      <main style={{ padding: "1.25rem" }}>
        {/* Stats bar */}
        <div style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}>
          <StatCard label="Today's Routes" value={String(todayCount)} />
        </div>

        {activeRoute ? (
          <ActiveRoutePanel
            route={activeRoute}
            stopCount={stopCount}
            vanCapacity={vanCapacity}
          />
        ) : (
          <StartRouteButton />
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: "var(--bg-2)",
      borderRadius: "0.75rem",
      padding: "1rem 1.25rem",
      border: "1px solid var(--bg-4)",
    }}>
      <div style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 900,
        fontSize: "2.5rem",
        color: "var(--kraft)",
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "0.7rem",
        color: "var(--text-3)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginTop: "0.25rem",
      }}>{label}</div>
    </div>
  )
}
