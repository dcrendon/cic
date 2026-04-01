"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"

interface SignOutButtonProps {
  variant?: "icon" | "text"
}

export function SignOutButton({ variant = "icon" }: SignOutButtonProps) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/login")
  }

  if (variant === "text") {
    return (
      <button
        onClick={handleSignOut}
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--text-3)",
          backgroundColor: "transparent",
          border: "1px solid var(--bg-4)",
          borderRadius: "0.375rem",
          padding: "0.375rem 0.75rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "all 0.15s ease",
        }}
      >
        <LogOut size={12} />
        Sign Out
      </button>
    )
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.25rem",
        height: "2.25rem",
        borderRadius: "0.5rem",
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        color: "var(--text-3)",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      aria-label="Sign Out"
      title="Sign Out"
    >
      <LogOut size={16} />
    </button>
  )
}
