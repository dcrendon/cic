"use client"
import { SignOutButton } from "@/components/auth/SignOutButton"
import Link from "next/link"

interface HeaderProps {
  right?: React.ReactNode
}

export function Header({ right }: HeaderProps) {
  return (
    <header style={{
      backgroundColor: "var(--bg-2)",
      borderBottom: "1px solid var(--bg-4)",
      padding: "0 1.25rem",
      height: "3.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link href="/dashboard" style={{
          fontFamily: "Barlow Condensed, sans-serif",
          fontWeight: 900,
          fontSize: "1.5rem",
          color: "var(--kraft)",
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}>
          CIC <span style={{ fontSize: "0.7rem", color: "var(--text-3)", fontFamily: "IBM Plex Mono, monospace", fontWeight: 400 }}>DRIVER</span>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {right && <div>{right}</div>}
        <SignOutButton variant="text" />
      </div>
    </header>
  )
}
