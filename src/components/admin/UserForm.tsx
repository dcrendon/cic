"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/lib/toast"

interface UserFormProps {
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
  onDone: () => void
  onCancel: () => void
}

export function UserForm({ user, onDone, onCancel }: UserFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"user" | "admin">(user?.role as any || "user")
  const [loading, setLoading] = useState(false)

  const isEdit = !!user

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        await authClient.admin.updateUser({
          userId: user.id,
          data: {
            name,
            email,
            role: role as any,
          },
        })
        toast.success("User updated successfully")
      } else {
        await authClient.admin.createUser({
          name,
          email,
          password,
          role: role as any,
        })
        toast.success("User created successfully")
      }
      onDone()
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "var(--bg-2)",
        border: "1px solid var(--bg-4)",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <h2 style={{
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 800,
        fontSize: "1.25rem",
        color: "var(--text-1)",
        margin: 0,
        textTransform: "uppercase",
      }}>
        {isEdit ? "Edit User" : "Add New User"}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.7rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
        }}>Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
          style={{
            backgroundColor: "var(--bg-1)",
            border: "1px solid var(--bg-4)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            color: "var(--text-1)",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.7rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
        }}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="john@example.com"
          style={{
            backgroundColor: "var(--bg-1)",
            border: "1px solid var(--bg-4)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            color: "var(--text-1)",
            fontFamily: "inherit",
          }}
        />
      </div>

      {!isEdit && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.7rem",
            color: "var(--text-3)",
            textTransform: "uppercase",
          }}>Initial Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              backgroundColor: "var(--bg-1)",
              border: "1px solid var(--bg-4)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              color: "var(--text-1)",
              fontFamily: "inherit",
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.7rem",
          color: "var(--text-3)",
          textTransform: "uppercase",
        }}>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          style={{
            backgroundColor: "var(--bg-1)",
            border: "1px solid var(--bg-4)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            color: "var(--text-1)",
            fontFamily: "inherit",
            appearance: "none",
          }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.875rem",
            backgroundColor: "transparent",
            color: "var(--text-3)",
            border: "1px solid var(--bg-4)",
            borderRadius: "0.75rem",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 2,
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
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "SAVING..." : isEdit ? "UPDATE USER" : "CREATE USER"}
        </button>
      </div>
    </form>
  )
}
