# Credits & Acknowledgments

Lokalise Self-Hosted is built on the shoulders of giants. This project would not be possible without the amazing open-source community and the following projects.

## Core Runtime & Frameworks

### Bun

**[Bun](https://bun.sh)**
- **License**: MIT
- **Purpose**: Ultra-fast JavaScript runtime, package manager, and test runner
- **Why we chose it**: Lightning-fast performance, built-in TypeScript support, excellent developer experience, and all-in-one tooling
- **Authors**: Jarred Sumner and contributors
- **Used in**: API server runtime, package management, development tooling

### Hono

**[Hono](https://hono.dev)**
- **License**: MIT
- **Purpose**: Lightweight, ultra-fast web framework for edge computing
- **Why we chose it**: Minimal overhead, excellent TypeScript support, middleware system, and Express-like API
- **Authors**: Yusuke Wada and contributors
- **Used in**: REST API server, routing, middleware

### Nuxt

**[Nuxt](https://nuxt.com)**
- **License**: MIT
- **Purpose**: The Intuitive Vue Framework with SSR, file-based routing, and auto-imports
- **Why we chose it**: Best-in-class Vue framework, server-side rendering, excellent developer experience, and strong ecosystem
- **Authors**: Nuxt Team (Sébastien Chopin, Alexandre Chopin, Pooya Parsa, and contributors)
- **Used in**: Admin web UI, SSR, routing, state management

### Vue.js

**[Vue.js](https://vuejs.org)**
- **License**: MIT
- **Purpose**: Progressive JavaScript framework for building user interfaces
- **Why we chose it**: Reactive component system, excellent documentation, and gentle learning curve
- **Authors**: Evan You and contributors
- **Used in**: Web UI components, reactivity, templating

### Vue Router

**[Vue Router](https://router.vuejs.org)**
- **License**: MIT
- **Purpose**: Official router for Vue.js applications
- **Why we chose it**: Seamless Vue integration, nested routes, and navigation guards
- **Authors**: Vue Core Team
- **Used in**: Client-side routing, navigation

## Database & ORM

### PostgreSQL

**[PostgreSQL](https://www.postgresql.org)**
- **License**: PostgreSQL License (permissive open-source)
- **Purpose**: Advanced open-source relational database
- **Why we chose it**: Reliability, ACID compliance, excellent JSON support, proven track record, and advanced features
- **Authors**: PostgreSQL Global Development Group
- **Used in**: Primary data store, authentication, translation storage

### Drizzle ORM

**[Drizzle ORM](https://orm.drizzle.team)**
- **License**: Apache 2.0
- **Purpose**: TypeScript ORM for SQL databases with zero dependencies
- **Why we chose it**: Type-safe queries, lightweight, excellent TypeScript integration, no magic, and SQL-like syntax
- **Authors**: Drizzle Team (Andrew Sherman and contributors)
- **Used in**: Database queries, schema management, type safety

### postgres (JavaScript client)

**[postgres](https://github.com/porsager/postgres)**
- **License**: Unlicense / MIT
- **Purpose**: Fastest full-featured PostgreSQL client for Node.js and Deno
- **Why we chose it**: Performance, modern API, prepared statements, and excellent error handling
- **Authors**: Rasmus Porsager
- **Used in**: Database connection pooling, query execution

### Drizzle Kit

**[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)**
- **License**: Apache 2.0
- **Purpose**: CLI companion for Drizzle ORM - migrations, studio, and schema management
- **Why we chose it**: Type-safe migrations, visual database studio, and automatic schema diffing
- **Authors**: Drizzle Team
- **Used in**: Database migrations, schema visualization

## Authentication

### Better Auth

**[Better Auth](https://www.better-auth.com)**
- **License**: MIT
- **Purpose**: Authentication library for TypeScript with organization support
- **Why we chose it**: Modern, type-safe, framework-agnostic, excellent organization/multi-tenant support, and clean API
- **Authors**: Better Auth Team
- **Used in**: User authentication, session management, organization management

## Frontend UI & Styling

### Nuxt UI

**[Nuxt UI](https://ui.nuxt.com)**
- **License**: MIT
- **Purpose**: Fully styled and customizable UI components for Nuxt
- **Why we chose it**: Beautiful components, dark mode support, accessibility, and excellent Nuxt integration
- **Authors**: Nuxt Labs
- **Used in**: Admin UI components, forms, modals, buttons

### Tailwind CSS

**[Tailwind CSS](https://tailwindcss.com)**
- **License**: MIT
- **Purpose**: Utility-first CSS framework for rapid UI development
- **Why we chose it**: Rapid development, consistent design system, excellent customization, and minimal bundle size
- **Authors**: Adam Wathan, Jonathan Reinink, David Hemphill, Steve Schoger
- **Used in**: UI styling, responsive design, theming

### @tailwindcss/vite

**[@tailwindcss/vite](https://tailwindcss.com/docs/installation/vite)**
- **License**: MIT
- **Purpose**: Vite plugin for Tailwind CSS v4
- **Why we chose it**: Fast compilation, HMR support, optimal performance
- **Authors**: Tailwind Labs
- **Used in**: Tailwind CSS integration with Vite

## Build Tools & Monorepo

### Turborepo

**[Turborepo](https://turbo.build)**
- **License**: MIT
- **Purpose**: High-performance build system for JavaScript and TypeScript monorepos
- **Why we chose it**: Lightning-fast builds, intelligent caching, parallel execution, and excellent monorepo support
- **Authors**: Vercel (Jared Palmer and team)
- **Used in**: Monorepo task orchestration, build caching, parallel execution

### pnpm

**[pnpm](https://pnpm.io)**
- **License**: MIT
- **Purpose**: Fast, disk space efficient package manager
- **Why we chose it**: Speed, efficiency, strict dependency management, and monorepo support
- **Authors**: Zoltan Kochan and contributors
- **Used in**: Package management, workspace management

### Vite

**[Vite](https://vitejs.dev)**
- **License**: MIT
- **Purpose**: Next generation frontend tooling with lightning-fast HMR
- **Why we chose it**: Instant server start, fast HMR, optimized builds, and excellent plugin ecosystem
- **Authors**: Evan You and Vite Team
- **Used in**: Development server, bundling, HMR

### tsup

**[tsup](https://tsup.egoist.dev)**
- **License**: MIT
- **Purpose**: Bundle TypeScript libraries with zero config, powered by esbuild
- **Why we chose it**: Zero configuration, fast bundling, multiple formats, and excellent DTS generation
- **Authors**: EGOIST (Kevin Titor)
- **Used in**: React Native SDK bundling, library builds

## Code Quality & TypeScript

### TypeScript

**[TypeScript](https://www.typescriptlang.org)**
- **License**: Apache 2.0
- **Purpose**: Typed superset of JavaScript that compiles to plain JavaScript
- **Why we chose it**: Type safety, excellent tooling, IDE support, and industry standard
- **Authors**: Microsoft (Anders Hejlsberg and team)
- **Used in**: All application code, type checking, IDE integration

### Biome

**[Biome](https://biomejs.dev)**
- **License**: MIT / Apache 2.0
- **Purpose**: One tool for formatting and linting JavaScript, TypeScript, JSX, and JSON
- **Why we chose it**: Blazing fast (written in Rust), single tool for formatting and linting, excellent error messages, and drop-in replacement for ESLint and Prettier
- **Authors**: Biome Team (formerly Rome Tools)
- **Used in**: Code formatting, linting, style enforcement

## Validation & Utilities

### Zod

**[Zod](https://zod.dev)**
- **License**: MIT
- **Purpose**: TypeScript-first schema validation with static type inference
- **Why we chose it**: Type-safe validation, excellent TypeScript integration, composable schemas, and clear error messages
- **Authors**: Colin McDonnell
- **Used in**: Request validation, API input validation, type safety

### @hono/zod-validator

**[@hono/zod-validator](https://hono.dev/docs/guides/validation)**
- **License**: MIT
- **Purpose**: Zod validator middleware for Hono
- **Why we chose it**: Seamless Hono integration, type-safe validation
- **Authors**: Hono Team
- **Used in**: API request validation

### CUID2

**[@paralleldrive/cuid2](https://github.com/paralleldrive/cuid2)**
- **License**: MIT
- **Purpose**: Collision-resistant unique identifiers optimized for horizontal scaling
- **Why we chose it**: URL-safe, sortable, collision-resistant, and better than UUID for distributed systems
- **Authors**: Parallel Drive
- **Used in**: Database IDs, API keys, unique identifiers

## React Native SDK

### React

**[React](https://react.dev)**
- **License**: MIT
- **Purpose**: JavaScript library for building user interfaces
- **Why we chose it**: Component-based architecture, excellent ecosystem, React Native compatibility, and industry standard
- **Authors**: Meta (formerly Facebook) and contributors
- **Used in**: React Native SDK, mobile app integration

### React Native Async Storage

**[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)**
- **License**: MIT
- **Purpose**: Asynchronous, persistent, key-value storage for React Native
- **Why we chose it**: Standard storage solution for React Native, reliable, well-maintained, and cross-platform
- **Authors**: React Native Community
- **Used in**: SDK translation caching, offline storage

### React Types

**[@types/react](https://www.npmjs.com/package/@types/react)**
- **License**: MIT
- **Purpose**: TypeScript definitions for React
- **Why we chose it**: Type safety for React components
- **Authors**: DefinitelyTyped contributors
- **Used in**: SDK TypeScript definitions

## Documentation

### VitePress

**[VitePress](https://vitepress.dev)**
- **License**: MIT
- **Purpose**: Vite & Vue powered static site generator optimized for documentation
- **Why we chose it**: Fast, Vue-powered, excellent for documentation, and built-in search
- **Authors**: Evan You and contributors
- **Used in**: Project documentation, guides, API reference

## Infrastructure & Deployment

### Docker

**[Docker](https://www.docker.com)**
- **License**: Apache 2.0
- **Purpose**: Platform for developing, shipping, and running applications in containers
- **Why we chose it**: Consistent environments, easy deployment, isolation, and industry standard
- **Authors**: Docker, Inc.
- **Used in**: Production deployment, development environments

### Vercel

**[Vercel](https://vercel.com)**
- **Purpose**: Platform for frontend frameworks and static sites
- **Why we chose it**: Excellent developer experience, automatic deployments, edge network, and zero-config
- **Authors**: Vercel Inc.
- **Used in**: Documentation hosting (VitePress deployment)

## Development Tools

### Bun Types

**[@types/bun](https://www.npmjs.com/package/@types/bun)**
- **License**: MIT
- **Purpose**: TypeScript definitions for Bun runtime APIs
- **Authors**: Bun team and DefinitelyTyped contributors
- **Used in**: Bun API type definitions

## Inspiration & Reference

This project draws inspiration from:

### Lokalise (SaaS)
**[Lokalise](https://lokalise.com)**
- The original SaaS translation management platform (proprietary)
- Inspiration for OTA updates and translation workflow

### Tolgee
**[Tolgee](https://tolgee.io)**
- Open-source localization platform
- Inspiration for developer experience

### Weblate
**[Weblate](https://weblate.org)**
- Web-based continuous localization system
- Inspiration for translation management

### i18next
**[i18next](https://www.i18next.com)**
- Internationalization framework
- JSON format compatibility

## Complete Dependency List

### Production Dependencies

**API Server:**
- `hono` - Web framework
- `@hono/zod-validator` - Validation middleware
- `better-auth` - Authentication
- `zod` - Schema validation
- `drizzle-orm` - Database ORM
- `postgres` - PostgreSQL client
- `@paralleldrive/cuid2` - Unique IDs

**Web UI:**
- `nuxt` - Vue framework
- `@nuxt/ui` - UI components
- `vue` - JavaScript framework
- `vue-router` - Routing
- `better-auth` - Authentication
- `tailwindcss` - CSS framework
- `@tailwindcss/vite` - Vite plugin

**Database:**
- `drizzle-orm` - ORM
- `postgres` - PostgreSQL client
- `@paralleldrive/cuid2` - Unique IDs

**React Native SDK:**
- `react` (peer) - React library
- `@react-native-async-storage/async-storage` (peer) - Storage

### Development Dependencies

**Root:**
- `typescript` - Type checking
- `@biomejs/biome` - Formatting & linting
- `turbo` - Monorepo build system

**Database:**
- `drizzle-kit` - Migrations & studio
- `typescript` - Type checking

**SDK:**
- `tsup` - Bundler
- `typescript` - Type checking
- `@types/react` - React types
- `react` (dev) - React library
- `@react-native-async-storage/async-storage` (dev) - Storage

**API:**
- `@types/bun` - Bun types
- `typescript` - Type checking

**Documentation:**
- `vitepress` - Documentation generator
- `vue` - Vue library

## Contributors

- **Allan Asp** ([@allanasp](https://github.com/allanasp)) - Creator and maintainer
- **Claude Sonnet 4.5** - AI pair programming assistant from Anthropic

Want to contribute? Check out our [Contributing Guide](/development/contributing).

## License

Lokalise Self-Hosted is released under the **MIT License**, allowing for:
- Commercial use
- Modification
- Distribution
- Private use

See the [LICENSE](https://github.com/allanasp/lokalise/blob/main/LICENSE) file for full details.

## Supporting Open Source

If you find this project useful, please consider:
- Starring the repository on GitHub
- Contributing code, documentation, or bug reports
- Sharing the project with others
- Sponsoring the maintainers (coming soon)

## Special Thanks

Special thanks to the entire open-source community for making projects like this possible. Every library, tool, and framework listed here represents countless hours of work by dedicated developers around the world.

Thank you to everyone who makes open source possible!

---

**Last updated**: 2026-02-03
