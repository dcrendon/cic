# Portainer Deployment Guide

Follow these steps to deploy **Cardboard is Cool (CIC)** as a Stack in Portainer using the **Git Repository** method. This ensures the source code is pulled and built directly on your server.

### 1. Prepare Your Repository
Before deploying, ensure your code is pushed to a Git repository (GitHub, Gitea, GitLab, etc.):
1. Ensure the `Dockerfile`, `entrypoint.sh`, and `docker-compose.yml` are in the root of your repo.
2. Push all changes to your main branch.

### 2. Create a New Stack in Portainer
1. Open Portainer and navigate to **Stacks** > **Add stack**.
2. Give your stack a name (e.g., `cic`).
3. Select **Repository** as the build method.
4. **Repository URL**: Paste the URL of your Git repository (e.g., `https://github.com/youruser/cic.git`).
5. **Repository Reference**: Enter the branch name (e.g., `refs/heads/main`).
6. **Compose path**: Ensure this is set to `docker-compose.yml`.

### 3. Configure Environment Variables
Scroll down to the **Environment variables** section and add the following:

| Name | Example / Description |
| :--- | :--- |
| `POSTGRES_USER` | `cic` |
| `POSTGRES_PASSWORD` | `choose_a_secure_password` |
| `POSTGRES_DB` | `cic` |
| `POSTGRES_DATA_PATH` | `/opt/cic/db_data` (Local path on your server for DB storage) |
| `APP_PORT` | `3847` (The port you'll use to access the app) |
| `BETTER_AUTH_SECRET` | A random 32-character string |
| `BETTER_AUTH_URL` | `http://192.168.1.50:3847` (Must match your browser URL) |
| `ADMIN_EMAIL` | `admin@example.com` |
| `ADMIN_PASSWORD` | `secure_admin_password` |

### 4. Deploy and Verify
1. Click **Deploy the stack**. Portainer will now:
   - Clone the repository.
   - Build the Docker image using the `Dockerfile`.
   - Start the PostgreSQL and App containers.
2. **Verify Setup**: Once the stack is running, check the `app` container logs. You should see:
   - `📦 Running database migrations...`
   - `🌱 Seeding initial database records...`
   - `⚡ Starting Next.js server...`

---
**Note:** If your Git repository is private, you will need to enable **Authentication** in Step 2 and provide your Git credentials or a Personal Access Token (PAT).
