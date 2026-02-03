---
layout: home

hero:
  name: Lokalise Self-Hosted
  text: Translation Management Platform
  tagline: Self-hosted, open-source platform with Over-the-Air updates for mobile apps
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/allanasp/lokalise

features:
  - icon: 
    title: Over-the-Air Updates
    details: Push translation updates to mobile apps instantly without app store releases
  - icon: 
    title: Self-Hosted
    details: Keep your translation data on your own infrastructure with complete control
  - icon: 
    title: Lightning Fast
    details: Built with Bun and Hono for maximum performance and minimal latency
  - icon: 
    title: Secure by Default
    details: Multi-tenant architecture with organization-based access control
  - icon: 
    title: Mobile-First SDK
    details: React Native SDK with AsyncStorage caching and automatic updates
  - icon: 
    title: i18next Compatible
    details: Import and export standard JSON translation formats
---

## Quick Start

### Docker Deployment

```bash
# Clone repository
git clone https://github.com/allanasp/lokalise.git
cd lokalise

# Configure environment
cp .env.example .env
# Edit .env - set DB_PASSWORD and BETTER_AUTH_SECRET

# Start services
docker compose up -d
```

Access at http://localhost:3001

### React Native Integration

```bash
npm install @lokalise/sdk-react @react-native-async-storage/async-storage
```

```tsx
import { LokaliseProvider, useTranslation } from "@lokalise/sdk-react";

export default function App() {
  return (
    <LokaliseProvider
      apiKey="lok_your_api_key"
      baseUrl="https://your-server.com"
      defaultLocale="en"
      namespaces={["default"]}
    >
      <MyApp />
    </LokaliseProvider>
  );
}
```

## Why Lokalise Self-Hosted?

**For Mobile Teams:**
- Update translations without app store releases
- Instant OTA updates reach users in seconds
- Offline-first architecture with caching

**For Enterprises:**
- Complete data ownership and control
- Self-hosted on your infrastructure
- GDPR and compliance-friendly

**For Developers:**
- Modern tech stack (Bun, Hono, Nuxt 4)
- Type-safe APIs with TypeScript
- Docker-ready deployment

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **API** | Hono + Bun |
| **Database** | PostgreSQL 17 + Drizzle ORM |
| **Admin UI** | Nuxt 4 + Nuxt UI v3 |
| **Auth** | Better Auth |
| **Mobile SDK** | React (React Native/Expo compatible) |
| **Monorepo** | pnpm workspaces + Turborepo |

## Community

- [GitHub Discussions](https://github.com/allanasp/lokalise/discussions) - Ask questions
- [Issue Tracker](https://github.com/allanasp/lokalise/issues) - Report bugs
- [Contributing Guide](/development/contributing) - Contribute code

## License

MIT License - See [LICENSE](https://github.com/allanasp/lokalise/blob/main/LICENSE)
