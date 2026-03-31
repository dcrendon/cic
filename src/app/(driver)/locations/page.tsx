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
      <Header title="Locations" />
      <main style={{ padding: "1.25rem" }}>
        <LocationsClient locations={allLocations} />
      </main>
    </div>
  )
}
