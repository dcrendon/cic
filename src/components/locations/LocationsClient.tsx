"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LocationForm } from "./LocationForm"
import { toast } from "@/lib/toast"
import { Edit2, MapPin, Package, Container } from "lucide-react"
import { ConfirmDelete } from "@/components/ui/confirm-delete"

interface Loc {
  id: string
  name: string
  address: string | null
  collectionType: "bin" | "dumpster"
  createdById: string
  createdAt: Date
}

export function LocationsClient({ locations, isAdmin = false }: { locations: Loc[]; isAdmin?: boolean }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLoc, setEditingLoc] = useState<Loc | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Location deleted")
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      {/* Add button - Admin Only */}
      {isAdmin && !showAddForm && !editingLoc && (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: "100%",
            marginBottom: "1.5rem",
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
          + ADD NEW LOCATION
        </button>
      )}

      {isAdmin && showAddForm && (
        <LocationForm
          onDone={() => {
            setShowAddForm(false)
            router.refresh()
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {isAdmin && editingLoc && (
        <LocationForm
          initialData={editingLoc}
          onDone={() => {
            setEditingLoc(null)
            router.refresh()
          }}
          onCancel={() => setEditingLoc(null)}
        />
      )}

      {/* Location list - Users-style Table UI */}
      <div style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 100px 100px",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid var(--bg-4)",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.65rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          <span>Name / Address</span>
          <span>Type</span>
          <span>Created</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {locations.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)", fontFamily: "IBM Plex Mono, monospace", fontSize: "0.875rem" }}>
            No locations found.
          </div>
        )}

        {locations.map((loc, i) => (
          <div key={loc.id} style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 100px 100px",
            padding: "1rem 1.25rem",
            borderBottom: i < locations.length - 1 ? "1px solid var(--bg-4)" : "none",
            alignItems: "center",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
              <span style={{ 
                fontFamily: "IBM Plex Sans, sans-serif", 
                fontWeight: 600, 
                color: "var(--text-1)", 
                fontSize: "0.95rem", 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem" 
              }}>
                <MapPin size={14} style={{ color: "var(--kraft)" }} />
                {loc.name}
              </span>
              {loc.address && (
                <span style={{ 
                  fontFamily: "IBM Plex Mono, monospace", 
                  fontSize: "0.7rem", 
                  color: "var(--text-3)",
                  marginLeft: "1.375rem"
                }}>
                  {loc.address}
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {loc.collectionType === "bin" ? (
                <Package size={14} style={{ color: "var(--text-3)" }} />
              ) : (
                <Container size={14} style={{ color: "var(--kraft-light)" }} />
              )}
              <span style={{
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: loc.collectionType === "dumpster" ? "var(--kraft-dim)" : "var(--bg-3)",
                color: loc.collectionType === "dumpster" ? "var(--kraft-light)" : "var(--text-3)",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {loc.collectionType}
              </span>
            </div>

            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.75rem", color: "var(--text-3)" }}>
              {new Date(loc.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "2-digit" })}
            </span>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              {isAdmin && (
                <>
                  <button
                    onClick={() => setEditingLoc(loc)}
                    style={{
                      padding: "0.4rem",
                      backgroundColor: "var(--bg-3)",
                      border: "none",
                      borderRadius: "0.375rem",
                      color: "var(--text-2)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Edit Location"
                  >
                    <Edit2 size={14} />
                  </button>
                  <ConfirmDelete 
                    onConfirm={() => handleDelete(loc.id)}
                    isLoading={loading === loc.id}
                    description="Are you sure you want to delete this location? This action cannot be undone."
                    className="p-1 size-7 bg-red-600/10 text-red-600 hover:bg-red-600/20"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
