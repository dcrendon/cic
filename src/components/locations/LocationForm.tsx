"use client"
import { useState } from "react"
import { toast } from "@/lib/toast"

interface Loc {
  id: string
  name: string
  address: string | null
  collectionType: "bin" | "dumpster"
}

interface Props {
  initialData?: Loc
  onDone: () => void
  onCancel: () => void
}

export function LocationForm({ initialData, onDone, onCancel }: Props) {
  const [name, setName] = useState(initialData?.name || "")
  const [address, setAddress] = useState(initialData?.address || "")
  const [type, setType] = useState<"bin" | "dumpster">(initialData?.collectionType || "bin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!initialData

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const url = isEditing ? `/api/locations/${initialData.id}` : "/api/locations"
    const method = isEditing ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        address: address || null,
        collectionType: type,
      }),
    })

    if (res.ok) {
      toast.success(isEditing ? "Location updated" : "Location created")
      onDone()
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: "var(--bg-2)",
      border: "1px solid var(--bg-4)",
      borderRadius: "0.75rem",
      padding: "1.25rem",
      marginBottom: "1rem",
    }}>
      <div style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 800,
        fontSize: "1.25rem",
        color: "var(--text-1)",
        marginBottom: "1rem",
        textTransform: "uppercase",
      }}>
        {isEditing ? "Edit Location" : "New Location"}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{
            display: "block",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.7rem",
            color: "var(--text-3)",
            marginBottom: "0.4rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              backgroundColor: "var(--bg-3)",
              border: "1px solid var(--bg-4)",
              borderRadius: "0.5rem",
              color: "var(--text-1)",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label style={{
            display: "block",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.7rem",
            color: "var(--text-3)",
            marginBottom: "0.4rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              backgroundColor: "var(--bg-3)",
              border: "1px solid var(--bg-4)",
              borderRadius: "0.5rem",
              color: "var(--text-1)",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label style={{
            display: "block",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.7rem",
            color: "var(--text-3)",
            marginBottom: "0.4rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Type
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["bin", "dumpster"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  backgroundColor: type === t ? "var(--kraft-dim)" : "var(--bg-3)",
                  border: `1px solid ${type === t ? "var(--kraft)" : "var(--bg-4)"}`,
                  borderRadius: "0.5rem",
                  color: type === t ? "var(--kraft)" : "var(--text-2)",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: "var(--danger-dim)",
            border: "1px solid var(--danger)",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            color: "var(--danger)",
            fontSize: "0.875rem",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "0.875rem",
              backgroundColor: "var(--bg-3)",
              border: "1px solid var(--bg-4)",
              borderRadius: "0.5rem",
              color: "var(--text-2)",
              cursor: "pointer",
              fontFamily: "IBM Plex Mono, monospace",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2,
              padding: "0.875rem",
              backgroundColor: "var(--kraft)",
              color: "#0c0a08",
              border: "none",
              borderRadius: "0.5rem",
              fontFamily: "Barlow Condensed, sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "SAVE"}
          </button>
        </div>
      </form>
    </div>
  )
}
