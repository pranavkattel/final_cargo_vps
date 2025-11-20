# 🚀 VPS Deployment Guide - Cargo Capital

## Quick Fix for Your Current Issue

Your backend is not responding because of one or more of these issues:
1. **Backend server not running**
2. **Port configuration issues**
3. **CORS misconfiguration**
4. **Missing environment variables**

---

## 🔧 IMMEDIATE FIX - Run These Commands on Your VPS

### Step 1: SSH into your VPS
```bash
ssh root@46.224.19.81
# Or: ssh your-username@46.224.19.81
```

### Step 2: Navigate to your project
```bash
cd /path/to/cargo-main/backend
# Example: cd /var/www/cargo-main/backend
```

### Step 3: Create/Update .env file
```bash
nano .env
```

Add these configurations:
```env
NODE_ENV=production
PORT=5000

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# CORS - IMPORTANT: Add your actual domain
CORS_ORIGIN=http://46.224.19.81
CORS_ORIGINS=http://cargocapital.com,https://cargocapital.com,http://www.cargocapital.com,https://www.cargocapital.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# JWT Secret
JWT_SECRET=your-secure-random-string-here

# Email (Optional - for contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@cargocapital.com

# Storage
STORAGE_TYPE=mongodb
DB_NAME=cargo-capital
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Install dependencies
```bash
npm install
```

### Step 5: Test MongoDB connection
```bash
node test-mongodb.js
```

If MongoDB fails, you can use file storage temporarily:
```bash
# Edit .env and change:
# STORAGE_TYPE=file
nano .env
```

### Step 6: Kill any existing Node processes
```bash
# Find and kill Node processes on port 5000
sudo lsof -ti:5000 | xargs sudo kill -9
# Or kill all Node processes
pkill -9 node
```

### Step 7: Start the backend server

**Option A: Using PM2 (Recommended)**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the backend
pm2 start server.js --name cargo-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup

# View logs
pm2 logs cargo-backend
```

**Option B: Using screen (Alternative)**
```bash
# Install screen
sudo apt-get install screen

# Create a new screen session
screen -S cargo-backend

# Start the server
npm start

# Detach from screen: Ctrl+A, then D
# Reattach later: screen -r cargo-backend
```

**Option C: Direct (Testing only)**
```bash
npm start
```

### Step 8: Test the API
```bash
# Test from VPS
curl http://localhost:5000/api/health

# Test from outside
curl http://46.224.19.81:5000/api/health
```

### Step 9: Configure firewall
```bash
# Allow port 5000
sudo ufw allow 5000/tcp

# Allow port 80 (HTTP)
sudo ufw allow 80/tcp

# Allow port 443 (HTTPS)
sudo ufw allow 443/tcp

# Check firewall status
sudo ufw status
```

---

## 🌐 NGINX REVERSE PROXY SETUP (Recommended)

Instead of exposing port 5000, use Nginx as a reverse proxy:

### Step 1: Install Nginx
```bash
sudo apt-get update
sudo apt-get install nginx
```

### Step 2: Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/cargocapital
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name cargocapital.com www.cargocapital.com 46.224.19.81;

    # Frontend (if serving from same VPS)
    root /var/www/cargo-main/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

### Step 3: Enable the site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/cargocapital /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

### Step 4: Update CORS in backend .env
```env
# Since Nginx will proxy, allow your domain
CORS_ORIGIN=http://cargocapital.com
CORS_ORIGINS=https://cargocapital.com,http://www.cargocapital.com,https://www.cargocapital.com,http://46.224.19.81
```

### Step 5: Restart backend
```bash
pm2 restart cargo-backend
```

---

## 🔒 SSL/HTTPS SETUP (Optional but Recommended)

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d cargocapital.com -d www.cargocapital.com

# Certbot will automatically:
# 1. Get SSL certificate
# 2. Update Nginx configuration
# 3. Set up auto-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL is set up, update your frontend to use HTTPS:
```env
VITE_API_URL=https://cargocapital.com/api
```

---

## 🧪 TESTING YOUR DEPLOYMENT

### Test Backend Directly
```bash
# From VPS
curl http://localhost:5000/api/health

# From outside (replace with your IP/domain)
curl http://46.224.19.81:5000/api/health
curl http://cargocapital.com/api/health
```

### Test Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### Check PM2 Status
```bash
pm2 list
pm2 logs cargo-backend
pm2 monit
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: Port 5000 already in use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>

# Or kill all node processes
pkill -9 node
```

### Issue 2: Cannot connect to MongoDB
```bash
# Check MongoDB connection
node test-mongodb.js

# If fails, use file storage temporarily
# Edit .env: STORAGE_TYPE=file
nano .env
```

### Issue 3: CORS errors in browser
```bash
# Edit backend .env and add your frontend domain
nano backend/.env

# Add: CORS_ORIGIN=http://your-frontend-domain.com

# Restart backend
pm2 restart cargo-backend
```

### Issue 4: 502 Bad Gateway (Nginx)
```bash
# Check if backend is running
pm2 list

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check backend logs
pm2 logs cargo-backend

# Restart both
pm2 restart cargo-backend
sudo systemctl restart nginx
```

### Issue 5: Frontend not loading
```bash
# If serving frontend from VPS
# Build frontend
cd /path/to/cargo-main
npm run build

# Copy to Nginx directory
sudo cp -r dist/* /var/www/cargo-main/dist/

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 MONITORING & MAINTENANCE

### View PM2 logs
```bash
pm2 logs cargo-backend          # All logs
pm2 logs cargo-backend --lines 100  # Last 100 lines
pm2 logs cargo-backend --err    # Only errors
```

### Monitor server resources
```bash
pm2 monit                       # PM2 monitor
htop                           # System monitor
```

### Restart services
```bash
pm2 restart cargo-backend      # Restart backend
sudo systemctl restart nginx   # Restart Nginx
```

### Update code
```bash
# Pull latest changes
git pull origin main

# Install dependencies
cd backend && npm install

# Rebuild frontend (if needed)
cd .. && npm run build

# Restart services
pm2 restart cargo-backend
sudo systemctl restart nginx
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Backend .env file configured with production values
- [ ] MongoDB connection tested (or file storage configured)
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running with PM2
- [ ] PM2 saved and configured for auto-start
- [ ] Firewall rules configured (ports 80, 443, 5000)
- [ ] Nginx installed and configured
- [ ] Nginx configuration tested (`sudo nginx -t`)
- [ ] SSL certificate installed (optional)
- [ ] CORS origins configured correctly
- [ ] API endpoints tested and responding
- [ ] Frontend deployed and accessible
- [ ] Contact form tested
- [ ] Logs monitoring set up

---

## 🆘 QUICK COMMANDS REFERENCE

```bash
# Backend Management
pm2 start server.js --name cargo-backend
pm2 restart cargo-backend
pm2 stop cargo-backend
pm2 delete cargo-backend
pm2 logs cargo-backend
pm2 monit

# Nginx Management
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl status nginx
sudo nginx -t

# Firewall Management
sudo ufw allow 5000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status

# Port Management
sudo lsof -i :5000
sudo kill -9 <PID>
pkill -9 node

# Logs
pm2 logs cargo-backend
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 📞 SUPPORT

If you continue to have issues:

1. Check PM2 logs: `pm2 logs cargo-backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Test API locally: `curl http://localhost:5000/api/health`
4. Verify environment variables: `cat backend/.env`
5. Check firewall: `sudo ufw status`

Common environment variables to verify:
- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI=<your-connection-string>`
- `CORS_ORIGIN=<your-frontend-url>`
