# 🐳 Containerized API - Docker Setup

This project provides a complete Docker setup for a Node.js authentication API with PostgreSQL, supporting both development and production environments.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB available RAM
- At least 5GB available disk space

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Node.js App   │    │   PostgreSQL    │
│   (Optional)    │◄──►│   Container     │◄──►│   Database      │
│   Port 80/443   │    │   Port 3000     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Development Environment

1. **Clone and navigate to project:**
```bash
cd C:\Users\User\Desktop\contanerized_API
```

2. **Start development environment:**
```bash
npm run docker:dev:up
```

3. **Access your application:**
- API: http://localhost:3000
- Health check: http://localhost:3000/health
- PgAdmin (optional): http://localhost:8080

### Production Environment

1. **Configure environment variables:**
```bash
# Copy and edit production environment file
copy .env.production .env.production.local
# Edit the .env.production.local file with your production values
```

2. **Start production environment:**
```bash
npm run docker:prod:up
```

## 🔧 Available Commands

### Development Commands
```bash
# Build development containers
npm run docker:dev:build

# Start development environment (with logs)
npm run docker:dev:up

# Start development environment (detached)
npm run docker:dev:up:detached

# Start with PgAdmin database GUI
npm run docker:dev:tools

# View application logs
npm run docker:dev:logs

# Stop development environment
npm run docker:dev:down

# Rebuild from scratch
npm run docker:dev:rebuild
```

### Production Commands
```bash
# Build production containers
npm run docker:prod:build

# Start production environment
npm run docker:prod:up

# View application logs
npm run docker:prod:logs

# Stop production environment
npm run docker:prod:down

# Rebuild from scratch
npm run docker:prod:rebuild
```

### Utility Commands
```bash
# Clean up unused Docker resources
npm run docker:cleanup
```

## 🌍 Environment Configuration

### Development (.env.development)
- Hot reload enabled
- Debug logging
- Development database
- Exposed PostgreSQL port
- PgAdmin included

### Production (.env.production)
- Optimized for performance
- Info-level logging
- Production database
- Security hardening
- Resource limits

## 📊 Database Access

### Development
- **Direct connection:** localhost:5432
- **PgAdmin:** http://localhost:8080
  - Email: admin@example.com
  - Password: pgadmin_password

### Production
- Database port not exposed (security)
- Access only through application network

## 🔒 Security Features

### Production Security
- Non-root user in containers
- No database port exposure
- Secure cookie settings
- Resource limits
- Health checks
- Rate limiting (with Nginx)

### Environment Variables
```bash
# Required Production Variables
POSTGRES_ADMIN_PASSWORD=your_strong_admin_password
JWT_SECRET=your_super_secret_jwt_key_at_least_64_characters
DATABASE_URL=postgresql://prod_user:strong_password@postgres:5432/containerized_api_prod
```

## 🏥 Health Checks

All services include comprehensive health checks:
- **PostgreSQL:** `pg_isready` command
- **Node.js App:** HTTP health endpoint
- **Nginx:** Upstream backend check

## 📝 Database Schema

The PostgreSQL database is automatically initialized with:
- Users table with UUID primary keys
- Proper indexes for performance
- Development and production databases
- User roles and permissions

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Check what's using the port
netstat -ano | findstr :3000
# Kill the process or change port in docker-compose file
```

**Database connection issues:**
```bash
# Check database health
docker-compose -f docker-compose.dev.yml logs postgres
# Wait for database to be ready (30s startup time)
```

**Permission issues:**
```bash
# Reset Docker data
npm run docker:cleanup
# Rebuild containers
npm run docker:dev:rebuild
```

### Logs and Debugging

```bash
# View all services logs
docker-compose -f docker-compose.dev.yml logs

# View specific service logs
docker-compose -f docker-compose.dev.yml logs app
docker-compose -f docker-compose.dev.yml logs postgres

# Follow logs in real-time
docker-compose -f docker-compose.dev.yml logs -f app
```

## 📁 Project Structure

```
├── docker/
│   ├── init-db.sql          # Database initialization
│   └── nginx/
│       └── nginx.conf       # Nginx configuration
├── src/                     # Application source code
├── .env.development         # Development environment
├── .env.production          # Production environment
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.dev.yml   # Development configuration
├── docker-compose.prod.yml  # Production configuration
└── .dockerignore           # Docker build exclusions
```

## 🚀 Deployment

### Local Production Testing
```bash
# Test production build locally
npm run docker:prod:up
```

### Cloud Deployment
1. Copy files to server
2. Update `.env.production` with actual values
3. Configure DNS and SSL certificates
4. Run production containers:
```bash
npm run docker:prod:up
```

### With Nginx Reverse Proxy
```bash
# Start with Nginx proxy
docker-compose -f docker-compose.prod.yml --profile proxy up -d
```

## 📈 Monitoring

### Health Endpoints
- **Application:** http://localhost:3000/health
- **Database:** Built-in PostgreSQL health checks

### Log Locations
- **Development:** ./log/ directory
- **Production:** Docker volumes for persistence

## 🔄 Updates and Maintenance

```bash
# Update containers with new code
npm run docker:dev:rebuild   # Development
npm run docker:prod:rebuild  # Production

# Database backups (production)
docker exec containerized_api_postgres_prod pg_dump -U prod_user containerized_api_prod > backup.sql

# Database restore
docker exec -i containerized_api_postgres_prod psql -U prod_user containerized_api_prod < backup.sql
```

## 📞 Support

- Check logs for error details
- Verify environment variables
- Ensure Docker resources are sufficient
- Review health check status

---

🎉 **Your containerized Node.js API is ready to go!**