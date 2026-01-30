# QueueOne UAT Quick Reference Guide

## 🚀 Quick Start (30 seconds)

```powershell
# PowerShell - Start UAT
cd d:\Ideation\queueone-platform
.\scripts\start-uat.ps1

# Access services:
# Frontend:   http://localhost:3002
# Admin:      http://localhost:3003
# API:        http://localhost:4001
# Logs:       docker-compose -f docker-compose.uat.yml logs -f
```

## 🛑 Quick Stop

```powershell
# PowerShell - Stop UAT (keeps data)
.\scripts\stop-uat.ps1

# Or manually:
docker-compose -f docker-compose.uat.yml down

# With full cleanup:
docker-compose -f docker-compose.uat.yml down -v
```

## 📊 Service Status

```bash
# Check all services
docker-compose -f docker-compose.uat.yml ps

# View logs in real-time
docker-compose -f docker-compose.uat.yml logs -f

# View specific service logs
docker-compose -f docker-compose.uat.yml logs -f backend
docker-compose -f docker-compose.uat.yml logs -f frontend
docker-compose -f docker-compose.uat.yml logs -f admin-panel
```

## 💾 Database Management

```bash
# Access PostgreSQL CLI
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat

# Useful SQL queries:
SELECT * FROM queue;                    -- List all queues
SELECT * FROM token ORDER BY created_at DESC LIMIT 20;  -- Recent tokens
SELECT * FROM "Doctor";                 -- List doctors
SELECT COUNT(*) FROM token WHERE status = 'WAITING';     -- Count waiting tokens

# Access Redis CLI
docker-compose -f docker-compose.uat.yml exec redis redis-cli
KEYS *                                  -- List all keys
FLUSHALL                                -- Clear cache (⚠️ use carefully)
```

## 🔍 Common Troubleshooting

| Issue | Solution |
|-------|----------|
| Services won't start | `docker-compose -f docker-compose.uat.yml down -v && docker-compose -f docker-compose.uat.yml up -d` |
| Port already in use | `netstat -ano \| findstr :3002` then kill process |
| WebSocket connection fails | Check backend logs: `docker-compose -f docker-compose.uat.yml logs backend` |
| Database connection error | Verify PostgreSQL is healthy: `docker-compose -f docker-compose.uat.yml ps postgres` |
| No test data | `docker-compose -f docker-compose.uat.yml exec backend npm run db:seed` |
| Frontend blank page | Clear browser cache (Ctrl+Shift+Del) and hard refresh |

## 🔐 Test Credentials

| Component | Host | Port | Username | Password |
|-----------|------|------|----------|----------|
| PostgreSQL | localhost | 5433 | queueone_uat | uat_secure_pass_2026 |
| Redis | localhost | 6380 | (none) | (none) |
| Test User Email | - | - | test@queueone.uat | TestPass123! |

## 📍 Service URLs

| Service | URL |
|---------|-----|
| **Patient Frontend** | http://localhost:3002 |
| **Admin Panel** | http://localhost:3003 |
| **Backend API** | http://localhost:4001 |
| **Health Check** | http://localhost:4001/health |
| **Notification Service** | http://localhost:5002 |
| **API Docs** | http://localhost:4001/api/docs (if available) |

## ⚡ Key Testing Scenarios

### 1. Basic Queue Flow (5 min)
```
Frontend: Join queue → Get token → Admin: Call next → See update in real-time
```

### 2. Multi-User Test (10 min)
```
Open 3+ browser tabs on same queue → Join from each → See sync updates → Admin calls next → All update instantly
```

### 3. Admin Controls (5 min)
```
Admin: Call next → Skip token → Close queue → Open queue → Monitor real-time sync
```

### 4. Mobile Test (5 min)
```
Open on phone: http://<your-pc-ip>:3002 → Join queue → Verify responsive layout
```

## 🔧 Docker Commands Cheat Sheet

```bash
# Start/Stop/Restart
docker-compose -f docker-compose.uat.yml up -d        # Start all
docker-compose -f docker-compose.uat.yml down          # Stop all
docker-compose -f docker-compose.uat.yml restart       # Restart all
docker-compose -f docker-compose.uat.yml pause backend # Pause backend

# Rebuild containers
docker-compose -f docker-compose.uat.yml build --no-cache

# Execute commands in containers
docker-compose -f docker-compose.uat.yml exec backend npm run db:seed
docker-compose -f docker-compose.uat.yml exec frontend npm run build

# View resource usage
docker stats

# Clean up everything
docker-compose -f docker-compose.uat.yml down -v
docker system prune -a --volumes  # ⚠️ Removes all Docker data
```

## 📝 Testing Checklist

- [ ] Services started and healthy
- [ ] Frontend accessible at :3002
- [ ] Admin panel accessible at :3003
- [ ] Can join queue and get token
- [ ] Real-time updates work (WebSocket)
- [ ] Admin controls work (call next, skip)
- [ ] Queue open/close works
- [ ] Multiple concurrent users sync correctly
- [ ] Database persists data after restart
- [ ] Mobile responsive on phone/tablet

## 🐛 Debug Mode

Enable debug logging:
```bash
# Backend with debug logs
NODE_ENV=uat npm run dev

# Check network requests in browser
# Open DevTools (F12) → Network tab → Monitor http://localhost:4001 calls

# Monitor WebSocket
# DevTools → Network → WS → Check socket.io connection

# Database queries
docker-compose -f docker-compose.uat.yml exec postgres psql -U queueone_uat -d queueone_uat -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

## 📚 Full Documentation

- **Setup Guide**: [UAT_SETUP.md](UAT_SETUP.md)
- **Test Cases**: [UAT_TEST_CASES.md](UAT_TEST_CASES.md)
- **Main README**: [README.md](README.md)

## ⏱️ Expected Startup Time

| Component | Startup Time |
|-----------|--------------|
| PostgreSQL | 5-10 seconds |
| Redis | 2-3 seconds |
| Backend | 10-15 seconds |
| Frontend | 15-20 seconds |
| Admin Panel | 15-20 seconds |
| **Total** | **~60 seconds** |

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose -f docker-compose.uat.yml logs -f`
2. Review [UAT_SETUP.md](UAT_SETUP.md) troubleshooting section
3. Check browser console (F12)
4. Verify all services are running: `docker-compose -f docker-compose.uat.yml ps`
5. Try full restart: `docker-compose -f docker-compose.uat.yml down -v && docker-compose -f docker-compose.uat.yml up -d`

---

**Last Updated**: 2026-01-30  
**Quick Start Version**: 1.0
