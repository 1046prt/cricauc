# CricAuc

A virtual auction platform for cricket fantasy leagues. Built this to handle live auctions for IPL, WPL, ISL, Hundred, and WBBL with real-time bidding, team management, and player stats.

## What's Inside

The platform handles the full auction experience - from creating leagues and teams to running live auctions with WebSocket-based bidding. There's also a draft system, trade functionality, and an admin panel for managing everything.

**Key Features:**

- Email/password auth plus Google OAuth
- Real-time auctions (WebSockets)
- Multi-league support (IPL, WPL, etc.)
- Team and player management
- Draft system
- Trade system
- Player stats and historical points
- Purse/budget management
- Admin dashboard

## Tech Stack

**Frontend:** Next.js 14, React, Tailwind CSS  
**Backend:** NestJS, Node.js  
**Database:** PostgreSQL  
**Cache/Real-time:** Redis  
**WebSockets:** Socket.IO  
**Storage:** AWS S3  
**Auth:** JWT, OAuth 2.0  
**Infrastructure:** Docker

## Getting Started

You'll need Node.js 18+ and Docker installed. The setup script handles most of the heavy lifting.

### Quick Start

1. Run the setup script (it'll create the `.env` files and install dependencies):

   ```bash
   npm run setup
   ```

2. Start up Docker services (PostgreSQL and Redis):

   ```bash
   npm run docker:up
   ```

3. Create an admin user:

   ```bash
   cd backend
   npm run create-admin
   cd ..
   ```

4. Start both frontend and backend:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser. The API runs on http://localhost:4000.

### Manual Setup

If you want to set things up manually, check out `DEPLOYMENT_OPTIONS.md` for detailed instructions.

## Project Structure

```
.
├── frontend/          # Next.js app
├── backend/           # NestJS API
├── docker-compose.yml # Docker services
└── README.md
```

## Development

**Local URLs:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## License

MIT
