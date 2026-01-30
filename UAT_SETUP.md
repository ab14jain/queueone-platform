# QueueOne UAT (User Acceptance Testing) Setup

## Overview

This document provides comprehensive instructions for setting up and running the QueueOne platform in a UAT environment for user testing. UAT is designed to closely simulate production while allowing for easy testing, debugging, and data management.

## Environment Details

### UAT Architecture
```
┌─────────────────────────────────────────────┐
│              UAT Environment                │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Port 3002)                       │
│  ├── Patient Queue Display                  │
│  ├── QR Code Scanner Integration            │
│  └── Real-time Queue Updates                │
│                                             │
│  Admin Panel (Port 3003)                    │
│  ├── Queue Management                       │
│  ├── Call Next/Skip Controls                │
│  └── Queue Status Management                │
│                                             │
│  Backend API (Port 4001)                    │
│  ├── Queue Management APIs                  │
│  ├── Token Management                       │
│  ├── Authentication                         │
│  └── WebSocket Server                       │
│                                             │
│  Notification Service (Port 5002)           │
│  └── Push Notifications                     │
│                                             │
│  PostgreSQL (Port 5433)                     │
│  └── queueone_uat Database                  │
│                                             │
│  Redis (Port 6380)                          │
│  └── Session & Cache Store                  │
│                                             │
└─────────────────────────────────────────────┘
```

### Port Mapping
| Service | Port | URL |
|---------|------|-----|
| Frontend | 3002 | http://localhost:3002 |
| Admin Panel | 3003 | http://localhost:3003 |
| Backend API | 4001 | http://localhost:4001 |
| Notification Service | 5002 | http://localhost:5002 |
| PostgreSQL | 5433 | localhost:5433 |
| Redis | 6380 | localhost:6380 |

## Prerequisites

### System Requirements
- Docker & Docker Compose (v20.10+)
- 2GB+ available RAM
- 5GB+ available disk space
- Modern web browser (Chrome, Firefox, Safari)

### Software Versions
- Node.js 20+
- PostgreSQL 16
- Redis 7
- Next.js 13+
- Express.js 4+

## Quick Start

### 1. Start UAT Environment

```bash
# Navigate to project root
cd d:\Ideation\queueone-platform

# Start all UAT services
docker-compose -f docker-compose.uat.yml up -d

# View logs
docker-compose -f docker-compose.uat.yml logs -f

# Wait for services to be healthy (2-3 minutes)
docker-compose -f docker-compose.uat.yml ps
```

### 2. Access Services

Once all services are running (STATUS: Up):

- **Patient Queue Display**: http://localhost:3002
- **Admin Control Panel**: http://localhost:3003
- **Backend API Docs**: http://localhost:4001/api/docs (if available)
- **Health Check**: http://localhost:4001/health

### 3. Stop UAT Environment

```bash
# Stop all services
docker-compose -f docker-compose.uat.yml down

# Stop and remove volumes (clears test data)
docker-compose -f docker-compose.uat.yml down -v
```

## Database Management

### Initialize Test Data

```bash
# Run migrations
docker-compose -f docker-compose.uat.yml exec backend npm run db:migrate

# Seed test data
docker-compose -f docker-compose.uat.yml exec backend npm run db:seed
```

### Access Database

#### PostgreSQL CLI
```bash
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat

# Useful queries:
# List all queues: SELECT * FROM queue;
# List all tokens: SELECT * FROM token;
# Check doctors: SELECT * FROM doctor;
```

#### Using GUI Tool (pgAdmin or DBeaver)
- Host: localhost
- Port: 5433
- Database: queueone_uat
- Username: queueone_uat
- Password: uat_secure_pass_2026

### Redis Access

```bash
# Connect to Redis CLI
docker-compose -f docker-compose.uat.yml exec redis redis-cli

# Useful commands:
# View all keys: KEYS *
# Get cache stats: INFO stats
# Clear all cache: FLUSHALL (⚠️ Use with caution)
```

## Testing Workflows

### Test Scenario 1: Basic Queue Flow

**Objective**: Verify complete queue lifecycle from token generation to completion

