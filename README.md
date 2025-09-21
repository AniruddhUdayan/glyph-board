# Glyph Board - Collaborative Digital Whiteboard

A modern, real-time collaborative digital whiteboard built with Next.js, WebSockets, and PostgreSQL. Perfect for teams, brainstorming sessions, and visual collaboration.

![Glyph Board](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange)

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

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd glyph-board
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create `.env` files in the respective app directories:
   
   **For database** (`packages/db/.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/glyphboard"
   ```

   **For HTTP backend** (`apps/http-backend/.env`):
   ```env
   JWT_SECRET="your-jwt-secret"
   DATABASE_URL="postgresql://username:password@localhost:5432/glyphboard"
   ```

   **For WebSocket backend** (`apps/ws-backend/.env`):
   ```env
   JWT_SECRET="your-jwt-secret"
   DATABASE_URL="postgresql://username:password@localhost:5432/glyphboard"
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma db push
   ```

### Development

Start all services in development mode:

```bash
# Start all apps and packages
pnpm dev

# Or start specific services
pnpm dev --filter=glyph-frontend
pnpm dev --filter=http-backend
pnpm dev --filter=ws-backend
```

The applications will be available at:
- **Frontend**: http://localhost:3002
- **HTTP API**: http://localhost:3001 (default)
- **WebSocket**: ws://localhost:8080 (default)

### Production Build

```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm build --filter=glyph-frontend
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

## 🚀 Deployment

### Production Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Build all applications: `pnpm build`
4. Deploy using your preferred method (Docker, Vercel, etc.)

### Nginx Configuration
The project includes nginx configuration for production deployment with:
- Reverse proxy for HTTP backend
- WebSocket proxy for real-time features
- Static file serving for frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Turborepo](https://turborepo.com/)
- Database managed with [Prisma](https://prisma.io/)
- Real-time features with [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
