#!/bin/sh
set -e

# Wait for the database to be ready (optional, but handled by healthcheck in compose)
echo "🚀 Starting application lifecycle..."

# Apply database migrations
echo "📦 Running database migrations..."
npx drizzle-kit migrate

# Seed initial data (Admin user)
echo "🌱 Seeding initial database records..."
npx tsx src/lib/seed.ts

# Start the application server
echo "⚡ Starting Next.js server..."
exec node server.js