**Steps**:
1. Open Frontend: http://localhost:3002
2. Click "Join Queue" for a healthcare facility
3. Patient enters required information (if applicable)
4. System generates token and displays:
   - Current token number
   - Position in queue
   - Estimated wait time
5. Open Admin Panel: http://localhost:3003
6. Load the same queue
7. Click "Call Next Token"
8. Verify token updates on Frontend

**Expected Results**:
- ✅ Token displays correctly
- ✅ Queue position updates in real-time
- ✅ Admin controls work immediately
- ✅ WebSocket synchronization functions properly

### Test Scenario 2: QR Code Access

**Objective**: Verify QR code generation and scanning

**Steps**:
1. Open Admin Panel: http://localhost:3003
2. Load a queue
3. Generate QR code for the queue
4. Use phone camera or QR scanner app
5. Scan the generated QR code
6. Verify it opens the queue page with correct ID

**Expected Results**:
- ✅ QR code displays and is scannable
- ✅ Redirects to correct queue page
- ✅ Public queue ID is correct

### Test Scenario 3: Multiple Concurrent Users

**Objective**: Test system behavior with simultaneous users

**Steps**:
1. Open 3-4 browser windows/tabs to Frontend
2. Have each "join" the same queue
3. Monitor in Admin Panel
4. Verify all clients receive updates simultaneously
5. Call next token from Admin Panel
6. Check all clients update synchronously

**Expected Results**:
- ✅ Waiting count increases for each join
- ✅ All clients update within 1-2 seconds
- ✅ No duplicate tokens generated
- ✅ No data inconsistencies

### Test Scenario 4: Admin Controls

**Objective**: Verify all admin panel functionality

**Steps**:
1. Load queue in Admin Panel: http://localhost:3003
2. Test "Call Next Token" - Verify token updates
3. Test "Skip Current Token" - Verify skipped token is removed
4. Test "Close Queue" - Verify new joins are prevented
5. Test "Open Queue" - Verify new joins are allowed again
6. Monitor Backend logs for errors

**Expected Results**:
- ✅ All controls respond immediately
- ✅ Changes reflect on Frontend instantly
- ✅ No error messages in console or logs
- ✅ Database records update correctly

### Test Scenario 5: Network Resilience

**Objective**: Test system behavior under network interruption

**Steps**:
1. Start normal queue operations
2. Pause backend container: `docker-compose -f docker-compose.uat.yml pause backend`
3. Attempt actions on Frontend/Admin
4. Resume backend: `docker-compose -f docker-compose.uat.yml unpause backend`
5. Verify reconnection and data sync

**Expected Results**:
- ✅ Graceful disconnection messages
- ✅ Auto-reconnection after service restoration
- ✅ No data loss
- ✅ WebSocket re-establishes properly

## Monitoring & Debugging

### View Logs

```bash
# All services
docker-compose -f docker-compose.uat.yml logs -f

# Specific service
docker-compose -f docker-compose.uat.yml logs -f backend
docker-compose -f docker-compose.uat.yml logs -f frontend
docker-compose -f docker-compose.uat.yml logs -f admin-panel
docker-compose -f docker-compose.uat.yml logs -f notification-service

# Last 50 lines
docker-compose -f docker-compose.uat.yml logs --tail=50 backend

# Stream logs with timestamps
docker-compose -f docker-compose.uat.yml logs -f --timestamps backend
```

### Database Debugging

```bash
# Check active connections
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat -c "SELECT * FROM pg_stat_activity;"

# View table sizes
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema');"
```

### Browser DevTools

