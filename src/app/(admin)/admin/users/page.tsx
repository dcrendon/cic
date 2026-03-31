import { db } from "@/db"
import { user } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminUsersPage() {
  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      banned: user.banned,
    })
    .from(user)
    .orderBy(desc(user.createdAt))

  return (
    <div>
      <h1 style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 900,
        fontSize: "2rem",
        color: "var(--text-1)",
        marginBottom: "1.5rem",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}>
        Users <span style={{ color: "var(--text-3)", fontSize: "1.25rem" }}>({users.length})</span>
      </h1>

      <div style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 100px 120px",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid var(--bg-4)",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.65rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
        </div>
        {users.map((u, i) => (
          <div key={u.id} style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 100px 120px",
            padding: "1rem 1.25rem",
            borderBottom: i < users.length - 1 ? "1px solid var(--bg-4)" : "none",
            alignItems: "center",
          }}>
            <span style={{ fontFamily: "IBM Plex Sans, sans-serif", fontWeight: 600, color: "var(--text-1)", fontSize: "0.95rem" }}>
              {u.name}
            </span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.8rem", color: "var(--text-2)" }}>
              {u.email}
            </span>
            <span>
              <span style={{
                padding: "0.2rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: u.role === "admin" ? "var(--kraft-dim)" : "var(--bg-3)",
                color: u.role === "admin" ? "var(--kraft)" : "var(--text-3)",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {u.role ?? "user"}
              </span>
            </span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.75rem", color: "var(--text-3)" }}>
              {new Date(u.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
