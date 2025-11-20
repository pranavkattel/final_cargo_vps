# ⚡ QUICK VPS FIX - Run These Commands

Your backend is getting 405 errors because it's likely not running properly on your VPS. Follow these steps:

## 🚨 IMMEDIATE FIX (5 Minutes)

### 1. SSH into your VPS
```bash
ssh root@46.224.19.81
```

### 2. Navigate to backend folder
```bash
cd /path/to/cargo-main/backend
# Example: cd /var/www/cargo-main/backend
# Or: cd /home/username/cargo-main/backend
```

### 3. Check if backend is running
```bash
curl http://localhost:5000/api/health
```

If you get an error, the backend is NOT running. Continue:

### 4. Kill any existing Node processes
```bash
pkill -9 node
```

### 5. Create/Update .env file
```bash
nano .env
```

Paste this (update MONGODB_URI and domains):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://46.224.19.81
CORS_ORIGINS=http://cargocapital.com,https://cargocapital.com
STORAGE_TYPE=mongodb
```

Save: `Ctrl+X`, `Y`, `Enter`

### 6. Install dependencies
```bash
npm install
```

### 7. Start backend with PM2 (Recommended)
```bash
# Install PM2 if not installed
sudo npm install -g pm2

# Start backend
pm2 start server.js --name cargo-backend

# View logs
pm2 logs cargo-backend
```

### 8. Test again
```bash
curl http://localhost:5000/api/health
```

You should see: `{"success":true,"message":"Capital Cargo API is running"...}`

### 9. Test contact endpoint
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

### 10. Open firewall port
```bash
sudo ufw allow 5000/tcp
```

---

## 🌐 NGINX SETUP (5 Minutes)

If you want to use port 80 instead of 5000:

### 1. Install Nginx
```bash
sudo apt-get update
sudo apt-get install nginx -y
```

### 2. Create Nginx config
```bash
sudo nano /etc/nginx/sites-available/cargocapital
```

Paste this:
```nginx
server {
    listen 80;
    server_name 46.224.19.81 cargocapital.com www.cargocapital.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. Enable site
```bash
sudo ln -s /etc/nginx/sites-available/cargocapital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Update frontend API URL
Now your API is at: `http://46.224.19.81/api` (no port needed)

Update your frontend:
```env
VITE_API_URL=http://46.224.19.81/api
# Or: VITE_API_URL=http://cargocapital.com/api
```

Rebuild frontend:
```bash
npm run build
```

---

## 🧪 TESTING

### Test backend directly
```bash
# From VPS
curl http://localhost:5000/api/health

# From outside (with port)
curl http://46.224.19.81:5000/api/health

# Through Nginx (no port)
curl http://46.224.19.81/api/health
```

### Test contact form
```bash
curl -X POST http://46.224.19.81:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "subject": "Test",
    "message": "This is a test message"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will get back to you soon."
}
```

---

## 🐛 STILL NOT WORKING?

### Check PM2 status
```bash
pm2 list
pm2 logs cargo-backend
```

### Check if port is listening
```bash
sudo lsof -i :5000
```

Should show Node.js listening on port 5000

### Check firewall
```bash
sudo ufw status
```

Should show port 5000 allowed

### View backend logs
```bash
# If using PM2
pm2 logs cargo-backend --lines 50

# If using Node directly
cat backend.log
```

### Common errors:

**"Cannot find module"**
```bash
cd backend
npm install
pm2 restart cargo-backend
```

**"EADDRINUSE" (port already in use)**
```bash
sudo lsof -ti:5000 | xargs sudo kill -9
pm2 restart cargo-backend
```

**"MongoDB connection failed"**
```bash
# Edit .env
nano .env

# Change: STORAGE_TYPE=file
# Then restart
pm2 restart cargo-backend
```

**"CORS error in browser"**
```bash
# Edit .env and add your frontend domain
nano .env

# Add your domain to CORS_ORIGINS
# Example: CORS_ORIGINS=http://yourdomain.com,https://yourdomain.com

pm2 restart cargo-backend
```

---

## 📞 VERIFY YOUR SETUP

Run these commands to verify everything:

```bash
# 1. Backend running?
pm2 list | grep cargo-backend

# 2. Port listening?
sudo lsof -i :5000

# 3. Health check working?
curl http://localhost:5000/api/health

# 4. Contact endpoint working?
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'

# 5. Firewall open?
sudo ufw status | grep 5000

# 6. Environment variables set?
cat .env | grep -E "PORT|CORS|MONGODB"
```

All should show green/success responses.

---

## ✅ FINAL CHECKLIST

- [ ] Backend running with PM2
- [ ] Health endpoint responds with 200
- [ ] Contact endpoint responds (200 or 500 is OK for now)
- [ ] Port 5000 is open in firewall
- [ ] .env file has correct CORS_ORIGIN
- [ ] Frontend API_URL points to correct backend URL
- [ ] Can access: http://46.224.19.81:5000/api/health from browser

Once all checked, your contact form should work!

---

## 🆘 QUICK COMMAND REFERENCE

```bash
# Start backend
pm2 start server.js --name cargo-backend

# Restart backend
pm2 restart cargo-backend

# View logs
pm2 logs cargo-backend

# Stop backend
pm2 stop cargo-backend

# Delete backend
pm2 delete cargo-backend

# Save PM2 config
pm2 save

# Auto-start on boot
pm2 startup
```
