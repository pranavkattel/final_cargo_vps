# Fix for SPA Routing in Production Build

## Problem
After running `npm run build`, accessing routes like `/admin-unified` directly returns 404 because the server looks for a physical file instead of serving `index.html` for client-side routing.

## Solutions

### Option 1: Using Node.js `serve` Package (Recommended for Testing)

1. **Install serve globally:**
   ```bash
   npm install -g serve
   ```

2. **Serve the built files with SPA support:**
   ```bash
   cd dist
   serve -s . -l 3000
   ```
   
   The `-s` flag tells serve to rewrite all not-found requests to `index.html` (SPA mode).

3. **Access your app:**
   - Homepage: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin-unified`
   - All routes work now!

---

### Option 2: Using Vite Preview (Quick Test)

```bash
npm run build
npm run preview
```

Vite's preview server automatically handles SPA routing.

---

### Option 3: Using Nginx (Production VPS)

Create Nginx config: `/etc/nginx/sites-available/cargocapital`

```nginx
server {
    listen 80;
    server_name cargocapital.com www.cargocapital.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cargocapital.com www.cargocapital.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/cargocapital.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cargocapital.com/privkey.pem;

    # Frontend root directory
    root /var/www/cargocapital.com/dist;
    index index.html;

    # SPA Routing - Critical for React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to Backend
    location /api {
        proxy_pass https://localhost:443;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable and restart:**
```bash
sudo ln -s /etc/nginx/sites-available/cargocapital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 4: Apache `.htaccess` (If using Apache)

Create `.htaccess` in your `dist/` folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### Option 5: Express.js Server (Node.js)

Create `server.js` in your project root:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
```

**Run:**
```bash
node server.js
```

---

### Option 6: PM2 with serve (Production)

```bash
# Install serve and PM2
npm install -g serve pm2

# Start with PM2
pm2 serve dist 3000 --spa --name cargo-frontend

# Enable auto-restart
pm2 startup
pm2 save

# Monitor
pm2 logs cargo-frontend
pm2 monit
```

---

## Why This Happens

**Development (`npm run dev`):**
- Vite dev server automatically handles routing
- `/admin-unified` → serves `index.html` → React Router handles the route ✅

**Production (`npm run build`):**
- Static files in `dist/` folder
- Accessing `/admin-unified` directly → server looks for `dist/admin-unified/index.html` → 404 ❌
- Need server configuration to redirect all routes to `index.html`

---

## Quick Test After Building

```bash
# Build the project
npm run build

# Serve with SPA routing
npx serve -s dist -l 3000

# Open browser
# http://localhost:3000/admin-unified should work now ✅
```

---

## For Your VPS Deployment

**Recommended setup:**

1. **Backend on port 443 (HTTPS)**
   ```bash
   cd backend
   pm2 start server.js --name cargo-api
   ```

2. **Frontend with Nginx (as shown in Option 3)**
   - Nginx serves static files from `dist/`
   - Handles SPA routing with `try_files`
   - Proxies `/api` requests to backend

3. **Deploy process:**
   ```bash
   # On VPS
   cd /var/www/cargocapital.com
   git pull origin main
   npm install
   npm run build
   sudo systemctl reload nginx
   ```

---

## Verification

After setup, test these URLs (replace with your domain):

- ✅ `https://cargocapital.com/` - Homepage
- ✅ `https://cargocapital.com/admin-unified` - Admin Panel
- ✅ `https://cargocapital.com/tracking` - Tracking
- ✅ `https://cargocapital.com/api/health` - Backend API
- ✅ Refresh on any page - should not 404

---

## Current Issue & Fix

**Your current issue:** Direct access to `/admin-unified` after build returns 404.

**Quick fix for local testing:**
```bash
cd C:\Users\Pranav\Downloads\cargo-main-master\cargo-main-master\cargo-main
npm run build
npx serve -s dist -l 3000
```

Now open: `http://localhost:3000/admin-unified` ✅

**For production (VPS):** Use the Nginx config from Option 3.
