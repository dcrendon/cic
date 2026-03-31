"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreateLocationForm } from "./CreateLocationForm"

interface Loc {
  id: string
  name: string
  address: string | null
  collectionType: "bin" | "dumpster"
  createdById: string
  createdAt: Date
}

export function LocationsClient({ locations }: { locations: Loc[] }) {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  return (
    <div>
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.875rem",
            backgroundColor: "var(--kraft)",
            color: "#0c0a08",
            border: "none",
            borderRadius: "0.75rem",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          + ADD LOCATION
        </button>
      )}

      {showForm && (
        <CreateLocationForm
          onDone={() => {
            setShowForm(false)
            router.refresh()
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Location list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {locations.length === 0 && (
          <p style={{
            color: "var(--text-3)",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.875rem",
            textAlign: "center",
            marginTop: "1.5rem",
          }}>
            No locations yet.
          </p>
        )}
        {locations.map((loc) => (
          <div key={loc.id} style={{
            backgroundColor: "var(--bg-2)",
            border: "1px solid var(--bg-4)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                fontWeight: 600,
                color: "var(--text-1)",
                fontSize: "1rem",
              }}>
                {loc.name}
              </div>
              {loc.address && (
                <div style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.7rem",
                  color: "var(--text-3)",
                  marginTop: "0.2rem",
                }}>
                  {loc.address}
                </div>
              )}
            </div>
            <span style={{
              padding: "0.25rem 0.625rem",
              borderRadius: "0.25rem",
              backgroundColor:
                loc.collectionType === "dumpster" ? "var(--kraft-dim)" : "var(--bg-3)",
              color:
                loc.collectionType === "dumpster" ? "var(--kraft-light)" : "var(--text-3)",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {loc.collectionType}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
