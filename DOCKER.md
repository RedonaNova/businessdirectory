# Docker Configuration

This monorepo includes Dockerfiles for both the API and Web applications.

## Building Docker Images

### Build API Image

```bash
docker build -f apps/api/Dockerfile -t businessdirectory-api:latest .
```

### Build Web Image

```bash
docker build -f apps/web/Dockerfile -t businessdirectory-web:latest .
```

## Running Docker Containers

### Run API Container

```bash
docker run -p 3333:3333 \
  -e DATABASE_URL="your_database_url" \
  -e NODE_ENV=production \
  businessdirectory-api:latest
```

### Run Web Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL="http://api:3333" \
  businessdirectory-web:latest
```

## Docker Compose Example

You can use docker-compose to run both services together:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - '3333:3333'
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/businessdirectory
      - NODE_ENV=production
    depends_on:
      - db

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/businessdirectory
      - NEXT_PUBLIC_API_URL=http://api:3333
      - NODE_ENV=production
    depends_on:
      - api

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=businessdirectory
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## Notes

- Both Dockerfiles use multi-stage builds for optimization
- Prisma client is generated during the build process
- The database library is built and included in both images
- Health checks are configured for both services
- The Web app uses Next.js standalone mode for optimal Docker deployment

## Environment Variables

### API

- `DATABASE_URL` - Database connection string (required)
- `BACKEND_PORT` - Port to run the API on (default: 3333)
- `NODE_ENV` - Environment (production, development)

### Web

- `DATABASE_URL` - Database connection string (required for server-side)
- `NEXT_PUBLIC_API_URL` - API URL for client-side requests
- `PORT` - Port to run the web app on (default: 3000)
- `NODE_ENV` - Environment (production, development)
