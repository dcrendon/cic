import { requireSession } from "@/lib/auth-helpers"
import { db } from "@/db"
import { locations } from "@/db/schema"
import { desc } from "drizzle-orm"
import { Header } from "@/components/layout/Header"
import { LocationsClient } from "@/components/locations/LocationsClient"

export default async function LocationsPage() {
  await requireSession()

  const allLocations = await db
    .select({
      id: locations.id,
      name: locations.name,
      address: locations.address,
      collectionType: locations.collectionType,
      createdById: locations.createdById,
      createdAt: locations.createdAt,
    })
    .from(locations)
    .orderBy(desc(locations.createdAt))

  return (
    <div>
      <Header />
      <main style={{ padding: "1.25rem" }}>
        <h1 style={{
          fontFamily: "Barlow Condensed, sans-serif",
          fontWeight: 900,
          fontSize: "2rem",
          color: "var(--text-1)",
          marginBottom: "1.5rem",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}>
          Locations
        </h1>
        <LocationsClient locations={allLocations} />
      </main>
    </div>
  )
}
