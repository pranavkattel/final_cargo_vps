# API URL Configuration Summary

## Problem
Frontend JavaScript was making HTTP requests to hardcoded URLs like `http://46.224.19.81:5000`, causing mixed content errors when the site runs on HTTPS.

## Solution
Configured all API calls to use environment variables that adapt to the deployment environment.

---

## Files Updated

### 1. `.env.production` (Production Frontend Config)
**Changed:**
```bash
# Before
VITE_API_URL=http://46.224.19.81:5000/api

# After
VITE_API_URL=https://cargocapital.com/api
```

**Purpose:** When you build the frontend for production (`npm run build`), it will use HTTPS.

---

### 2. `.env` (Development Frontend Config)
**Created:**
```bash
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

**Purpose:** For local development, the frontend will use `http://localhost:5000/api`.

---

### 3. `src/pages/Contact.tsx`
**Changed:**
```typescript
// Before
const response = await fetch('http://localhost:5000/api/contact', {

// After
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${API_URL}/contact`, {
```

---

### 4. `src/pages/Quote.tsx`
**Changed:**
```typescript
// Before
const response = await fetch('http://localhost:5000/api/quote', {

// After
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${API_URL}/quote`, {
```

---

### 5. `src/pages/AdminTest.tsx`
**Changed:**
```typescript
// Before
const response = await fetch('http://localhost:5000/api/shipments');

// After
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${API_URL}/shipments`);
```

---

## How It Works

### Development Mode (npm run dev)
- Uses `.env` file
- API calls go to: `http://localhost:5000/api`
- Perfect for local testing

### Production Build (npm run build)
- Uses `.env.production` file
- API calls go to: `https://cargocapital.com/api`
- Secure HTTPS connection
- No mixed content warnings

### Fallback
All API calls have a fallback to `http://localhost:5000/api` if the environment variable is not set.

---

## Already Configured Files

These files already use the environment variable correctly:

✅ `src/services/trackingService.ts` - Main API service
✅ `src/pages/TestAPI.tsx` - Uses `import.meta.env.VITE_API_URL`

---

## Deployment Steps

### On Your VPS:

1. **Build the frontend with production config:**
   ```bash
   cd /path/to/cargo-main
   npm run build
   ```
   This creates an optimized production build in the `dist/` folder with HTTPS API URLs baked in.

2. **Serve the built files:**
   
   **Option A: Using a simple HTTP server**
   ```bash
   npm install -g serve
   serve -s dist -l 3000
   ```

   **Option B: Using Nginx (recommended for production)**
   
   Install Nginx:
   ```bash
   sudo apt install nginx
   ```

   Create Nginx config `/etc/nginx/sites-available/cargocapital`:
   ```nginx
   server {
       listen 80;
       server_name cargocapital.com www.cargocapital.com;
       
       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name cargocapital.com www.cargocapital.com;

       # SSL Configuration
       ssl_certificate /etc/letsencrypt/live/cargocapital.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/cargocapital.com/privkey.pem;
       
       # SSL Security
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       # Root directory - your built frontend
       root /path/to/cargo-main/dist;
       index index.html;

       # Frontend routing (SPA)
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to Node.js backend
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

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
   }
   ```

   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/cargocapital /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. **Start the backend:**
   ```bash
   cd /path/to/cargo-main/backend
   pm2 start server.js --name cargo-api
   ```

---

## Verification

### Check Frontend Build:
```bash
# Look at the built JavaScript files
cat dist/assets/index-*.js | grep VITE_API_URL

# Should show: https://cargocapital.com/api
```

### Test API Calls:
```bash
# Backend health check
curl https://cargocapital.com/api/health

# Should return:
# {"success":true,"message":"Capital Cargo API is running",...}
```

### Browser Console:
Open browser DevTools → Console, you should see:
```
🌐 API Configuration:
Environment mode: production
Is production: true
VITE_API_URL: https://cargocapital.com/api
Final API_BASE_URL: https://cargocapital.com/api
```

### Network Tab:
All API requests should go to `https://cargocapital.com/api/*` (no HTTP, no IP addresses).

---

## Troubleshooting

### Still seeing HTTP requests?
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Rebuild frontend:**
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

### Mixed content errors?
- Ensure `.env.production` has `VITE_API_URL=https://cargocapital.com/api`
- Rebuild the frontend
- Check browser console for the API URL being used

### CORS errors?
Update `backend/.env`:
```env
CORS_ORIGIN=https://cargocapital.com
CORS_ORIGINS=https://cargocapital.com,http://cargocapital.com
```
Restart backend: `pm2 restart cargo-api`

---

## Environment Variable Reference

| File | Purpose | API URL |
|------|---------|---------|
| `.env` | Local dev (frontend) | `http://localhost:5000/api` |
| `.env.production` | Production build (frontend) | `https://cargocapital.com/api` |
| `backend/.env` | Backend server | N/A (backend doesn't call itself) |

---

## Commands Quick Reference

```bash
# LOCAL DEVELOPMENT
npm run dev                    # Start dev server (uses .env)
npm run dev -- --host          # Expose to network

# PRODUCTION BUILD
npm run build                  # Build for production (uses .env.production)
npm run preview                # Preview production build locally

# DEPLOY TO VPS
scp -r dist/* user@vps:/var/www/cargocapital.com/
# Or use git pull on VPS and build there

# BACKEND (on VPS)
cd backend
pm2 start server.js --name cargo-api
pm2 logs cargo-api
pm2 restart cargo-api
```

---

## Summary

✅ **All hardcoded API URLs removed**
✅ **Environment-based configuration in place**
✅ **Development uses HTTP localhost**
✅ **Production uses HTTPS cargocapital.com**
✅ **No more mixed content warnings**
✅ **Secure end-to-end HTTPS communication**

The frontend now automatically adapts to the environment it's built for!
