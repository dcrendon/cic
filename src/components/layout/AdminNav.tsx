"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { SignOutButton } from "@/components/auth/SignOutButton"

const navLinks = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/routes", label: "Routes" },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      backgroundColor: "var(--bg-2)",
      borderBottom: "1px solid var(--bg-4)",
      padding: "0 1.25rem",
      height: "3.5rem",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <Link href="/admin" style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 900,
        fontSize: "1.5rem",
        color: "var(--kraft)",
        textDecoration: "none",
        letterSpacing: "0.02em",
      }}>
        CIC <span style={{ fontSize: "0.7rem", color: "var(--text-3)", fontFamily: "IBM Plex Mono, monospace", fontWeight: 400 }}>ADMIN</span>
      </Link>

      <div style={{ display: "flex", gap: "1.5rem", flex: 1 }}>
        {navLinks.map((link) => {
          const active = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href} style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: active ? "var(--kraft)" : "var(--text-3)",
              textDecoration: "none",
              borderBottom: `2px solid ${active ? "var(--kraft)" : "transparent"}`,
              paddingBottom: "2px",
              transition: "color 0.15s",
            }}>
              {link.label}
            </Link>
          )
        })}
      </div>

      <SignOutButton variant="text" />
    </nav>
  )
}
