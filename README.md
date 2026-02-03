# Lokalise

Self-hosted, open-source translation management platform with OTA (over-the-air) support for React Native / Expo.

## Features

### Core Translation Management
- **Translation Management** – Spreadsheet-style editor for managing translation keys across multiple locales
- **Namespace Support** – Organize translations into logical namespaces (e.g., "default", "common", "errors")
- **Translation Status** – Track translation states: draft, published, or custom workflow states
- **Version Control** – Automatic versioning of translation changes with history tracking
- **Import/Export** – i18next-compatible JSON import and export (nested or flat format)
- **Bulk Operations** – Import entire translation files with overwrite protection

### Mobile & Web Integration
- **OTA Updates** – Push translation changes to mobile apps without app store releases
- **React Native SDK** – `<LokaliseProvider>` + `useTranslation()` hook with AsyncStorage caching
- **Instant Rendering** – Apps render immediately from cache, then update in background
- **Configurable Polling** – Automatic translation checks (default: every 30s)
- **ETag Caching** – Efficient 304 responses for unchanged translations to minimize bandwidth

### Security & Multi-tenancy
- **Multi-tenant** – Organization-based access control via Better Auth
- **API Key Auth** – Per-project API keys (prefixed with `lok_`) for public translation endpoints
- **Session Auth** – Secure admin panel with email/password authentication
- **Key Rotation** – Regenerate API keys without downtime
- **Organization Isolation** – Strict data separation between organizations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | Hono + Bun |
| Database | PostgreSQL 17 + Drizzle ORM |
| Admin UI | Nuxt 4 + Nuxt UI v3 |
| Auth | Better Auth (email/password + organizations) |
| SDK | React (works with React Native + Expo) |
| Monorepo | pnpm workspaces + Turborepo |
| Containerization | Docker Compose |

## Quick Start (Docker)

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env – set BETTER_AUTH_SECRET (openssl rand -hex 32) and DB_PASSWORD

# Start the stack
docker compose up -d
```

The stack will start:
- **API**: http://localhost:3000
- **Admin UI**: http://localhost:3001
- **PostgreSQL**: localhost:5432

Database migrations run automatically on API startup.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.0 (or [pnpm](https://pnpm.io))
- PostgreSQL 15+

### Setup

```bash
# Clone and install
git clone https://github.com/your-org/lokalise.git
cd lokalise
pnpm install

# Create database
createdb lokalise

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET

# Run migrations
pnpm run db:generate
pnpm run db:migrate

# Start dev servers (API on :3000, Web on :3001)
pnpm run dev
```

### Available Scripts

```bash
pnpm run dev          # Start all services in dev mode
pnpm run build        # Build all packages
pnpm run lint         # Check code with Biome
pnpm run lint:fix     # Fix linting issues
pnpm run format       # Format code with Biome
pnpm run db:generate  # Generate new migrations
pnpm run db:migrate   # Apply migrations
pnpm run db:studio    # Open Drizzle Studio (database GUI)
```

## React Native SDK

Install the SDK in your Expo / React Native project:

```bash
npm install @lokalise/sdk-react @react-native-async-storage/async-storage
```

### Usage

```tsx
import { LokaliseProvider, useTranslation } from "@lokalise/sdk-react";

// Wrap your app
export default function App() {
  return (
    <LokaliseProvider
      apiKey="lok_your_project_api_key"
      baseUrl="https://your-lokalise-server.com"
      defaultLocale="en"
      namespaces={["default"]}
      pollInterval={30000} // Optional: check for updates every 30s
    >
      <MyApp />
    </LokaliseProvider>
  );
}

