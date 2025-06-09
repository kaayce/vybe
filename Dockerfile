# Base stage
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Build stage
FROM base AS builder
COPY packages/client/package.json packages/client/package.json
COPY packages/server/package.json packages/server/package.json
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/client/ packages/client/
COPY packages/server/ packages/server/

# Build both packages
RUN pnpm build

# Prod
FROM node:22-alpine AS production
WORKDIR /app

# Copy server package.json and install dependencies directly
COPY --from=builder /app/packages/server/package.json ./package.json

# Install production dependencies for server only
RUN corepack enable && \
    corepack prepare pnpm@10.12.1 --activate && \
    pnpm install --prod

# Copy  artifacts
COPY --from=builder /app/packages/server/build ./build
COPY --from=builder /app/packages/client/dist ./dist

# Run as non-root user
RUN addgroup -g 1001 app && \
    adduser -D -u 1001 app -G app
USER app

EXPOSE 3000
CMD ["node", "build/index.js"]