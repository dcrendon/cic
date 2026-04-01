import { db } from "@/db"
import { user } from "@/db/schema"
import { desc } from "drizzle-orm"
import { UsersClient } from "@/components/admin/UsersClient"

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

      <UsersClient initialUsers={users} />
    </div>
  )
}
