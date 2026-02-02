FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
RUN bun install --frozen-lockfile || bun install

# Production image
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=install /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=install /app/packages/db/node_modules ./packages/db/node_modules
COPY packages/db ./packages/db
COPY apps/api ./apps/api
COPY package.json ./

# Run migrations then start the server
WORKDIR /app
EXPOSE 3000
CMD ["sh", "-c", "cd packages/db && bun run src/migrate.ts && cd /app/apps/api && bun run src/index.ts"]