// Use translations in components
function MyScreen() {
  const { t, locale, setLocale, isLoading, isReady } = useTranslation("default");

  return (
    <View>
      <Text>{t("greeting", { name: "World" })}</Text>
      <Text>{t("items_count", { count: 5 })}</Text>
      <Button onPress={() => setLocale("da")} title="Dansk" />
    </View>
  );
}
```

### SDK Features

- **AsyncStorage Caching** – Translations persist locally for instant startup
- **Interpolation** – Support for `{{ variable }}` placeholders in translations
- **Manifest Checking** – Periodically checks for translation updates via version hash
- **ETag Support** – Sends `If-None-Match` headers to avoid re-downloading unchanged data
- **Automatic Re-rendering** – Components update automatically when translations change
- **Locale Switching** – Change language on-the-fly with automatic data fetching

### How OTA Works

1. App renders instantly from AsyncStorage cache
2. SDK checks `/api/public/v1/manifest` for version changes (polls every 30s by default)
3. If new version detected, fetches translations with `If-None-Match` ETag
4. Server returns `304` (unchanged) or `200` (new translations)
5. UI re-renders with updated translations via React Context

## API Endpoints

### Admin API (session auth required)

All admin endpoints require authentication via Better Auth session cookies and an `x-organization-id` header.

#### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects` | List all projects in organization |
| POST | `/api/v1/projects` | Create new project |
| GET | `/api/v1/projects/:id` | Get project details |
| PATCH | `/api/v1/projects/:id` | Update project name/description |
| DELETE | `/api/v1/projects/:id` | Delete project |
| POST | `/api/v1/projects/:id/rotate-key` | Regenerate API key |

#### Locales

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects/:id/locales` | List locales |
| POST | `/api/v1/projects/:id/locales` | Add locale |
| DELETE | `/api/v1/projects/:id/locales/:localeId` | Remove locale |

#### Translation Keys

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects/:id/keys` | List all keys (with query filters) |
| POST | `/api/v1/projects/:id/keys` | Create translation key |
| PUT | `/api/v1/projects/:id/keys/:keyId` | Update key metadata |
| DELETE | `/api/v1/projects/:id/keys/:keyId` | Delete key |

#### Translations

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/v1/projects/:id/translations/:keyId/:localeId` | Update translation value |

#### Import/Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/projects/:id/import` | Import JSON (supports nested/flat, overwrite mode) |
| GET | `/api/v1/projects/:id/export?locale=en&namespace=default&format=nested` | Export translations as JSON |

### Public API (x-api-key header required)

Public endpoints require the project's API key in the `x-api-key` header. No session required.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/v1/translations?locale=X&namespace=Y` | Get published translations (ETag support) |
| GET | `/api/public/v1/manifest` | Get available locales, namespaces, and version hash |

**Example Request:**
```bash
curl -H "x-api-key: lok_abc123..." \
  "http://localhost:3000/api/public/v1/translations?locale=en&namespace=default"
```

## Project Structure

```
lokalise/
├── apps/
│   ├── api/                    # Hono + Bun REST API
│   │   ├── src/
│   │   │   ├── index.ts        # App entry point, route mounting
│   │   │   ├── auth.ts         # Better Auth configuration
│   │   │   ├── middleware/     # Auth & API key middleware
│   │   │   └── routes/
│   │   │       ├── v1/         # Admin API (session auth)
│   │   │       └── public/     # Public API (API key auth)
│   │   └── Dockerfile
│   └── web/                    # Nuxt 4 admin panel
│       ├── app/
│       │   ├── pages/          # Vue pages (login, projects, translation editor)
│       │   ├── components/     # UI components (TranslationTable, ImportModal, etc.)
│       │   ├── composables/    # Vue composables (useAuth, useApi)
│       │   └── layouts/        # App layouts
│       ├── nuxt.config.ts
│       └── Dockerfile
├── packages/
│   ├── db/                     # Drizzle ORM schema + migrations
│   │   ├── src/
│   │   │   ├── schema/         # Database tables (projects, locales, keys, translations, auth)
│   │   │   ├── index.ts        # DB connection + exports
│   │   │   └── migrate.ts      # Migration runner
│   │   └── drizzle.config.ts
│   └── sdk-react/              # React Native SDK
│       ├── src/
│       │   ├── provider.tsx    # LokaliseProvider + useTranslation hook
│       │   ├── client.ts       # API client with polling + caching
│       │   ├── storage.ts      # AsyncStorage cache manager
│       │   ├── interpolation.ts # {{ variable }} interpolation
│       │   └── types.ts
│       └── tsup.config.ts
├── docker-compose.yml          # Multi-service stack (postgres, api, web)
├── .env.example                # Environment variables template
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml
├── biome.json                  # Biome linter/formatter config
└── package.json
```

