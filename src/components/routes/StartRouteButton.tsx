"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/toast"

export function StartRouteButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleStart() {
    setLoading(true)
    const res = await fetch("/api/routes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    })
    if (res.ok) {
      router.refresh()
    } else {
      const { error } = await res.json()
      toast.add({ title: error, type: "error" })
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={handleStart}
        disabled={loading}
        style={{
          width: "100%",
          padding: "1.5rem",
          backgroundColor: "var(--kraft)",
          color: "#0c0a08",
          border: "none",
          borderRadius: "0.75rem",
          fontFamily: "Barlow Condensed, sans-serif",
          fontWeight: 900,
          fontSize: "2rem",
          letterSpacing: "0.05em",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {loading ? "STARTING..." : "START ROUTE"}
      </button>
      <p style={{
        textAlign: "center",
        color: "var(--text-3)",
        marginTop: "1rem",
        fontSize: "0.875rem",
        fontFamily: "IBM Plex Mono, monospace",
      }}>
        No active route. Start one to begin tracking.
      </p>
    </div>
  )
}
