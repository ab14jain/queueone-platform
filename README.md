# QueueOne - Production-Ready MVP

A QR-based real-time queue and token management system for hospitals, government offices, and ticket counters.

## Features

✅ **QR-Based Access** - Each queue has a unique QR code (opens `/q/{publicId}` in mobile browser)  
✅ **Real-Time Updates** - WebSocket-powered instant synchronization  
✅ **Token Management** - Auto-incrementing tokens with optional patient info  
✅ **Live Queue Dashboard** - See now serving, waiting count, and estimated wait time  
✅ **Admin Controls** - Call next, skip, close/open queue  
✅ **Duplicate Prevention** - 10-second anti-spam per device/mobile  
✅ **Mobile-First PWA** - Works offline, installable on home screen  
✅ **Production-Ready** - Docker, TypeScript, error handling, comments

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis (ioredis)
- **Real-Time**: Socket.IO
- **Frontend**: Next.js + React + TypeScript (PWA enabled)
- **Infrastructure**: Docker + docker-compose
- **Notifications**: Firebase Web Push (stub)

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### Option 1: Docker (Recommended for Production)

```bash
cd notification-service
docker-compose up
```

Services will be available at:
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3001
- Backend API: http://localhost:4000
- Notification Service: http://localhost:5001

### Option 2: Local Development

1. **Start database and cache**
   ```bash
   cd notification-service
   docker-compose up postgres redis
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run prisma:seed
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install admin panel dependencies**
   ```bash
   cd ../admin-panel
   npm install
   ```

5. **Start services (in separate terminals)**
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend
   cd frontend && npm run dev

   # Admin Panel
   cd admin-panel && npm run dev
   ```

## API Endpoints

### Public Queue (Customer)

- **GET `/api/queues/:publicId`** - Load queue status
  ```json
  Response: {
    "queue": { "id", "name", "status", "location" },
    "nowServing": "A-001",
    "waitingCount": 5,
    "estimatedWaitMinutes": 12
  }
  ```

- **POST `/api/tokens`** - Create token (join queue)
  ```json
  Request: {
    "queueId": "uuid",
    "patientName": "John Doe",
    "mobile": "+1234567890"
  }
  Response: {
    "tokenNumber": "A-001",
    "tokenId": "uuid",
    "waitingCount": 6
  }
  ```

### Admin Controls

- **POST `/api/queues/:id/next`** - Call next token
- **POST `/api/queues/:id/skip`** - Skip current token
- **POST `/api/queues/:id/close`** - Close queue
- **POST `/api/queues/:id/open`** - Open queue

## Database Schema

### Location
- `id` (UUID primary key)
- `name` - Hospital/office name
- `address` - Physical address
- `type` - Hospital, Government, Retail, etc.

### Queue
- `id` (UUID primary key)
- `publicId` (unique) - URL slug for QR
- `tokenPrefix` - Letter(s) for token format (A, B, etc.)
- `currentSequence` - Auto-incremented counter
- `status` - OPEN/CLOSED
- `locationId` (FK to Location)

### Token
- `id` (UUID primary key)
- `tokenNumber` - Formatted like "A-001"
- `sequence` - Counter value
- `status` - WAITING/SERVING/SERVED/SKIPPED
- `patientName` - Optional patient name
- `mobile` - Optional phone number
- `queueId` (FK to Queue)

## Redis Structure

```
queue:{queueId}:waiting    → LIST of token IDs (FIFO)
queue:{queueId}:current    → STRING (current token ID being served)
token:{tokenId}            → HASH with token metadata
queue:{queueId}:dedupe:{mobile} → EXPIRE key for anti-spam
```

## Features Explained

### Real-Time Synchronization
All connected clients receive instant updates via Socket.IO. When admin calls next token, all users see the update in milliseconds.

### Duplicate Prevention
Each device/mobile is rate-limited to 1 token per 10 seconds using Redis TTL keys.

### Estimated Wait Time
Calculated from average service time of recently served tokens. Falls back to 5 min × waiting count if no history.

### Queue Cache
Redis mirrors the current queue state (waiting list + now serving) for sub-millisecond lookups.

## Development Notes

- **Async/await** used throughout for clean async code
- **Transaction safety** in token creation to prevent sequence collisions
- **Error handling** on all API routes
- **CORS** configured for localhost:3000 and localhost:3001
- **Rate limiting** at 120 requests per minute per IP

## Deployment to Production

1. Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
2. Use managed Redis (AWS ElastiCache, Azure Cache, etc.)
3. Update `DATABASE_URL` and `REDIS_URL` in environment
4. Enable HTTPS and update `CORS_ORIGIN`
5. Configure Firebase credentials for notifications
6. Deploy containers to Kubernetes, Fargate, or similar

## Next Steps / Enhancements

- SMS/Email notifications for token status
- Booking system with time slots
- Analytics dashboard
- Multi-location support with location selection
- QR code generation API
- Token history and reports
- Staff authentication and roles

## License

MIT
