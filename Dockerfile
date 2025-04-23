FROM oven/bun:1.2.10-alpine AS base

FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock ./
# Omit --production flag for TypeScript devDependencies
RUN bun install --frozen-lockfile

COPY src ./src
COPY public ./public
COPY next.config.ts .
COPY tsconfig.json .
COPY prisma ./prisma
COPY postcss.config.js .
COPY tailwind.config.ts .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

RUN bun prisma generate

# Build Next.js based on the preferred package manager
RUN bun run build

FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV POST=3000

# Start Next.js based on the preferred package manager
CMD ["node", "server.js"]