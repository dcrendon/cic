"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AddStopForm } from "./AddStopForm"

interface ActiveRoutePanelProps {
  route: {
    id: string
    startedAt: Date
    driverId: string
    notes: string | null
    endedAt: Date | null
  }
  stopCount: number
  vanCapacity?: number
}

export function ActiveRoutePanel({ route, stopCount, vanCapacity = 0 }: ActiveRoutePanelProps) {
  const router = useRouter()
  const [showAddStop, setShowAddStop] = useState(false)
  const [ending, setEnding] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const startTime = new Date(route.startedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  function handleEndRoute() {
    setShowConfirm(true)
  }

  async function confirmEndRoute() {
    setShowConfirm(false)
    setEnding(true)
    const res = await fetch(`/api/routes/${route.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endedAt: new Date().toISOString() }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setEnding(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Active badge */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "var(--lime-dim)",
        border: "1px solid var(--lime)",
        borderRadius: "0.5rem",
        padding: "0.625rem 1rem",
      }}>
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "var(--lime)",
          display: "inline-block",
          animation: "pulse 1.5s infinite",
        }} />
        <span style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.75rem",
          color: "var(--lime)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Route in progress · Started {startTime}
        </span>
      </div>

      {/* Van capacity */}
      <div style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "0.75rem",
        }}>
          <span style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.7rem",
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Van Capacity
          </span>
          <span style={{
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800,
            fontSize: "1.5rem",
            color: "var(--text-1)",
          }}>
            {vanCapacity}%
          </span>
        </div>
        <VanCapacityBar value={vanCapacity} />
      </div>

      {/* Stop count */}
      <div style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.7rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          Stops This Route
        </span>
        <span style={{
          fontFamily: "Barlow Condensed, sans-serif",
          fontWeight: 900,
          fontSize: "2rem",
          color: "var(--text-1)",
        }}>
          {stopCount}
        </span>
      </div>

      {/* Add stop form / button */}
      {showAddStop ? (
        <AddStopForm
          routeId={route.id}
          currentVanCapacity={vanCapacity}
          onDone={() => {
            setShowAddStop(false)
            router.refresh()
          }}
          onCancel={() => setShowAddStop(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddStop(true)}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "var(--kraft)",
            color: "#0c0a08",
            border: "none",
            borderRadius: "0.75rem",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800,
            fontSize: "1.25rem",
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          + ADD STOP
        </button>
      )}

      {/* End route */}
      <button
        onClick={handleEndRoute}
        disabled={ending}
        style={{
          width: "100%",
          padding: "0.875rem",
          backgroundColor: "var(--danger-dim)",
          color: "var(--danger)",
          border: "1px solid var(--danger)",
          borderRadius: "0.75rem",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: ending ? "not-allowed" : "pointer",
          opacity: ending ? 0.7 : 1,
        }}
      >
        {ending ? "Ending..." : "End Route"}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes confirm-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {showConfirm && (
        <div
          onClick={() => setShowConfirm(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(12, 10, 8, 0.85)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--bg-2)",
              border: "1px solid var(--danger)",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "22rem",
              width: "90%",
              animation: "confirm-in 0.15s ease both",
            }}
          >
            <p style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontWeight: 900,
              fontSize: "1.75rem",
              letterSpacing: "0.04em",
              color: "var(--danger)",
              margin: "0 0 0.5rem",
            }}>
              END ROUTE?
            </p>
            <p style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.75rem",
              color: "var(--text-3)",
              margin: "0 0 1.5rem",
              lineHeight: 1.5,
            }}>
              This will close the active route. You won&apos;t be able to add more stops.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  backgroundColor: "transparent",
                  color: "var(--text-2)",
                  border: "1px solid var(--bg-4)",
                  borderRadius: "0.5rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmEndRoute}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  backgroundColor: "var(--danger-dim)",
                  color: "var(--danger)",
                  border: "1px solid var(--danger)",
                  borderRadius: "0.5rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                End Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function VanCapacityBar({ value }: { value: number }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Track */}
      <div style={{
        height: "16px",
        backgroundColor: "var(--bg-4)",
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Fill */}
        <div style={{
          height: "100%",
          width: `${Math.min(value, 100)}%`,
          background: "linear-gradient(90deg, var(--kraft) 0%, var(--kraft-light) 100%)",
          borderRadius: "4px",
          transition: "width 0.4s ease",
        }} />
      </div>
      {/* Tick marks */}
      <div style={{ position: "relative", height: "8px", marginTop: "2px" }}>
        {[0, 25, 50, 75, 100].map((tick) => (
          <div key={tick} style={{
            position: "absolute",
            left: `${tick}%`,
            transform: "translateX(-50%)",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.6rem",
            color: "var(--text-4)",
          }}>
            {tick}
          </div>
        ))}
      </div>
    </div>
  )
}
