"use client"
import { useState, useEffect } from "react"

interface Props {
  routeId: string
  currentVanCapacity: number
  onDone: () => void
  onCancel: () => void
}

const FULLNESS_OPTIONS = [25, 50, 75, 100]

export function AddStopForm({ routeId, currentVanCapacity, onDone, onCancel }: Props) {
  const [locations, setLocations] = useState<Array<{ id: string; name: string; collectionType: string }>>([])
  const [locationId, setLocationId] = useState("")
  const [fullness, setFullness] = useState<number | null>(null)
  const [vanCapacity, setVanCapacity] = useState(currentVanCapacity)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then(setLocations)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!locationId || fullness === null) {
      setError("Select a location and fullness")
      return
    }
    setLoading(true)
    setError("")
    const res = await fetch(`/api/routes/${routeId}/stops`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        locationId,
        fullnessPercent: fullness,
        vanCapacityAfter: vanCapacity,
      }),
    })
    if (res.ok) {
      onDone()
    } else {
      const { error: err } = await res.json()
      setError(err)
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: "var(--bg-2)",
      border: "1px solid var(--bg-4)",
      borderRadius: "0.75rem",
      padding: "1.25rem",
    }}>
      <div style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 800,
        fontSize: "1.25rem",
        color: "var(--text-1)",
        marginBottom: "1rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}>
        Log Stop
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Location select */}
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
            Location
          </label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              backgroundColor: "var(--bg-3)",
              border: "1px solid var(--bg-4)",
              borderRadius: "0.5rem",
              color: locationId ? "var(--text-1)" : "var(--text-4)",
              fontSize: "1rem",
              appearance: "none",
            }}
          >
            <option value="">Select location...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.collectionType})
              </option>
            ))}
          </select>
        </div>

        {/* Fullness selector */}
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
            Fullness
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
            {FULLNESS_OPTIONS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setFullness(pct)}
                style={{
                  padding: "0.875rem 0.5rem",
                  borderRadius: "0.5rem",
                  border: `1px solid ${fullness === pct ? "var(--kraft)" : "var(--bg-4)"}`,
                  backgroundColor: fullness === pct ? "var(--kraft-dim)" : "var(--bg-3)",
                  color: fullness === pct ? "var(--kraft)" : "var(--text-2)",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "all 0.15s",
                }}
              >
                {pct}%
                {/* Mini fill bar */}
                <div style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "var(--bg-4)",
                  borderRadius: "2px",
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: "100%",
                    backgroundColor: fullness === pct ? "var(--kraft)" : "var(--text-4)",
                    borderRadius: "2px",
                  }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Van capacity */}
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
            Van Capacity After (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={vanCapacity}
            onChange={(e) => setVanCapacity(Number(e.target.value))}
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
              fontSize: "0.875rem",
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
            {loading ? "Logging..." : "LOG STOP"}
          </button>
        </div>
      </form>
    </div>
  )
}
