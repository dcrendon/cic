import { db } from "@/db"
import { locations, user } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { LocationsClient } from "@/components/locations/LocationsClient"

export default async function AdminLocationsPage() {
  const allLocations = await db
    .select({
      id: locations.id,
      name: locations.name,
      address: locations.address,
      collectionType: locations.collectionType,
      createdById: locations.createdById,
      createdAt: locations.createdAt,
      createdByName: user.name,
    })
    .from(locations)
    .leftJoin(user, eq(locations.createdById, user.id))
    .orderBy(desc(locations.createdAt))

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
        Locations <span style={{ color: "var(--text-3)", fontSize: "1.25rem" }}>({allLocations.length})</span>
      </h1>

      <LocationsClient locations={allLocations} isAdmin={true} />
    </div>
  )
}
