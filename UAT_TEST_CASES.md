# QueueOne UAT Test Cases

## Test Case Documentation

This document provides detailed test cases for User Acceptance Testing of the QueueOne platform. Each test case includes steps, expected results, and success criteria.

---

## TC-001: User Registration & Authentication

**Objective**: Verify user can register and authenticate

**Preconditions**:
- UAT environment is running
- Frontend is accessible at http://localhost:3002
- Database is initialized

**Test Steps**:
1. Navigate to http://localhost:3002
2. Click on "Login" or "Register"
3. Enter valid email and password
4. Click "Register" or "Sign Up"
5. Complete profile setup (if required)
6. Verify registration success

**Expected Results**:
- Registration form is accessible
- Form validation works for email and password
- User account is created in database
- Login page appears after successful registration
- User can login with new credentials

**Success Criteria**:
- ✅ User account exists in database
- ✅ User can login successfully
- ✅ Session/token is created
- ✅ No error messages in console

**Test Data**:
- Email: test.user@queueone.uat
- Password: TestPass123!

---

## TC-002: Queue Discovery & Access

**Objective**: Verify user can find and access queues

**Preconditions**:
- UAT environment is running
- At least one queue exists in database
- User is authenticated

**Test Steps**:
1. Login with test credentials
2. Navigate to queue discovery/search page
3. Search for a healthcare facility
4. Select a queue
5. Verify queue details load correctly

**Expected Results**:
- Queue list displays with relevant information
- Queue details page loads
- Current wait time displays
- Now serving information is visible
- Join queue button is accessible

**Success Criteria**:
- ✅ Queue list is populated
- ✅ Queue details are accurate
- ✅ Real-time data updates (if available)
- ✅ UI is responsive

**Notes**:
- If no queues exist, seed database with test data

---

## TC-003: Token Generation

**Objective**: Verify patient can join a queue and receive a token

**Preconditions**:
- User is authenticated and viewing queue page
- Queue is in "OPEN" status
- User hasn't joined this queue in last 10 seconds

**Test Steps**:
1. Click "Join Queue" button
2. If prompted, enter patient information
3. Click "Confirm" or "Submit"
4. Wait for token to be generated
5. Verify token displays on screen

**Expected Results**:
- Form appears with relevant fields
- Token is generated immediately
- Token number displays prominently
- Position in queue shows (e.g., "You are #5 in queue")
- Estimated wait time is calculated and displayed
- Token is saved to database

**Success Criteria**:
- ✅ Token is unique
- ✅ Token persists across browser sessions
- ✅ Queue position is accurate
- ✅ Anti-spam (10-second cooldown) works

**Test Data**:
- Patient Name: Test Patient
- Phone: 555-0123
- Queue: Emergency Room

---

## TC-004: Real-Time Queue Updates (WebSocket)

**Objective**: Verify real-time updates work across multiple clients

**Preconditions**:
- UAT environment is running
- At least 2 browsers/tabs with the same queue open
- Both showing real-time updates

**Test Steps**:
1. Open Queue A in Browser 1 (Patient View)
2. Open Admin Panel in Browser 2 (Admin View)
3. Load same Queue A in Admin Panel
4. In Browser 1, click "Join Queue"
5. Monitor waiting count in Browser 2
6. In Admin Panel, click "Call Next"
7. Monitor both displays for updates

**Expected Results**:
- Waiting count increases in Browser 2 immediately after join
- Now serving updates in both browsers simultaneously
- Queue animations are smooth
- No console errors
- Latency is < 1 second

**Success Criteria**:
- ✅ All clients receive updates within 1 second
- ✅ Data is consistent across clients
- ✅ WebSocket connection is active (check Network tab)
- ✅ No duplicate updates

---

## TC-005: Admin Panel - Call Next Token

**Objective**: Verify admin can call next patient's token

**Preconditions**:
- Admin Panel is open at http://localhost:3003
- A queue with waiting tokens is loaded
- At least 3 patients in queue

**Test Steps**:
1. In Admin Panel, load a queue
2. Note the current "Now Serving" value
3. Verify at least 2 tokens in waiting list
4. Click "Call Next Token" button
5. Observe updates in real-time
6. Check database to verify token status

**Expected Results**:
- "Now Serving" updates to next token
- Previous token is marked as served
- Waiting count decreases by 1
- All connected clients update immediately
- Token status in database changes to "SERVING"

