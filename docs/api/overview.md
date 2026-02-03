# API Overview

Lokalise provides two REST APIs: an Admin API for managing translations and a Public API for fetching translations in production apps.

## Base URLs

**Local Development:**
- Admin API: `http://localhost:3000/api/v1`
- Public API: `http://localhost:3000/api/public/v1`

**Production:**
- Admin API: `https://your-domain.com/api/v1`
- Public API: `https://your-domain.com/api/public/v1`

## Authentication

### Admin API - Session Auth

Admin endpoints require:
1. Valid session cookie (from login)
2. `x-organization-id` header

**Login to get session:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

**Use session in requests:**
```bash
curl http://localhost:3000/api/v1/projects \
  -H "Cookie: better-auth.session_token=..." \
  -H "x-organization-id: org_abc123"
```

### Public API - API Key Auth

Public endpoints require:
- `x-api-key` header with project API key

**Get API key from project settings, then:**
```bash
curl http://localhost:3000/api/public/v1/translations?locale=en&namespace=default \
  -H "x-api-key: lok_abc123..."
```

## Response Format

### Success Response

```json
{
  "id": "123",
  "name": "My Project",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Error Response

```json
{
  "error": "Project not found"
}
```

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Success, no body |
| 304 | Not Modified | Resource unchanged (ETag) |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict |
| 500 | Server Error | Internal error |

## Rate Limiting

Currently no rate limiting implemented. Recommended limits for production:

- Admin API: 100 requests/minute per user
- Public API: 1000 requests/minute per API key

## Pagination

Paginated endpoints accept:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 100)

**Example:**
```bash
curl "http://localhost:3000/api/v1/projects?page=2&limit=20"
```

**Response includes:**
```json
{
  "data": [...],
  "page": 2,
  "limit": 20,
  "total": 100,
  "pages": 5
}
```

## Filtering

Many endpoints support filtering:

```bash
# Filter by namespace
GET /api/v1/projects/:id/keys?namespace=common

# Filter by status
GET /api/v1/projects/:id/keys?status=published

# Multiple filters
GET /api/v1/projects/:id/keys?namespace=errors&status=draft
```

## ETag Caching

Translation endpoints support ETags:

```bash
# First request
curl http://localhost:3000/api/public/v1/translations?locale=en \
  -H "x-api-key: lok_abc123"

# Response includes ETag
# ETag: "v123"

# Subsequent requests with ETag
curl http://localhost:3000/api/public/v1/translations?locale=en \
  -H "x-api-key: lok_abc123" \
  -H "If-None-Match: v123"

# If unchanged, returns 304 Not Modified (no body)
# If changed, returns 200 OK with new data and ETag
```

## CORS

CORS is configured per environment via `CORS_ORIGINS`:

```bash
# Development
CORS_ORIGINS=http://localhost:3001

# Production (multiple origins)
CORS_ORIGINS=https://app.com,https://admin.app.com
```

Allowed methods: GET, POST, PUT, PATCH, DELETE
Allowed headers: Content-Type, Authorization, x-api-key, x-organization-id

## API Endpoints

### Admin API

**Projects:**
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `POST /api/v1/projects/:id/rotate-key` - Rotate API key

**Locales:**
- `GET /api/v1/projects/:id/locales` - List locales
- `POST /api/v1/projects/:id/locales` - Add locale
- `DELETE /api/v1/projects/:id/locales/:localeId` - Remove locale

**Keys:**
- `GET /api/v1/projects/:id/keys` - List keys
- `POST /api/v1/projects/:id/keys` - Create key
- `PUT /api/v1/projects/:id/keys/:keyId` - Update key
- `DELETE /api/v1/projects/:id/keys/:keyId` - Delete key

**Translations:**
- `PUT /api/v1/projects/:id/translations/:keyId/:localeId` - Update translation

**Import/Export:**
- `POST /api/v1/projects/:id/import` - Import JSON
- `GET /api/v1/projects/:id/export` - Export JSON

### Public API

**Translations:**
- `GET /api/public/v1/translations` - Get translations
- `GET /api/public/v1/manifest` - Get manifest

## Examples

### Create Project

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=..." \
  -H "x-organization-id: org_abc" \
  -d '{
    "name": "My App",
    "slug": "my-app",
    "description": "Mobile app translations"
  }'
```

### Add Locale

```bash
curl -X POST http://localhost:3000/api/v1/projects/proj_123/locales \
  -H "Content-Type: application/json" \
  -H "x-organization-id: org_abc" \
  -d '{
    "code": "da",
    "name": "Danish"
  }'
```

### Import Translations

```bash
curl -X POST http://localhost:3000/api/v1/projects/proj_123/import \
  -H "Content-Type: application/json" \
  -H "x-organization-id: org_abc" \
  -d '{
    "locale": "en",
    "namespace": "default",
    "format": "nested",
    "data": {
      "welcome": {
        "message": "Welcome!",
        "subtitle": "Get started below"
      }
    }
  }'
```

### Get Translations (Public)

```bash
curl "http://localhost:3000/api/public/v1/translations?locale=en&namespace=default" \
  -H "x-api-key: lok_abc123"
```

## Webhooks

Webhooks are not yet implemented. Planned for v2.0:

- `translation.created`
- `translation.updated`
- `translation.deleted`
- `project.updated`
- `locale.added`

## API Versioning

Current version: **v1**

API is versioned in the URL path (`/api/v1/`). Breaking changes will increment the version number.

## Next Steps

- [Authentication Guide](/api/authentication)
- [Admin API Reference](/api/admin/projects)
- [Public API Reference](/api/public/translations)
- [Error Codes](/api/errors)
