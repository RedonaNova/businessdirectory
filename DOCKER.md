# Docker Setup Guide

This guide explains how to build and run the Business Directory application using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Environment variables configured (see `.env.example`)

## Quick Start

### 1. Set up environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 2. Start all services (Database, API, Web)

```bash
docker-compose up -d
```

This will:
- Start MySQL database
- Build and start the API service
- Build and start the Web service

### 3. Initialize the database

After the services are up, you need to run Prisma migrations:

```bash
# Run migrations
docker-compose exec api npx prisma migrate deploy --schema=libs/database/prisma/schema.prisma

# Or push schema (for development)
docker-compose exec api npx prisma db push --schema=libs/database/prisma/schema.prisma

# Seed the database (optional)
docker-compose exec api npm run db:seed
```

### 4. Access the services

- **Web App**: http://localhost:3000
- **API**: http://localhost:3333
- **API Health Check**: http://localhost:3333/api/v1/health
- **Database**: localhost:3306

## Individual Service Commands

### Build individual services

```bash
# Build API only
docker build -f apps/api/Dockerfile -t businessdirectory-api .

# Build Web only
docker build -f apps/web/Dockerfile -t businessdirectory-web .
```

### Run individual services

```bash
# Run API
docker run -p 3333:3333 \
  -e DATABASE_URL="mysql://user:pass@host:3306/db" \
  -e JWT_SECRET="your-secret" \
  businessdirectory-api

# Run Web
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL="http://localhost:3333" \
  businessdirectory-web
```

## Development Setup

For local development, you can run only the database in Docker:

```bash
# Start only the database
docker-compose -f docker-compose.dev.yml up -d

# Run API and Web locally with npm/nx
npm install
npx nx serve api
npx nx dev web
```

## Production Deployment

### Building for production

```bash
# Build all services
docker-compose build

# Or build individually
docker build -f apps/api/Dockerfile -t businessdirectory-api:latest .
docker build -f apps/web/Dockerfile -t businessdirectory-web:latest .
```

### Running in production

```bash
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

## Database Management

### Access MySQL

```bash
docker-compose exec database mysql -u appuser -p businessdirectory
```

### Backup database

```bash
docker-compose exec database mysqldump -u appuser -p businessdirectory > backup.sql
```

### Restore database

```bash
docker-compose exec -T database mysql -u appuser -p businessdirectory < backup.sql
```

## Troubleshooting

### Check service status

```bash
docker-compose ps
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f database
```

### Restart a service

```bash
docker-compose restart api
docker-compose restart web
```

### Rebuild after code changes

```bash
docker-compose up -d --build
```

## Environment Variables

Key environment variables:

- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXT_PUBLIC_BASE_URL`: API base URL for frontend
- `CORS_ORIGIN`: Allowed CORS origins
- `BACKEND_PORT`: API server port (default: 3333)
- `FRONTEND_PORT`: Web server port (default: 3000)

## Notes

- The database container persists data in a Docker volume
- API logs are stored in a Docker volume
- Both services include health checks
- The API depends on the database being healthy before starting
- The Web service depends on the API being available
