# Architecture

Learn how Lokalise Self-Hosted is designed and how components work together.

## System Overview

Lokalise consists of three main components:

1. **API Server** - Hono + Bun REST API
2. **Web UI** - Nuxt 4 admin interface
3. **PostgreSQL** - Relational database

```
┌──────────────────────────────────────────────────────────┐
│                     Admin UI (Nuxt 4)                    │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐       │
│  │   Login    │  │  Projects  │  │ Translation │       │
│  │    Page    │  │  Dashboard │  │   Editor    │       │
│  └────────────┘  └────────────┘  └─────────────┘       │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP + Session Cookies
                       │ (Better Auth)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                 REST API (Hono + Bun)                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Admin API (/api/v1/*)                             │ │
│  │  - Session authentication required                 │ │
│  │  - x-organization-id header required               │ │
│  │  - Projects, Locales, Keys, Translations           │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Public API (/api/public/v1/*)                     │ │
│  │  - x-api-key header required                       │ │
│  │  - Get translations, manifest                      │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────────┘
                       │ SQL Queries
                       │ (Drizzle ORM)
                       ▼
              ┌─────────────────┐
              │  PostgreSQL 17  │
              │                 │
              │  Core Tables:   │
              │  - users        │
              │  - organizations│
              │  - projects     │
              │  - locales      │
              │  - keys         │
              │  - translations │
              └─────────────────┘
                       ▲
                       │ x-api-key
                       │ GET /api/public/v1/translations
┌──────────────────────┴───────────────────────────────────┐
│           Mobile Apps (React Native/Expo)                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  @lokalise/sdk-react                               │ │
│  │  - AsyncStorage cache (offline-first)              │ │
│  │  - Polling every 30s (configurable)                │ │
│  │  - ETag optimization (304 Not Modified)            │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## Components

### API Server (apps/api)

Built with Hono (lightweight web framework) and Bun (fast JavaScript runtime).

**Key Features:**
- RESTful API endpoints
- Two authentication modes (session + API key)
- Organization-based multi-tenancy
- Real-time translation serving
- ETag caching for efficiency

**Middleware Stack:**
```
Request
  ↓
Logger
  ↓
CORS
  ↓
Session/API Key Auth
  ↓
Organization Validation
  ↓
Route Handler
  ↓
Response
```

**File Structure:**
```
apps/api/src/
├── index.ts              # App entry point
├── auth.ts               # Better Auth config
├── middleware/
│   ├── auth.ts           # Session validation
│   └── api-key.ts        # API key validation
└── routes/
    ├── v1/               # Admin API
    │   ├── projects.ts
    │   ├── locales.ts
    │   ├── keys.ts
    │   ├── translations.ts
    │   └── import-export.ts
    └── public/           # Public API
        └── translations.ts
```

### Web UI (apps/web)

Built with Nuxt 4, Vue 3, and Nuxt UI components.

**Key Features:**
- Server-side rendering (SSR)
- File-based routing
- Reactive components
- Dark mode support
- Form validation

**File Structure:**
```
apps/web/app/
├── pages/
│   ├── index.vue         # Redirect to projects
│   ├── login.vue         # Login page
│   ├── register.vue      # Registration
│   └── projects/
│       ├── index.vue     # Projects list
│       └── [id]/
│           ├── index.vue # Translation editor
│           └── settings.vue
├── components/
│   ├── TranslationTable.vue
│   ├── ImportModal.vue
│   └── ColorModeToggle.vue
├── composables/
│   ├── useAuth.ts        # Auth composable
│   └── useApi.ts         # API client
├── layouts/
│   ├── default.vue       # Main layout
│   └── auth.vue          # Auth layout
└── middleware/
    └── auth.global.ts    # Auth guard
```

### Database (packages/db)

PostgreSQL 17 with Drizzle ORM for type-safe queries.

**Schema Design:**

```sql
-- Core tables
projects (id, name, slug, api_key, organization_id)
locales (id, code, name, project_id)
translation_keys (id, key, namespace, project_id)
translations (id, key_id, locale_id, value, status, version)
translation_history (id, translation_id, old_value, new_value, changed_by, changed_at)

-- Auth tables (Better Auth)
user (id, email, name, password_hash, created_at)
session (id, user_id, expires_at, token)
organization (id, name, slug, created_at)
member (id, user_id, organization_id, role)
```

**Relationships:**
- Projects belong to Organizations
- Locales belong to Projects
- Translation Keys belong to Projects
- Translations link Keys and Locales
- History tracks Translation changes

## Data Flow

### Translation Fetch Flow

```
1. Mobile App starts
   ↓
2. Load from AsyncStorage (instant render)
   ↓
3. Check manifest (/api/public/v1/manifest)
   ├─ Returns: version hash, locales, namespaces
   ↓
