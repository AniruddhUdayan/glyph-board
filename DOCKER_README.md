# 🐳 Glyph Board - Docker Setup

Complete Docker setup for the Glyph Board application with PostgreSQL database.

## 🚀 Quick Start

### Start the entire application with one command:
```bash
docker-compose up -d
```

### Stop all services:
```bash
docker-compose down
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs websockets
docker-compose logs postgres
```

## 🌐 Service URLs

Once running, access your application at:

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001  
- **WebSocket Server**: ws://localhost:8081
- **PostgreSQL Database**: localhost:5432

## 📦 Services

| Service | Description | Port | Health Check |
|---------|-------------|------|--------------|
| **frontend** | Next.js React application | 3002 | ✅ |
| **backend** | Express.js API server | 3001 | ✅ |
| **websockets** | WebSocket real-time server | 8081 | ✅ |
| **postgres** | PostgreSQL database | 5432 | ✅ |
| **migrate** | Database migration (runs once) | - | - |

## 🔧 Configuration

### Environment Variables

The setup uses these default environment variables:

```env
# Database
POSTGRES_DB=glyph_board
POSTGRES_USER=glyph_user
POSTGRES_PASSWORD=glyph_password
DATABASE_URL=postgresql://glyph_user:glyph_password@postgres:5432/glyph_board

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8081
```

### Custom Configuration

1. Copy the environment template:
   ```bash
   cp docker-compose.env .env
   ```

2. Edit `.env` with your custom values

3. Restart services:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## 🔄 Development Commands

### Rebuild services after code changes:
```bash
docker-compose build
docker-compose up -d
```

### Rebuild specific service:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

### View real-time logs:
```bash
docker-compose logs -f
```

### Check service status:
```bash
docker-compose ps
```

## 🗄️ Database

### Database Migrations
Database migrations run automatically when starting the services.

### Manual Database Access
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U glyph_user -d glyph_board

# Run Prisma commands
docker-compose exec backend npx prisma studio
```

### Reset Database
```bash
docker-compose down -v
docker-compose up -d
```

## 🔍 Troubleshooting

### Services not starting?
```bash
# Check logs
docker-compose logs

# Check individual service
docker-compose logs [service-name]
```

### Port conflicts?
Update ports in `docker-compose.yml`:
```yaml
ports:
  - "3003:3002"  # frontend
  - "3002:3001"  # backend
  - "8082:8081"  # websockets
```

### Database connection issues?
```bash
# Check database health
docker-compose exec postgres pg_isready -U glyph_user

# View database logs
docker-compose logs postgres
```

### Fresh start?
```bash
# Stop and remove everything
docker-compose down -v --remove-orphans

# Remove Docker images
docker rmi $(docker images "glyph-board*" -q)

# Start fresh
docker-compose up -d --build
```

## 📋 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   WebSockets    │
│   (Next.js)     │───▶│   (Express)     │◀──▶│   (WS Server)   │
│   Port: 3002    │    │   Port: 3001    │    │   Port: 8081    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   PostgreSQL    │    │   PostgreSQL    │
         │              │   Database      │    │   Database      │
         └──────────────▶│   Port: 5432    │◀───│   Port: 5432    │
                        └─────────────────┘    └─────────────────┘
```

## 🎯 Production Notes

⚠️ **Before deploying to production:**

1. **Change JWT_SECRET** in environment variables
2. **Use strong database passwords**
3. **Configure proper SSL/TLS**
4. **Set up proper logging**
5. **Configure backup strategies**
6. **Use production-grade PostgreSQL**

---

🎉 **Your Glyph Board application is now running!**

