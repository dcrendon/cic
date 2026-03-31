"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await authClient.signIn.email({ email, password })
    if (err) {
      setError(err.message ?? "Login failed")
      setLoading(false)
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div style={{ width: "100%", maxWidth: "380px" }}>
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "3.5rem", letterSpacing: "-0.02em", color: "var(--kraft)", lineHeight: 1 }}>
          CIC
        </div>
        <div style={{ color: "var(--text-3)", fontSize: "0.875rem", marginTop: "0.25rem", fontFamily: "IBM Plex Mono, monospace" }}>
          cardboard is cool
        </div>
      </div>

      {/* Card */}
      <div style={{ backgroundColor: "var(--bg-2)", borderRadius: "0.75rem", padding: "1.75rem", border: "1px solid var(--bg-4)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontFamily: "IBM Plex Mono, monospace", color: "var(--text-3)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--bg-3)", border: "1px solid var(--bg-4)", borderRadius: "0.5rem", color: "var(--text-1)", fontSize: "1rem", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontFamily: "IBM Plex Mono, monospace", color: "var(--text-3)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--bg-3)", border: "1px solid var(--bg-4)", borderRadius: "0.5rem", color: "var(--text-1)", fontSize: "1rem", outline: "none" }}
            />
          </div>

          {error && (
            <div style={{ backgroundColor: "var(--danger-dim)", border: "1px solid var(--danger)", borderRadius: "0.5rem", padding: "0.75rem 1rem", color: "var(--danger)", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.875rem", backgroundColor: "var(--kraft)", color: "#0c0a08", borderRadius: "0.5rem", fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.05em", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  )
}
