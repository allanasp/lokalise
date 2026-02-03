# What is Lokalise Self-Hosted?

Lokalise Self-Hosted is a modern, open-source translation management platform designed for teams who need complete control over their localization workflow.

## Overview

Push translation updates to mobile apps instantly without app store releases, manage translations through an intuitive web interface, and integrate seamlessly with React Native, Expo, and web applications.

## Key Features

### Over-the-Air (OTA) Updates

Update app translations instantly without redeploying. Your mobile apps check for translation updates automatically and apply them in the background.

**How it works:**
1. Translator updates text in web UI
2. Change is published
3. Mobile apps receive update within 30 seconds
4. UI re-renders with new translations
5. No app store review required

### Self-Hosted

Complete control over your translation data:
- Host on your own infrastructure
- GDPR and compliance-friendly
- No vendor lock-in
- Custom integrations possible

### Multi-Tenant

Built for teams and organizations:
- Organization-based access control
- Multiple projects per organization
- Invite team members
- Role-based permissions (coming soon)

### Modern Tech Stack

Built with cutting-edge technologies:
- **API**: Hono + Bun (blazing fast)
- **Database**: PostgreSQL 17 + Drizzle ORM
- **Admin UI**: Nuxt 4 + Vue 3
- **Auth**: Better Auth
- **Mobile SDK**: React (React Native/Expo)

## Use Cases

### Mobile App Translation

A fintech app with 50,000+ users supporting 10 languages:
- Translators update copy daily
- Changes go live instantly via OTA
- Users see updates within 30 seconds
- Zero downtime, zero re-deployments

### Multi-Brand SaaS Platform

A SaaS company running 20 white-labeled apps:
- Each brand gets a separate project
- Translators collaborate in organizations
- API keys keep data isolated
- Bulk export integrates with i18next

### Game Localization

A game studio localizing to 25 languages:
- Developers push key changes via API
- Translators work in parallel
- QA reviews drafts before publishing
- Event translations go live synchronized

### Enterprise Internal Tools

A corporation with 100+ internal apps:
- IT manages one Lokalise instance
- Each team gets an organization
- Self-hosted for compliance
- Complete audit trail

## Architecture

```
┌─────────────────────────────────────────┐
│          Admin UI (Nuxt 4)              │
│  - Projects Dashboard                   │
│  - Translation Editor                   │
│  - Import/Export                        │
└─────────────┬───────────────────────────┘
              │ Session Auth
              ▼
┌─────────────────────────────────────────┐
│         REST API (Hono + Bun)           │
│  - Admin API (/api/v1/*)                │
│  - Public API (/api/public/v1/*)        │
└─────────────┬───────────────────────────┘
              │ Drizzle ORM
              ▼
        ┌──────────────┐
        │ PostgreSQL   │
        │  Database    │
        └──────────────┘
              ▲
              │ x-api-key
┌─────────────┴───────────────────────────┐
│      Mobile Apps (React Native)         │
│  - @lokalise/sdk-react                  │
│  - AsyncStorage cache                   │
│  - Polling (30s default)                │
└─────────────────────────────────────────┘
```

## Performance

| Metric | Value |
|--------|-------|
| API Response Time | < 10ms |
| Database Queries | 1-3 per request |
| OTA Update Size | 5-50KB |
| Cold Start (Mobile) | < 100ms |
| Concurrent Users | 1000+ |

## Next Steps

- [Getting Started](/guide/getting-started) - Set up your first instance
- [Architecture](/guide/architecture) - Deep dive into system design
- [React Native SDK](/sdk/react-native) - Integrate with your app