4. Compare version with cached version
   ├─ Same? → Skip fetch (use cache)
   ├─ Different? → Continue
   ↓
5. Fetch translations (/api/public/v1/translations)
   ├─ Headers: x-api-key, If-None-Match: etag
   ├─ Query: locale=en&namespace=default
   ↓
6. API validates API key
   ↓
7. API queries database
   ↓
8. API returns translations
   ├─ 304 Not Modified (if etag matches)
   ├─ 200 OK + translations (if changed)
   ↓
9. App updates AsyncStorage
   ↓
10. App re-renders UI
```

### Translation Update Flow

```
1. Translator edits translation in Web UI
   ↓
2. Web UI sends PUT /api/v1/translations/:keyId/:localeId
   ├─ Headers: session cookie, x-organization-id
   ├─ Body: { value, status }
   ↓
3. API validates session
   ↓
4. API validates organization ownership
   ↓
5. API updates translation in database
   ├─ Creates history entry
   ├─ Increments project version
   ↓
6. API returns 200 OK
   ↓
7. Web UI updates local state
   ↓
8. Mobile apps poll manifest (every 30s)
   ↓
9. New version detected
   ↓
10. Mobile apps fetch new translations
    ↓
11. UI re-renders with new text
```

## Authentication

### Session Authentication (Admin)

Used by the Web UI for admin operations.

```
1. User logs in with email/password
   ↓
2. Better Auth validates credentials
   ↓
3. Session created with secure cookie
   ├─ httpOnly: true
   ├─ secure: true (production)
   ├─ sameSite: lax
   ↓
4. Cookie sent with all admin API requests
   ↓
5. Middleware validates session
   ├─ Checks session exists
   ├─ Checks not expired
   ├─ Loads user data
   ↓
6. Request proceeds to handler
```

### API Key Authentication (Public)

Used by mobile apps for fetching translations.

```
1. Client includes x-api-key header
   ↓
2. Middleware extracts API key
   ↓
3. Query database for project with key
   ├─ Key format: lok_[random]
   ↓
4. Project found? → Attach to request context
5. Project not found? → Return 401 Unauthorized
   ↓
6. Request proceeds to handler
```

## Caching Strategy

### ETag Caching

API generates ETag based on translation version:

```
1. Client requests translations
   ├─ Headers: If-None-Match: "v123"
   ↓
2. API checks current version
   ├─ Current version: "v123"
   ├─ Match? → Return 304 Not Modified
   ├─ Different? → Return 200 OK + translations
   ↓
3. Response includes ETag header
   ├─ ETag: "v124"
```

**Benefits:**
- Reduces bandwidth (no transfer if unchanged)
- Faster responses (304 is tiny)
- Client knows immediately if update needed

### AsyncStorage Cache (Mobile)

SDK caches translations locally:

```javascript
// Cache structure
{
  "en:default": {
    "version": "v124",
    "data": { "key1": "value1", ... },
    "timestamp": 1234567890
  },
  "da:default": { ... }
}
```

**Benefits:**
- Instant app startup (no network wait)
- Offline functionality
- Reduced API calls

## Scaling Considerations

### Database

**Read-heavy workload:**
- Add read replicas
- Use connection pooling
- Index on commonly queried columns

**Write-heavy workload:**
- Use prepared statements
- Batch inserts where possible
- Optimize indexes

### API

**Horizontal scaling:**
- Stateless design allows multiple instances
- Load balance with nginx/HAProxy
- Share session storage (Redis)

**Vertical scaling:**
- Bun is single-threaded but very fast
- Use cluster mode for multi-core

### Caching

**Add Redis for:**
- Session storage
- Translation caching
- Rate limiting

## Security

### Authentication

- Passwords hashed with bcrypt
- Sessions use secure cookies
- API keys are random and unpredictable

### Authorization

- Organization-based isolation
- Row-level security via queries
- API key scoped to single project

### Data Protection

- SQL injection prevented (parameterized queries)
- XSS prevented (Vue auto-escaping)
- CSRF protected (Better Auth)
- CORS configured per environment

## Monitoring

### Health Checks

```bash
# API health
curl http://localhost:3000/api/health

# Database connection
docker compose exec postgres pg_isready
```

### Logs

```bash
# API logs
docker compose logs -f api

# Database logs
docker compose logs -f postgres

# All logs
docker compose logs -f
```

### Metrics

Monitor:
- API response times
- Database query times
- Error rates
- Cache hit rates
- Active sessions
- API key usage

## Next Steps

- [Performance Guide](/guide/performance) - Optimize your deployment
- [Deployment](/guide/deployment/docker-compose) - Production setup
- [API Reference](/api/overview) - Endpoint documentation
