import { db } from "@/db"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"

async function seedUser(name: string, email: string, password: string, role: string) {
  let u = await db.query.user.findFirst({ where: eq(user.email, email) })
  if (!u) {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: new Headers({ "content-type": "application/json" }),
      asResponse: false,
    })
    u = result.user as unknown as typeof u
    console.log("Created user:", email)
  } else {
    console.log("User already exists:", email)
  }
  if (!u?.id) {
    console.error("No user ID for", email)
    process.exit(1)
  }
  await db.update(user).set({ role }).where(eq(user.id, u.id))
  console.log(`Role set to ${role}.`)
}

async function seed() {
  const isProd = process.env.NODE_ENV === "production"
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    console.log("Seeding admin from environment variables...")
    await seedUser(process.env.ADMIN_NAME || "Admin", adminEmail, adminPassword, "admin")
  } else if (!isProd) {
    console.log("Seeding default development users...")
    await seedUser("Admin", "admin@cic.local", "admin1234", "admin")
    await seedUser("Test Driver", "driver@cic.local", "driver1234", "driver")
  } else {
    console.log("Production environment detected but ADMIN_EMAIL and ADMIN_PASSWORD are not set. Skipping seed.")
  }

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
