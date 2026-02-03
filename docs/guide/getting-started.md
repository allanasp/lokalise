# Getting Started

This guide will help you set up Lokalise Self-Hosted in under 5 minutes.

## Prerequisites

Choose one deployment method:

**Docker (Recommended for production):**
- Docker >= 20.10
- Docker Compose >= 2.0

**Local Development:**
- [Bun](https://bun.sh) >= 1.0 or [pnpm](https://pnpm.io) >= 8.0
- PostgreSQL >= 15
- Node.js >= 18 (if not using Bun)

## Quick Start with Docker

### 1. Clone Repository

```bash
git clone https://github.com/allanasp/lokalise.git
cd lokalise
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set these **required** variables:

```bash
# Generate with: openssl rand -hex 32
BETTER_AUTH_SECRET=your_secret_here

# Strong database password
DB_PASSWORD=your_secure_password

# URLs (change for production)
API_URL=http://localhost:3000
WEB_URL=http://localhost:3001
```

### 3. Start Services

```bash
docker compose up -d
```

This starts:
- PostgreSQL database on port 5432
- API server on port 3000
- Web UI on port 3001

Database migrations run automatically on first startup.

### 4. Access Web UI

Open http://localhost:3001 in your browser.

### 5. Create Account

1. Click "Register"
2. Enter your details
3. Click "Create Account"

### 6. Create Organization

After registration, you'll be prompted to create your first organization.

### 7. Create Project

1. Navigate to Projects
2. Click "Create Project"
3. Enter project name and description
4. Click "Create"

### 8. Get API Key

1. Open your project
2. Go to Settings
3. Copy the API key (starts with `lok_`)

### 9. Add Locales

1. Go to Locales tab
2. Click "Add Locale"
3. Select languages (e.g., en, da, de)
4. Click "Add"

### 10. Add Translations

You can add translations by:
- **Manual entry**: Use the translation editor
- **Import**: Upload JSON file
- **API**: Use the REST API

## Local Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create Database

```bash
createdb lokalise
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```bash
DATABASE_URL=postgres://user@localhost:5432/lokalise
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3001
```

### 4. Run Migrations

```bash
pnpm run db:migrate
```

### 5. Start Development Servers

```bash
pnpm run dev
```

This starts:
- API server on http://localhost:3000
- Web UI on http://localhost:3001
- Drizzle Studio on http://localhost:4983 (database GUI)

## Verify Installation

### Check API Health

```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"ok"}
```

### Check Web UI

Visit http://localhost:3001 - you should see the login page.

### Check Database

Using Docker:
```bash
docker compose exec postgres psql -U lokalise -c "\dt"
```

Using local PostgreSQL:
```bash
psql -d lokalise -c "\dt"
```

Should list all tables (user, session, projects, locales, etc.).

## Next Steps

- [React Native Integration](/sdk/react-native) - Integrate with your mobile app
- [Import Translations](/guide/usage/import-export) - Bulk import existing translations
- [API Reference](/api/overview) - Learn about the REST API
- [Production Deployment](/guide/deployment/docker-compose) - Deploy to production

## Troubleshooting

### Docker services won't start

Check logs:
```bash
docker compose logs -f
```

Verify ports are available:
```bash
lsof -i :3000
lsof -i :3001
lsof -i :5432
```

### Database connection error

Verify DATABASE_URL format:
```bash
postgres://user:password@host:port/database
```

Check PostgreSQL is running:
```bash
pg_isready -h localhost -p 5432
```

### Web UI shows blank page

Check browser console for errors.

Verify API is running:
```bash
curl http://localhost:3000/api/health
```

### Login not working

Verify BETTER_AUTH_SECRET is set:
```bash
grep BETTER_AUTH_SECRET .env
```

Check API logs for auth errors:
```bash
docker compose logs api | grep auth
```

## Getting Help

- [GitHub Discussions](https://github.com/allanasp/lokalise/discussions)
- [Issue Tracker](https://github.com/allanasp/lokalise/issues)
- [Contributing Guide](/development/contributing)
