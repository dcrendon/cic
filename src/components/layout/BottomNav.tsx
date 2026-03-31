"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/routes", label: "Routes", icon: "⬡" },
  { href: "/locations", label: "Locations", icon: "◉" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "4.5rem",
      backgroundColor: "var(--bg-2)",
      borderTop: "1px solid var(--bg-4)",
      display: "flex",
      zIndex: 50,
    }}>
      {tabs.map((tab) => {
        const active = pathname === tab.href || (tab.href !== "/dashboard" && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              textDecoration: "none",
              color: active ? "var(--kraft)" : "var(--text-3)",
              borderTop: `2px solid ${active ? "var(--kraft)" : "transparent"}`,
              transition: "color 0.15s",
              fontSize: "0.6rem",
              fontFamily: "IBM Plex Mono, monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>{tab.icon}</span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
