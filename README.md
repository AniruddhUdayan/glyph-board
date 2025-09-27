# Glyph Board - Collaborative Digital Whiteboard

A modern, real-time collaborative digital whiteboard built with Next.js, WebSockets, and PostgreSQL. Perfect for teams, brainstorming sessions, and visual collaboration.

![Glyph Board](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange)

## 📋 Table of Contents

- [🎨 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [🔧 Manual Installation](#-manual-installation)
  - [🐳 Docker Individual Services](#-docker-individual-services)
  - [📦 Docker Compose (Recommended)](#-docker-compose-recommended)
- [🔧 Troubleshooting](#-troubleshooting)
- [🚀 Deployment](#-deployment)
- [📁 Project Structure](#-project-structure)
- [🔧 API Endpoints](#-api-endpoints)
- [🌐 WebSocket Events](#-websocket-events)

## 🎨 Features

### Core Drawing Tools
- **Intuitive Drawing Tools**: Professional-grade drawing experience with multiple tools
  - Pencil for freehand drawing
  - Shapes: Rectangle, Circle, Diamond
  - Lines and Arrows
  - Text tool with custom positioning
  - Eraser for precise element removal
  - Hand tool for canvas panning

### Real-time Collaboration
- **Live Multi-user Editing**: See changes from other users in real-time
- **Synchronized Drawing**: All participants see the same canvas state
- **WebSocket Communication**: Low-latency real-time updates
- **Room-based Collaboration**: Create and join collaborative sessions

### User Management
- **Authentication System**: Secure sign-up and sign-in
- **User Profiles**: Personal accounts with persistent data
- **Room Management**: Create, join, and manage collaborative rooms
- **Dashboard**: Centralized room management interface

### Advanced Canvas Features
- **Infinite Canvas**: Pan and zoom for large workspaces
- **Grid System**: Visual grid for precise alignment
- **Element Selection**: Click to select and manipulate elements
- **Undo/Redo**: Full history management
- **Auto-save**: Persistent storage of all drawings

## 🏗️ Architecture

This project uses a **monorepo architecture** with Turborepo, consisting of:

### Frontend Applications
- **`glyph-frontend`**: Main Next.js application (Port 3002)
- **`web`**: Secondary Next.js application

### Backend Services
- **`http-backend`**: REST API server (Express.js)
- **`ws-backend`**: WebSocket server for real-time collaboration

### Shared Packages
- **`@repo/common`**: Shared TypeScript types and utilities
- **`@repo/db`**: Database layer with Prisma ORM
- **`@repo/backend-common`**: Backend shared utilities
- **`@repo/ui`**: Shared UI components
- **`@repo/eslint-config`**: ESLint configurations
- **`@repo/typescript-config`**: TypeScript configurations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Zod** - Schema validation

### Backend
- **Express.js** - HTTP server
- **WebSocket (ws)** - Real-time communication
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database
- **Prisma** - ORM and database management
- **UUID** - Unique identifiers

### Development Tools
- **Turborepo** - Monorepo build system
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **pnpm** - Package manager

## 🚀 Getting Started

Choose your preferred installation method:

| Method | Best For | Setup Time | Prerequisites | Customization |
|--------|----------|------------|---------------|---------------|
| [🔧 Manual](#-manual-installation) | Development, Learning | 10-15 min | Node.js, PostgreSQL | ⭐⭐⭐ High |
| [🐳 Individual Docker](#-docker-individual-services) | Custom Docker setup | 5-10 min | Docker | ⭐⭐ Medium |
| [📦 Docker Compose](#-docker-compose-recommended) | **Production, Quick Start** | **2-3 min** | **Docker only** | ⭐ **Easy** |

---

## 🔧 Manual Installation

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm** (recommended) - `npm install -g pnpm`
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd glyph-board
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Set up PostgreSQL Database
1. **Create database:**
   ```sql
   CREATE DATABASE glyphboard;
   CREATE USER glyph_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE glyphboard TO glyph_user;
   ```

2. **Create environment variables:**
   
   **`packages/db/.env`:**
   ```env
   DATABASE_URL="postgresql://glyph_user:your_password@localhost:5432/glyphboard"
   ```

   **`apps/http-backend/.env`:**
   ```env
   JWT_SECRET="your-super-secret-jwt-key"
   DATABASE_URL="postgresql://glyph_user:your_password@localhost:5432/glyphboard"
   ```

   **`apps/ws-backend/.env`:**
   ```env
   JWT_SECRET="your-super-secret-jwt-key"
   DATABASE_URL="postgresql://glyph_user:your_password@localhost:5432/glyphboard"
   ```

### Step 4: Set up Database Schema
```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
cd ../..
```

### Step 5: Start Development Services
```bash
# Terminal 1 - Frontend
pnpm dev --filter=glyph-frontend

# Terminal 2 - HTTP Backend  
pnpm dev --filter=http-backend

# Terminal 3 - WebSocket Backend
pnpm dev --filter=ws-backend
```

**Or start all at once:**
```bash
pnpm dev
```

### Access Your Application
- **Frontend**: http://localhost:3002
- **HTTP API**: http://localhost:3001
- **WebSocket**: ws://localhost:8081

---

## 🐳 Docker Individual Services

### Prerequisites
- **Docker** ([Download](https://docker.com/get-started))
- **Docker Desktop** (for Windows/Mac)

### Step 1: Build Docker Images
```bash
# Frontend
docker build -f docker/Dockerfile.frontend -t glyph-frontend .

# Backend API
docker build -f docker/Dockerfile.backend -t glyph-backend .

# WebSocket Server
docker build -f docker/Dockerfile.websockets -t glyph-websockets .
```

### Step 2: Set up PostgreSQL
```bash
# Run PostgreSQL container
docker run -d \
  --name glyph-postgres \
  -e POSTGRES_DB=glyph_board \
  -e POSTGRES_USER=glyph_user \
  -e POSTGRES_PASSWORD=glyph_password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Step 3: Run Services
```bash
# Backend API
docker run -d \
  --name glyph-backend \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://glyph_user:glyph_password@host.docker.internal:5432/glyph_board" \
  -e JWT_SECRET="your-jwt-secret" \
  glyph-backend

# WebSocket Server
docker run -d \
  --name glyph-websockets \
  -p 8081:8081 \
  -e DATABASE_URL="postgresql://glyph_user:glyph_password@host.docker.internal:5432/glyph_board" \
  -e JWT_SECRET="your-jwt-secret" \
  glyph-websockets

# Frontend
docker run -d \
  --name glyph-frontend \
  -p 3002:3002 \
  glyph-frontend
```

### Step 4: Run Database Migration
```bash
docker exec glyph-backend sh -c "cd /app/packages/db && npx prisma migrate deploy"
```

---

## 📦 Docker Compose (Recommended)

### Prerequisites
- **Docker** ([Download](https://docker.com/get-started))
- **Docker Compose** (included with Docker Desktop)

### ⚡ Quick Start
```bash
# Clone repository
git clone <repository-url>
cd glyph-board

# Start everything with one command
docker-compose up -d
```

**That's it!** 🎉 All services are now running:

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001  
- **WebSocket**: ws://localhost:8081
- **PostgreSQL**: localhost:5432

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs
docker-compose logs frontend
docker-compose logs backend

# Check status
docker-compose ps

# Rebuild after code changes
docker-compose build
docker-compose up -d

# Fresh start (removes data)
docker-compose down -v
docker-compose up -d
```

### Custom Configuration

1. **Copy environment template:**
   ```bash
   cp docker-compose.env .env
   ```

2. **Edit `.env` with your values:**
   ```env
   # Database
   POSTGRES_PASSWORD=your_secure_password
   JWT_SECRET=your-super-secret-jwt-key
   
   # Ports (if needed)
   FRONTEND_PORT=3002
   BACKEND_PORT=3001
   WEBSOCKET_PORT=8081
   ```

3. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### What's Included in Docker Compose?

| Service | Description | Port | Auto-starts |
|---------|-------------|------|-------------|
| **postgres** | PostgreSQL database | 5432 | ✅ |
| **migrate** | Database migration | - | ✅ (runs once) |
| **backend** | Express API server | 3001 | ✅ |
| **websockets** | WebSocket server | 8081 | ✅ |
| **frontend** | Next.js application | 3002 | ✅ |

**Features:**
- ✅ Automatic database setup and migration
- ✅ Health checks for all services
- ✅ Service dependency management
- ✅ Persistent database storage
- ✅ Network isolation and security
- ✅ Production-ready configuration

---

## 🏗️ Production Build

### Manual Installation
```bash
# Build all packages and apps
pnpm build

# Start production servers
cd apps/glyph-frontend && pnpm start
cd apps/http-backend && pnpm start  
cd apps/ws-backend && pnpm start
```

### Docker Production
```bash
# Docker Compose (recommended for production)
docker-compose -f docker-compose.yml up -d

# Individual Docker builds
docker build -f docker/Dockerfile.frontend -t glyph-frontend:latest .
docker build -f docker/Dockerfile.backend -t glyph-backend:latest .
docker build -f docker/Dockerfile.websockets -t glyph-websockets:latest .
```

## 📁 Project Structure

```
glyph-board/
├── apps/
│   ├── glyph-frontend/          # Main Next.js frontend app
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── canvas/[roomid]/ # Canvas page with room ID
│   │   │   ├── dashboard/       # User dashboard
│   │   │   ├── signin/          # Sign in page
│   │   │   └── signup/          # Sign up page
│   │   ├── components/          # React components
│   │   │   ├── canvas/          # Canvas-related components
│   │   │   └── ui/              # Reusable UI components
│   │   └── lib/                 # Utilities and contexts
│   ├── http-backend/            # Express.js REST API
│   └── ws-backend/              # WebSocket server
├── packages/
│   ├── common/                  # Shared types and utilities
│   ├── db/                      # Database layer with Prisma
│   ├── backend-common/          # Backend shared utilities
│   ├── ui/                      # Shared UI components
│   ├── eslint-config/           # ESLint configurations
│   └── typescript-config/       # TypeScript configurations
└── nginx-conf/                  # Nginx configuration for production
```

## 🔧 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /signin` - User login

### Rooms
- `GET /rooms` - Get user's rooms
- `POST /rooms` - Create new room
- `GET /rooms/:id` - Get room by ID
- `DELETE /rooms/:id` - Delete room

### Shapes
- `GET /shapes/:roomId` - Get all shapes in a room
- `POST /shapes` - Create new shape
- `PUT /shapes/:id` - Update shape
- `DELETE /shapes/:id` - Delete shape

## 🌐 WebSocket Events

### Client to Server
- `join_room` - Join a collaborative room
- `create_shape` - Create a new drawing element
- `update_shape` - Update an existing element
- `delete_shape` - Delete an element

### Server to Client
- `join_room_success` - Successfully joined room
- `shapes_loaded` - Initial shapes loaded
- `shape_created` - New shape created by another user
- `shape_updated` - Shape updated by another user
- `shape_deleted` - Shape deleted by another user

## 🎯 Key Features Deep Dive

### Canvas System
The canvas uses a custom rendering system built on HTML5 Canvas with:
- **Viewport Management**: Pan and zoom functionality
- **Coordinate System**: Screen-to-world coordinate conversion
- **Element Management**: Add, update, delete, and select elements
- **History System**: Undo/redo with state management

### Real-time Collaboration
- **WebSocket Connection**: Persistent connection with automatic reconnection
- **Event Broadcasting**: Changes are broadcast to all room participants
- **Conflict Resolution**: Last-write-wins with timestamp-based ordering
- **User Isolation**: Users only see their own changes immediately, others' changes via WebSocket

### Database Schema
- **Users**: Authentication and profile data
- **Rooms**: Collaborative workspaces with unique slugs
- **Shapes**: Drawing elements with full metadata and JSON data storage

## 🔧 Troubleshooting

### Common Issues

**Frontend not accessible on port 3002:**
```bash
# Check if container is running
docker-compose ps

# Check frontend logs
docker-compose logs frontend

# Restart frontend service
docker-compose restart frontend
```

**Database connection errors:**
```bash
# Check PostgreSQL container
docker-compose logs postgres

# Verify database connection
docker-compose exec postgres psql -U glyph_user -d glyph_board -c "\l"

# Reset database
docker-compose down -v
docker-compose up -d
```

**Port conflicts:**
```bash
# Check what's using the port
netstat -tulpn | grep :3002

# Use different ports in docker-compose.yml
ports:
  - "3003:3002"  # frontend
  - "3002:3001"  # backend
```

**Services won't start:**
```bash
# Clean restart
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Check system resources
docker system df
docker system prune  # Clean up space if needed
```

**WebSocket connection issues:**
- Ensure WebSocket service is running on port 8081
- Check firewall settings for WebSocket port
- Verify `NEXT_PUBLIC_WS_URL` environment variable

### Performance Tips

**For development:**
```bash
# Use development mode for faster rebuilds
docker-compose -f docker-compose.dev.yml up -d  # If available

# Or rebuild specific services only
docker-compose build frontend
docker-compose up -d frontend
```

**For production:**
- Use a reverse proxy (Nginx) for better performance
- Enable database connection pooling
- Configure proper logging and monitoring
- Use Docker secrets for sensitive data

---

## 🚀 Deployment

### Production Setup Options

#### Option 1: Docker Compose (Recommended)
```bash
# Clone repository on production server
git clone <repository-url>
cd glyph-board

# Set production environment
cp docker-compose.env .env
# Edit .env with production values

# Deploy
docker-compose up -d
```

#### Option 2: Manual Deployment
```bash
# Build for production
pnpm install
pnpm build

# Set up production database and environment
# Deploy each service to your hosting platform
```

#### Option 3: Container Orchestration
- **Kubernetes**: Use provided Docker images with Kubernetes manifests
- **Docker Swarm**: Scale services with Docker Swarm mode
- **Cloud Services**: Deploy to AWS ECS, Google Cloud Run, or Azure Container Instances

### Environment Variables for Production

```env
# Database (use managed PostgreSQL in production)
DATABASE_URL=postgresql://user:password@prod-db:5432/glyph_board

# Security (IMPORTANT: Change these!)
JWT_SECRET=your-very-secure-random-string-min-32-chars
POSTGRES_PASSWORD=very-secure-database-password

# URLs (update with your domain)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://ws.yourdomain.com

# Optional: Performance tuning
NODE_ENV=production
DATABASE_SSL=true
```

### Nginx Configuration
The project includes nginx configuration for production deployment with:
- Reverse proxy for HTTP backend
- WebSocket proxy for real-time features  
- Static file serving for frontend
- SSL/TLS termination
- Load balancing (if needed)

### Security Checklist for Production

- [ ] Change default passwords and JWT secrets
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Use environment variables for sensitive data
- [ ] Configure CORS policies
- [ ] Set up rate limiting
- [ ] Enable database SSL connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ⚡ Quick Start Summary

### 🚀 Fastest Way to Get Started:
```bash
git clone <repository-url>
cd glyph-board
docker-compose up -d
```
**→ Open http://localhost:3002** 🎉

### 🔧 For Development:
```bash
git clone <repository-url>
cd glyph-board
pnpm install
# Set up PostgreSQL database
pnpm dev
```

### 🛠️ Custom Docker Setup:
```bash
git clone <repository-url>
cd glyph-board
docker build -f docker/Dockerfile.frontend -t glyph-frontend .
docker build -f docker/Dockerfile.backend -t glyph-backend .
docker build -f docker/Dockerfile.websockets -t glyph-websockets .
# Run containers individually
```

### 📞 Need Help?
- 📖 Check the [Troubleshooting](#-troubleshooting) section
- 🐛 Report issues in the GitHub repository
- 📧 Contact the development team

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Turborepo](https://turborepo.com/)
- Database managed with [Prisma](https://prisma.io/)
- Real-time features with [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