1. **Frontend** (http://localhost:3002)
   - Open DevTools: F12
   - Network tab: Monitor API calls to http://localhost:4001
   - Console: Check for JavaScript errors
   - WebSocket: Inspect real-time updates

2. **Admin Panel** (http://localhost:3003)
   - Open DevTools: F12
   - Same monitoring as Frontend

### Performance Monitoring

```bash
# Container resource usage
docker stats uat-backend uat-frontend uat-admin-panel

# PostgreSQL query performance
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat -c "SELECT query, mean_exec_time, calls FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Redis memory usage
docker-compose -f docker-compose.uat.yml exec redis redis-cli INFO memory
```

## Test Data Management

### Seed Test Queues

```bash
# Add test data (requires backend to be running)
docker-compose -f docker-compose.uat.yml exec backend npm run db:seed
```

### Create Test Queue Manually

```bash
# Using psql
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat

# SQL
INSERT INTO queue (name, location_id, status, public_id, created_at, updated_at) 
VALUES (
  'Emergency Room', 
  1, 
  'OPEN', 
  'ER-TEST-' || gen_random_uuid()::text, 
  NOW(), 
  NOW()
);
```

### Reset All Data

```bash
# ⚠️ WARNING: This deletes all test data
docker-compose -f docker-compose.uat.yml down -v
docker-compose -f docker-compose.uat.yml up -d
docker-compose -f docker-compose.uat.yml exec backend npm run db:migrate
docker-compose -f docker-compose.uat.yml exec backend npm run db:seed
```

## Known Issues & Troubleshooting

### Issue: Services fail to start
**Solution**:
```bash
# Check if ports are already in use
netstat -ano | findstr :3002
netstat -ano | findstr :4001
netstat -ano | findstr :5433

# Kill process on port (PowerShell):
Stop-Process -Id <PID> -Force

# Or use different ports in docker-compose.uat.yml
```

### Issue: Database connection fails
**Solution**:
```bash
# Verify PostgreSQL is healthy
docker-compose -f docker-compose.uat.yml ps postgres

# Check logs
docker-compose -f docker-compose.uat.yml logs postgres

# Recreate database
docker-compose -f docker-compose.uat.yml down -v
docker-compose -f docker-compose.uat.yml up postgres redis
```

### Issue: WebSocket connection fails
**Solution**:
1. Check backend logs: `docker-compose -f docker-compose.uat.yml logs backend`
2. Verify CORS is configured correctly in backend
3. Check firewall settings for port 4001
4. Clear browser cache and refresh

### Issue: Admin Panel shows no queues
**Solution**:
```bash
# Verify database has data
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat -c "SELECT COUNT(*) FROM queue;"

# If 0 rows, seed data:
docker-compose -f docker-compose.uat.yml exec backend npm run db:seed
```

## Performance Benchmarks

### Expected Response Times
- API endpoints: < 200ms
- WebSocket updates: < 500ms
- Frontend load: < 2 seconds
- Admin Panel load: < 2 seconds

### Expected Concurrent Users (on UAT hardware)
- Same queue: 50+ simultaneous connections
- System-wide: 200+ concurrent users

## Security Considerations

⚠️ **Important**: UAT environment uses test credentials and is NOT suitable for production.

### Test Credentials
- Database User: `queueone_uat`
- Database Password: `uat_secure_pass_2026`
- JWT Secret: `uat_jwt_secret_key_2026_change_in_production`

### Security Best Practices
1. ✅ Never expose UAT environment to internet
2. ✅ Change all credentials before production deployment
3. ✅ Use firewall to restrict access to UAT ports
4. ✅ Keep Docker images updated
5. ✅ Review logs regularly for suspicious activity
6. ✅ Use VPN for remote UAT access

## UAT Checklist

Before signing off on UAT, verify:

### Functionality
- [ ] Queue creation works
- [ ] Token generation works
- [ ] Real-time updates work
- [ ] Admin controls work
- [ ] QR code generation works
- [ ] Multiple concurrent users work

### Performance
- [ ] API responses < 200ms
- [ ] WebSocket latency < 500ms
- [ ] UI renders smoothly
- [ ] Database queries are optimized

### Reliability
- [ ] Service restarts don't cause data loss
- [ ] WebSocket reconnects automatically
- [ ] Logs show no errors
- [ ] Database integrity is maintained

### Security
- [ ] API endpoints validate input
- [ ] No sensitive data in logs
- [ ] CORS is properly configured
- [ ] Database credentials are secure

### UX/UI
- [ ] UI is responsive on mobile
- [ ] QR codes display clearly
- [ ] Buttons/controls are intuitive
- [ ] Error messages are helpful

## Contact & Support

For issues or questions about the UAT setup:
1. Check logs: `docker-compose -f docker-compose.uat.yml logs -f`
2. Review this documentation
3. Check GitHub Issues
4. Contact development team

---

**Last Updated**: 2026-01-30  
**UAT Version**: 1.0  
**Next Review**: 2026-02-15
