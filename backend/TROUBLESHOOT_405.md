# 🚨 TROUBLESHOOTING 405 ERROR (Method Not Allowed)

If your backend **was working before** and suddenly you're getting 405 errors, here are the most likely causes:

## 🔍 Common Causes When Backend Stops Working

### 1. ❌ Backend Process Crashed/Stopped (MOST COMMON)

**How to check:**
```bash
# SSH into VPS
ssh root@46.224.19.81

# Check if Node.js is running
ps aux | grep "node.*server.js"

# Check PM2
pm2 list
```

**If nothing running:**
```bash
cd /path/to/cargo-main/backend
pm2 start server.js --name cargo-backend
pm2 save
```

**Check logs to see why it crashed:**
```bash
pm2 logs cargo-backend --lines 100
```

---

### 2. ⚠️ Server Rebooted and Backend Didn't Auto-Start

**How to check:**
```bash
uptime  # Check if server recently restarted
pm2 list  # Check if PM2 is running
```

**Fix:**
```bash
cd /path/to/cargo-main/backend
pm2 resurrect  # Try to restore previous PM2 processes

# If that doesn't work:
pm2 start server.js --name cargo-backend

# Ensure auto-start on boot:
pm2 startup
pm2 save
```

---

### 3. 🔒 Port 443/80 Permission Denied

Your `server.js` tries to use port 443 by default, which **requires root privileges**.

**How to check:**
```bash
# Check logs for permission errors
pm2 logs cargo-backend | grep -i "permission\|eacces\|eaddrinuse"
```

**Fix - Change to port 5000:**
```bash
cd /path/to/cargo-main/backend
nano .env
```

Change or add:
```env
PORT=5000
```

Save and restart:
```bash
pm2 restart cargo-backend
```

Then update your Nginx config to proxy to port 5000 instead of 443.

---

### 4. 🔥 Port Already in Use

**How to check:**
```bash
sudo lsof -i :443
sudo lsof -i :80
sudo lsof -i :5000
```

**Fix:**
```bash
# Kill process using the port
sudo kill -9 $(lsof -t -i:5000)

# Then restart backend
pm2 restart cargo-backend
```

---

### 5. 📦 MongoDB Connection Failed

If MongoDB is down or connection string is wrong, the backend might crash.

**How to check:**
```bash
cd /path/to/cargo-main/backend
node test-mongodb.js
```

**Fix (temporary):**
```bash
# Use file storage instead
nano .env
```

Change:
```env
STORAGE_TYPE=file
```

Restart:
```bash
pm2 restart cargo-backend
```

---

### 6. 🌐 Nginx Misconfigured or Down

**How to check:**
```bash
sudo systemctl status nginx
sudo nginx -t  # Test config
```

**Fix:**
```bash
# Restart Nginx
sudo systemctl restart nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

---

### 7. 🔐 SSL Certificates Expired

**How to check:**
```bash
sudo certbot certificates
```

**Fix:**
```bash
# Renew certificates
sudo certbot renew

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🛠️ QUICK DIAGNOSTIC COMMAND

Run this single command to diagnose:

```bash
cd /path/to/cargo-main/backend && bash diagnose-vps.sh
```

Or manually:

```bash
echo "=== Checking Backend Status ===" && \
pm2 list && \
echo "" && \
echo "=== Checking Ports ===" && \
sudo netstat -tlnp | grep -E ":443|:80|:5000" && \
echo "" && \
echo "=== Testing API ===" && \
curl -v http://localhost:5000/api/health 2>&1 | head -20 && \
echo "" && \
echo "=== Recent Logs ===" && \
pm2 logs cargo-backend --lines 20 --nostream
```

---

## 🎯 MOST LIKELY FIX (Try this first)

```bash
# 1. SSH into VPS
ssh root@46.224.19.81

# 2. Navigate to backend
cd /var/www/cargo-main/backend  # Adjust path

# 3. Check status
pm2 list

# 4. If not running or shows error:
pm2 delete cargo-backend
pm2 start server.js --name cargo-backend

# 5. Check logs
pm2 logs cargo-backend

# 6. Test API
curl http://localhost:5000/api/health

# 7. If works locally but not from outside, check Nginx:
sudo systemctl status nginx
sudo systemctl restart nginx
```

---

## 📊 WHAT THE 405 ERROR MEANS

**405 Method Not Allowed** typically means:
1. ✅ The route `/api/contact` exists (not a 404)
2. ❌ But the **POST method is not allowed** on that route

This happens when:
- **Backend is not running** → Nginx or another service responds with 405
- **Wrong HTTP method** → Trying GET instead of POST (unlikely in your case)
- **Proxy misconfiguration** → Nginx blocking POST requests
- **CORS preflight failing** → Browser sends OPTIONS, server rejects

Since it **worked before**, the most likely cause is **backend not running**.

---

## 🔍 VERIFY YOUR FIX WORKED

After fixing, test these:

```bash
# 1. Backend responds locally
curl http://localhost:5000/api/health
# Should return: {"success":true,...}

# 2. Contact endpoint accepts POST
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
# Should return: {"success":true,...} or {"success":false,...}

# 3. Accessible from outside
curl http://46.224.19.81:5000/api/health
# Or if using Nginx:
curl http://cargocapital.com/api/health
```

All should return JSON, not HTML or 405 errors.

---

## 📞 STILL NOT WORKING?

If none of the above worked, provide these details:

```bash
# Run and share output:
echo "=== PM2 Status ===" && pm2 list && \
echo "" && echo "=== PM2 Logs ===" && pm2 logs cargo-backend --lines 30 --nostream && \
echo "" && echo "=== Listening Ports ===" && sudo netstat -tlnp | grep node && \
echo "" && echo "=== Nginx Status ===" && sudo systemctl status nginx && \
echo "" && echo "=== Test API ===" && curl -v http://localhost:5000/api/health
```

This will help identify the exact issue.
