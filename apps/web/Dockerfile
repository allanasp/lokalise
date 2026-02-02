FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
COPY apps/web/package.json ./apps/web/
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
RUN cd apps/web && npm install

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY apps/web ./apps/web
COPY package.json ./

ARG NUXT_PUBLIC_API_URL=http://localhost:3000
ENV NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL}

WORKDIR /app/apps/web
RUN npx nuxt build

# Production
FROM base AS release
COPY --from=build /app/apps/web/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
