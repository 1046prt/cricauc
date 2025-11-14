# CricAuc - Virtual Auction Platform

A complete virtual auction platform for cricket leagues (IPL, WPL, ISL, Hundred, WBBL).

## Features

- 🔐 Authentication (Email/Password + Google OAuth)
- 🏆 Multi-league support
- 👥 Team management
- 🎯 Real-time auctions with WebSockets
- 📊 Draft system
- 🔄 Trade system
- 📈 Player stats and historical points
- 💰 Purse management
- 👨‍💼 Admin panel

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: NestJS, Node.js
- **Database**: PostgreSQL
- **Cache/Real-time**: Redis
- **WebSockets**: Socket.IO
- **Storage**: AWS S3
- **Auth**: JWT, OAuth 2.0
- **Infrastructure**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Quick Setup (Recommended)

1. **Run setup script** (creates .env files and installs dependencies):

   ```bash
   npm run setup
   ```

2. **Start Docker services**:

   ```bash
   npm run docker:up
   ```

3. **Create admin user**:

   ```bash
   cd backend
   npm run create-admin
   cd ..
   ```

4. **Start development servers**:

   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

### Manual Setup

If you prefer manual setup, see `SETUP.md` for detailed instructions.

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend application
├── docker-compose.yml # Docker services configuration
└── README.md
```

## Development

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## License

MIT
