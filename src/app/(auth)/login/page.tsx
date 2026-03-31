import { LoginForm } from "@/components/auth/LoginForm"
import { getSession } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect("/dashboard")
  return (
    <main style={{ minHeight: "100dvh", backgroundColor: "var(--bg-0)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <LoginForm />
    </main>
  )
}