**Success Criteria**:
- ✅ Next token is called correctly
- ✅ Database is updated
- ✅ No tokens are skipped
- ✅ Frontend reflects change immediately

---

## TC-006: Admin Panel - Skip Current Token

**Objective**: Verify admin can skip a token

**Preconditions**:
- Admin Panel is open with a queue loaded
- At least 2 tokens are waiting
- One token is being served

**Test Steps**:
1. Load queue in Admin Panel
2. Click "Skip Current Token" button
3. Observe the updates
4. Verify new token is now serving
5. Check the skipped token's status in database

**Expected Results**:
- Current serving token is marked as skipped
- Next token automatically becomes now serving
- Waiting count updates appropriately
- Skipped token shows in admin history
- All clients receive update

**Success Criteria**:
- ✅ Token is properly skipped
- ✅ No data loss
- ✅ History records the skip action
- ✅ Real-time sync works

---

## TC-007: Queue Status Management (Open/Close)

**Objective**: Verify admin can open/close queues

**Preconditions**:
- Admin Panel is open with a queue
- Queue is currently "OPEN"

**Test Steps**:
1. In Admin Panel, click "Close Queue" button
2. Verify status changes to "CLOSED"
3. Try to join queue from Frontend - should be denied
4. Click "Open Queue" button
5. Verify status changes to "OPEN"
6. Try to join queue - should succeed

**Expected Results**:
- Queue status updates immediately
- Closed queue blocks new tokens
- User receives error message when trying to join closed queue
- Error message is user-friendly
- Reopening queue works correctly

**Success Criteria**:
- ✅ Queue status persists in database
- ✅ All clients see updated status
- ✅ Join functionality respects status
- ✅ User receives clear feedback

---

## TC-008: QR Code Generation & Scanning

**Objective**: Verify QR codes work for mobile access

**Preconditions**:
- Admin Panel is open
- Queue is loaded
- Mobile device or QR scanner available

**Test Steps**:
1. In Admin Panel, look for queue QR code
2. Display QR code on screen
3. Use mobile phone camera or QR scanner app
4. Scan the QR code
5. Verify it opens the queue page
6. Check that queue ID is correct

**Expected Results**:
- QR code displays clearly
- QR code links to correct queue URL
- Mobile page loads correctly
- Queue details match desktop version
- Can join queue from mobile

**Success Criteria**:
- ✅ QR code is scannable
- ✅ URL is correct
- ✅ Mobile view is responsive
- ✅ Functionality works identically

---

## TC-009: Performance - Concurrent Users

**Objective**: Verify system handles multiple concurrent users

**Preconditions**:
- UAT environment is properly sized
- Backend API is running
- Database and Redis are responsive

**Test Steps**:
1. Open 10 browser tabs/windows to queue page
2. Stagger "Join Queue" clicks (2-3 seconds apart)
3. Monitor Admin Panel for waiting count
4. Check API response times (Network tab)
5. Verify all users see correct data
6. Gradually increase load to 20+ concurrent users
7. Monitor system performance

**Expected Results**:
- All join requests succeed
- Waiting count is accurate
- API response time < 200ms
- WebSocket latency < 500ms
- No timeout errors
- Database handles load without issues

**Success Criteria**:
- ✅ System handles 50+ concurrent users on same queue
- ✅ No data corruption
- ✅ Response times remain acceptable
- ✅ No memory leaks or crashes

---

## TC-010: Error Handling - Network Interruption

**Objective**: Verify graceful handling of network issues

**Preconditions**:
- Queue operations are in progress
- Backend is running
- Frontend shows real-time updates

**Test Steps**:
1. Open Frontend with active queue
2. Note current state
3. Stop backend: `docker-compose -f docker-compose.uat.yml stop backend`
4. Try to interact with queue (join, etc.)
5. Note error messages and UI behavior
6. Restart backend: `docker-compose -f docker-compose.uat.yml start backend`
7. Verify automatic reconnection
8. Check data consistency

**Expected Results**:
- Frontend shows connection error gracefully
- User receives clear error message
- No console exceptions
- Auto-reconnect attempts after service restore
- Data is not lost or corrupted
- Operations resume after reconnection

**Success Criteria**:
- ✅ Error handling is graceful
- ✅ User experience is not degraded
- ✅ Automatic recovery works
- ✅ Data integrity maintained

---

## TC-011: Data Persistence - Restart

**Objective**: Verify data persists after service restart

**Preconditions**:
- Multiple users in queue
- Queue has served some tokens
- Historical data exists

