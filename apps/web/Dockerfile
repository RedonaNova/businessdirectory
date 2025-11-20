# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy workspace configuration
COPY apps/web/package.json ./apps/web/
COPY libs/database/package.json ./libs/database/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Generate Prisma client and Zod schemas
RUN npx nx run @businessdirectory/database:prisma:generate

# Build database library
RUN npx nx build @businessdirectory/database

# Build Next.js application
RUN npx nx build @businessdirectory/web

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Next.js standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Copy database library build output (required for runtime)
COPY --from=builder /app/libs/database/dist ./libs/database/dist
COPY --from=builder /app/libs/database/prisma ./libs/database/prisma
# Copy Prisma client (generated in node_modules)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "apps/web/server.js"]

