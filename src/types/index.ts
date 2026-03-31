export interface Location {
  id: string
  name: string
  address: string | null
  collectionType: "bin" | "dumpster"
  createdById: string
  createdByName: string
  createdAt: string
}

export interface Route {
  id: string
  driverId: string
  driverName?: string
  startedAt: string
  endedAt: string | null
  notes: string | null
  stopCount?: number
}

export interface RouteStop {
  id: string
  routeId: string
  locationId: string
  locationName: string
  fullnessPercent: number
  collectedAt: string
  vanCapacityAfter: number
}

export interface RouteDetail extends Route {
  stops: RouteStop[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string | null
  createdAt: string
  banned: boolean | null
}