**Test Steps**:
1. Note current queue state (waiting count, now serving, etc.)
2. Note specific token information
3. Restart all services: `docker-compose -f docker-compose.uat.yml restart`
4. Wait for services to recover (30-60 seconds)
5. Reload queue in Frontend and Admin Panel
6. Verify all data matches previous state

**Expected Results**:
- Queue data is identical after restart
- Token history is intact
- Waiting tokens still show
- Now serving field is preserved (or cleared appropriately)
- No data loss

**Success Criteria**:
- ✅ All data persists correctly
- ✅ Database integrity maintained
- ✅ No orphaned records
- ✅ Services recover cleanly

---

## TC-012: Mobile Responsiveness

**Objective**: Verify platform works on mobile devices

**Preconditions**:
- Mobile device (iOS or Android)
- UAT environment accessible from mobile
- Network connectivity

**Test Steps**:
1. Open queue page on mobile browser
2. Test join queue functionality
3. Verify token displays clearly
4. Check layout and readability
5. Test touch interactions (buttons, scrolling)
6. Verify camera access for QR scanning (if applicable)
7. Test in portrait and landscape modes

**Expected Results**:
- Layout is responsive
- Text is readable without zooming
- Buttons are easily tappable
- Forms are mobile-friendly
- No horizontal scrolling needed
- Functionality works identically to desktop
- Touch interactions are smooth

**Success Criteria**:
- ✅ Mobile UX is good
- ✅ No broken layouts
- ✅ All features work on mobile
- ✅ Performance is acceptable

---

## TC-013: API Validation - Invalid Input

**Objective**: Verify API validates input and rejects invalid requests

**Preconditions**:
- Backend API is running
- Postman or similar API testing tool available
- Test environment is set up

**Test Steps**:
1. Make API request with missing required fields
2. Make API request with invalid data types
3. Make API request with malformed JSON
4. Make API request with very long strings
5. Make API request with special characters
6. Check API response and error messages

**Expected Results**:
- API returns 400 Bad Request for invalid input
- Error messages are descriptive
- No unhandled exceptions
- No SQL injection possible
- Input is properly sanitized
- API logs the attempts

**Success Criteria**:
- ✅ Input validation works
- ✅ Security is maintained
- ✅ Error messages help debugging
- ✅ API is robust

---

## TC-014: Notification Service Integration

**Objective**: Verify notification service works with queue events

**Preconditions**:
- Notification service is running at http://localhost:5002
- Backend is configured to send notifications
- User has enabled notifications (if applicable)

**Test Steps**:
1. Enable push notifications in browser/app settings
2. Join a queue
3. Wait for token to be called
4. Admin calls your token
5. Check for notification
6. Monitor notification service logs

**Expected Results**:
- Notification is sent when token is called
- Notification appears on screen/device
- Notification contains relevant information
- No errors in service logs
- Multiple notifications don't overwhelm user

**Success Criteria**:
- ✅ Notifications are delivered
- ✅ Content is accurate
- ✅ Timing is appropriate
- ✅ Service reliability is high

---

## TC-015: Accessibility

**Objective**: Verify platform is accessible to all users

**Preconditions**:
- Frontend is running
- Browser DevTools available
- Accessibility testing tools available (Axe, WAVE, etc.)

**Test Steps**:
1. Run accessibility audit on Frontend
2. Test keyboard navigation
3. Test with screen reader
4. Check color contrast
5. Verify form labels are associated
6. Check for ARIA attributes
7. Test focus indicators

**Expected Results**:
- No critical accessibility issues
- Keyboard navigation works
- Screen reader reads content correctly
- Color contrast meets WCAG standards
- Focus is visible and logical
- Forms are fully accessible

**Success Criteria**:
- ✅ Accessibility audit passes
- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard accessible
- ✅ Screen reader compatible

---

## Test Results Summary

Use this template to record test results:

| Test Case | Date | Tester | Result | Notes |
|-----------|------|--------|--------|-------|
| TC-001 | | | PASS/FAIL | |
| TC-002 | | | PASS/FAIL | |
| TC-003 | | | PASS/FAIL | |
| ... | | | | |

---

## Sign-Off

After completing all test cases successfully:

**Testing Approved By**: _____________________  
**Date**: _____________________  
**Build Version**: _____________________  
**Ready for Production**: ☐ YES ☐ NO

---

**Last Updated**: 2026-01-30  
**Test Suite Version**: 1.0
