# Authentication Setup Guide

This guide explains the authentication system implemented in QueueOne Platform.

## Overview

The platform now has three access levels:

1. **Public Access** (No authentication) - Users can:
   - Register for tokens
   - Lookup tokens by mobile number
   - View queue status

2. **Doctor Login** (Authenticated) - Doctors can:
   - View their queue control panel
   - Manage their queues
   - View reporting and analytics
   - Call next tokens and skip tokens

3. **Staff/Admin Login** (Authenticated) - Staff can:
   - Enroll new doctors
   - Manage all queues
   - View all reporting data
   - Create staff accounts (Admin only)

## Setup Instructions

### 1. Database Migration

Run the migration to add authentication tables:

```bash
cd backend
npm run prisma:migrate
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `@types/bcryptjs` - TypeScript types
- `@types/jsonwebtoken` - TypeScript types

### 3. Environment Variables

Add to `backend/.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

### 4. Create First Staff Account

Use the API to create the first staff account:

```bash
curl -X POST http://localhost:3001/api/auth/staff/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@queueone.com",
    "password": "securepassword123",
    "role": "ADMIN"
  }'
```

Or use a tool like Postman/Thunder Client.

### 5. Set Password for Existing Doctors

For doctors enrolled before authentication was added:

```bash
curl -X POST http://localhost:3001/api/auth/doctor/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "doctor-uuid-here",
    "password": "doctorpassword123"
  }'
```

## API Endpoints

### Public Endpoints (No Auth Required)

- `POST /api/tokens` - Register for a token
- `GET /api/tokens/lookup` - Lookup token by mobile
- `GET /api/queues/:publicId` - Get queue status
- `GET /api/queues/public/:publicId/qr` - Get QR code

### Authentication Endpoints

- `POST /api/auth/doctor/login` - Doctor login
- `POST /api/auth/staff/login` - Staff login
- `POST /api/auth/doctor/set-password` - Set doctor password
- `POST /api/auth/staff/create` - Create staff account
- `GET /api/auth/me` - Get current user info (requires auth)

### Protected Endpoints (Require Authentication)

All admin panel functionality now requires authentication:

- `POST /api/doctors/enroll` - Staff/Admin only
- `GET /api/doctors` - All authenticated users
- `POST /api/queues/:id/next` - All authenticated users
- `POST /api/queues/:id/skip` - All authenticated users
- `POST /api/queues/:id/close` - All authenticated users
- `POST /api/queues/:id/open` - All authenticated users
- `GET /api/reporting/*` - All authenticated users

## Login Flow

### Admin Panel (Staff/Doctor)

1. Navigate to `/login` on admin panel
2. Select user type (Staff or Doctor)
3. Enter email and password
4. On success, redirected to dashboard
5. JWT token stored in localStorage
6. Token automatically included in all API requests

### User Portal (Frontend)

- No authentication required
- Users can freely access public features

## Token Management

- JWT tokens expire after 7 days (configurable)
- Tokens are stored in localStorage on the client
- Tokens are sent as `Authorization: Bearer <token>` header
- Invalid/expired tokens automatically redirect to login

## Security Features

✅ Password hashing with bcrypt (10 salt rounds)
✅ JWT-based authentication
✅ Role-based access control (RBAC)
✅ Protected routes with middleware
✅ Token expiration
✅ Automatic logout on token expiry

## Default Credentials

**Important**: Create your own credentials using the API. There are no default credentials.

## Testing Authentication

### 1. Create a staff account:
```bash
POST /api/auth/staff/create
{
  "name": "Test Staff",
  "email": "staff@test.com",
  "password": "test123",
  "role": "STAFF"
}
```

### 2. Login as staff:
```bash
POST /api/auth/staff/login
{
  "email": "staff@test.com",
  "password": "test123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Test Staff",
    "email": "staff@test.com",
    "role": "STAFF"
  }
}
```

### 3. Use the token:
```bash
GET /api/doctors
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Troubleshooting

### "Authentication required" error
- Make sure you're logged in
- Check if token is in localStorage
- Token may have expired - login again

### "Insufficient permissions" error
- You don't have the right role for this action
- Contact admin for permission upgrade

### "Invalid credentials" error
- Check email and password
- Ensure doctor has password set (use set-password endpoint)

## Frontend Components

### AuthContext
Manages authentication state globally

### ProtectedRoute
Wrapper component for routes requiring authentication

### Login Page
Unified login for both doctors and staff

### Logout
Available in dashboard header

## Next Steps

1. ✅ Create your first admin/staff account
2. ✅ Login to admin panel
3. ✅ Set passwords for existing doctors
4. ✅ Test protected routes
5. ✅ Configure production JWT_SECRET

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS for all requests
- [ ] Set secure password policy
- [ ] Enable rate limiting on auth endpoints
- [ ] Add refresh token mechanism (optional)
- [ ] Implement password reset flow (optional)
- [ ] Add 2FA for admin accounts (optional)