## Database Schema

### Core Tables

- **projects** – Translation projects with API keys and org ownership
- **locales** – Languages (en, da, de, etc.) per project
- **translation_keys** – Translation keys with namespace grouping
- **translations** – Actual translation values with versioning and status
- **translation_history** – Change log for audit trail

### Auth Tables (Better Auth)

- **user** – User accounts
- **session** – Active sessions
- **account** – OAuth accounts
- **organization** – Tenant organizations
- **member** – Organization memberships
- **invitation** – Pending org invites
- **verification** – Email verification tokens

## Configuration

### Environment Variables

**API** (apps/api/.env):
```env
DATABASE_URL=postgres://user:password@localhost:5432/lokalise
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3001
PORT=3000
```

**Web** (apps/web/.env):
```env
NUXT_PUBLIC_API_URL=http://localhost:3000
NUXT_API_INTERNAL_URL=http://api:3000  # For Docker SSR
```

### Better Auth

The platform uses [Better Auth](https://www.better-auth.com/) for authentication, providing:
- Email/password authentication
- Organization management (create, invite members)
- Session management with secure cookies
- CSRF protection

## Deployment

### Docker Production

```bash
# Build and run with production settings
docker compose -f docker-compose.prod.yml up -d
```

### Environment Security

⚠️ **Important**: Always set strong values for:
- `BETTER_AUTH_SECRET` – Use `openssl rand -hex 32`
- `DB_PASSWORD` – Strong database password
- `CORS_ORIGINS` – Limit to your actual domain(s)

## Use Cases

### 1. React Native Mobile App
- Install SDK in Expo/RN app
- Configure with API key
- Get instant translations from cache
- Receive OTA updates without app store releases

### 2. Multi-language Web App
- Export translations via API
- Integrate with i18next or similar
- Use nested JSON format for clean structure

### 3. Translation Team Workflow
- Developers create keys via import/API
- Translators use web UI to add translations
- QA reviews drafts before publishing
- Changes pushed to production instantly

### 4. Multi-tenant SaaS
- Each customer gets an organization
- Multiple projects per organization
- Separate API keys per project
- Invite team members to collaborate

## Development Tips

### Database Management

```bash
# View database in GUI
pnpm run db:studio

# Create new migration after schema changes
pnpm run db:generate

# Apply migrations
pnpm run db:migrate
```

### Testing API Endpoints

```bash
# Get session cookie (login first via web UI)
# Then use browser dev tools to copy cookies for API testing

# Or use API key for public endpoints
curl -H "x-api-key: lok_xxx" \
  http://localhost:3000/api/public/v1/manifest
```

### Turborepo Cache

Turborepo caches build outputs and task results. To clear cache:

```bash
rm -rf .turbo
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm run lint:fix` and `pnpm run format`
5. Submit a pull request

## Roadmap

Potential future features:
- [ ] Machine translation integration (Google Translate, DeepL)
- [ ] Translation memory and suggestions
- [ ] Glossary management
- [ ] Screenshot context for keys
- [ ] Pluralization support (ICU MessageFormat)
- [ ] Translation comments and discussions
- [ ] Webhooks for translation events
- [ ] CLI tool for CI/CD integration
- [ ] Git integration (push/pull from repos)
- [ ] Role-based permissions (translator, reviewer, admin)

## License

MIT – See [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/lokalise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/lokalise/discussions)

---

**Built with** ❤️ **using Bun, Hono, Nuxt, and Drizzle**
