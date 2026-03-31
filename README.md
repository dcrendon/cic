# Cardboard is Cool (CIC) – Route & Collection Management

A modern, mobile-first logistics and inventory tracking system designed for specialized recycling collection (e.g., bin and dumpster services). 

This platform streamlines the workflow for drivers on the road and provides administrators with oversight of users and service locations.

## 🚀 Key Features

### For Drivers (Mobile Optimized)
- **Active Route Tracking:** Start and stop collection routes with a single tap.
- **Detailed Stop Logging:** Record critical metrics for every collection:
  - **Fullness %:** Track how much material was collected.
  - **Vehicle Capacity:** Real-time feedback on remaining van/truck space.
- **Route History:** View historical performance and stop counts.
- **Location Directory:** Quick access to assigned service points and addresses.

### For Administrators
- **Location Management:** Define and organize "Bin" and "Dumpster" locations.
- **User Control:** Manage driver accounts and system access roles.
- **System Overview:** Monitor collection efficiency through the data dashboard.

## 🛠️ Technical Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Database:** PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://www.better-auth.com/) (Role-based access control)
- **Styling:** Tailwind CSS 4 & Custom CSS (Industrial "Kraft/Lime" Aesthetic)
- **Icons:** Lucide React

## 🏁 Getting Started

### 1. Prerequisites
- Node.js >= 24
- PostgreSQL instance

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cic
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Database Setup
```bash
# Push schema to database
npx drizzle-kit push

# (Optional) Seed the database with initial locations/users
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure
- `src/app`: Next.js pages and API routes (grouped by `(admin)`, `(driver)`, and `(auth)`).
- `src/db`: Database schema definitions and Drizzle configuration.
- `src/components`: UI components organized by feature (routes, locations, auth).
- `src/lib`: Core utilities for authentication, database connection, and helpers.
