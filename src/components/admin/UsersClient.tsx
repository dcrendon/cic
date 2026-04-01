"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/lib/toast"
import { UserForm } from "./UserForm"
import { Edit2, Shield, User as UserIcon } from "lucide-react"
import { ConfirmDelete } from "@/components/ui/confirm-delete"

interface User {
  id: string
  name: string
  email: string
  role: string | null
  createdAt: Date
  banned: boolean | null
}

export function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string) {
    setLoading(id)
    try {
      await authClient.admin.removeUser({ userId: id })
      toast.success("User deleted successfully")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user")
    } finally {
      setLoading(null)
    }
  }

  function handleEdit(user: User) {
    setEditingUser(user)
    setShowForm(true)
  }

  return (
    <div>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: "100%",
            marginBottom: "1.5rem",
            padding: "0.875rem",
            backgroundColor: "var(--kraft)",
            color: "#0c0a08",
            border: "none",
            borderRadius: "0.75rem",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          + ADD NEW USER
        </button>
      )}

      {showForm && (
        <UserForm
          user={editingUser ? {
            id: editingUser.id,
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role || "driver"
          } : undefined}
          onDone={() => {
            setShowForm(false)
            setEditingUser(null)
            router.refresh()
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
        />
      )}

      <div style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1.5fr 100px 100px 100px",
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
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {initialUsers.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)", fontFamily: "IBM Plex Mono, monospace", fontSize: "0.875rem" }}>
            No users found.
          </div>
        )}

        {initialUsers.map((u, i) => (
          <div key={u.id} style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1.5fr 100px 100px 100px",
            padding: "1rem 1.25rem",
            borderBottom: i < initialUsers.length - 1 ? "1px solid var(--bg-4)" : "none",
            alignItems: "center",
          }}>
            <span style={{ fontFamily: "IBM Plex Sans, sans-serif", fontWeight: 600, color: "var(--text-1)", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {u.role === "admin" ? <Shield size={14} style={{ color: "var(--kraft)" }} /> : <UserIcon size={14} style={{ color: "var(--text-3)" }} />}
              {u.name}
            </span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.8rem", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                onClick={() => handleEdit(u)}
                style={{
                  padding: "0.4rem",
                  backgroundColor: "var(--bg-3)",
                  border: "none",
                  borderRadius: "0.375rem",
                  color: "var(--text-2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Edit User"
              >
                <Edit2 size={14} />
              </button>
              <ConfirmDelete 
                onConfirm={() => handleDelete(u.id)}
                isLoading={loading === u.id}
                description="Are you sure you want to delete this user? This action cannot be undone."
                className="p-1 size-7 bg-red-600/10 text-red-600 hover:bg-red-600/20"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
