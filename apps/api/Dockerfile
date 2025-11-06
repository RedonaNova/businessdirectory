# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy workspace configuration
COPY apps/api/package.json ./apps/api/
COPY libs/database/package.json ./libs/database/

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client and Zod schemas
RUN npx nx run @businessdirectory/database:prisma:generate

# Build database library
RUN npx nx build @businessdirectory/database

# Build API (this will also handle workspace dependencies)
RUN npx nx build @businessdirectory/api

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy database library (needed for runtime imports)
COPY --from=builder /app/libs/database/dist ./libs/database/dist
COPY --from=builder /app/libs/database/prisma ./libs/database/prisma
COPY --from=builder /app/libs/database/package.json ./libs/database/package.json

# Copy Prisma client (generated in node_modules)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Note: If Nx creates workspace_modules during build, copy it here:
# COPY --from=builder /app/apps/api/dist/workspace_modules ./apps/api/dist/workspace_modules

# Install production dependencies from the built package.json
WORKDIR /app/apps/api/dist
RUN if [ -f "package.json" ]; then \
      npm ci --only=production && \
      npm cache clean --force; \
    fi

# Copy root package.json for workspace resolution
WORKDIR /app
COPY --from=builder /app/package.json ./package.json

# Create logs directory
RUN mkdir -p /app/apps/api/logs

# Set working directory to API dist
WORKDIR /app/apps/api/dist

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3333/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "main.js"]

