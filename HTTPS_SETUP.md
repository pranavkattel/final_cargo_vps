# HTTPS Setup Guide for cargocapital.com

## Overview
The backend server is now configured to run on HTTPS (port 443) using Let's Encrypt SSL certificates, with automatic HTTP to HTTPS redirection.

## Prerequisites on VPS

### 1. Install Certbot (Let's Encrypt)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot

# CentOS/RHEL
sudo yum install certbot
```

### 2. Stop any service using port 80 and 443
```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443

# Stop services if needed (example: nginx)
sudo systemctl stop nginx
```

### 3. Obtain SSL Certificate
```bash
# For domain: cargocapital.com (and www subdomain if needed)
sudo certbot certonly --standalone -d cargocapital.com -d www.cargocapital.com

# Or for single domain only
sudo certbot certonly --standalone -d cargocapital.com
```

Follow the prompts:
- Enter your email address
- Agree to terms of service
- Choose whether to share email with EFF

Certificates will be saved to:
- Private Key: `/etc/letsencrypt/live/cargocapital.com/privkey.pem`
- Full Chain: `/etc/letsencrypt/live/cargocapital.com/fullchain.pem`

### 4. Verify Certificate Files
```bash
sudo ls -l /etc/letsencrypt/live/cargocapital.com/
```

You should see:
- `privkey.pem` (private key)
- `fullchain.pem` (certificate + chain)
- `cert.pem` (certificate only)
- `chain.pem` (chain only)

## Starting the Server

### Development/Local Testing (without SSL)
If SSL certificates are not found, the server will automatically fall back to HTTP mode.

```bash
cd backend
node server.js
```

### Production (with SSL on VPS)
The Node.js process needs permission to read the certificate files and bind to port 443:

**Option 1: Run with sudo (Quick, less secure)**
```bash
cd backend
sudo node server.js
```

**Option 2: Use setcap to grant port binding (Recommended)**
```bash
# Grant Node.js permission to bind to privileged ports (80, 443)
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# Now you can run without sudo
cd backend
node server.js
```

**Option 3: Grant read permissions to certificate files**
```bash
# Create a group for certificate access
sudo groupadd certusers
sudo usermod -a -G certusers $USER

# Set group ownership and permissions
sudo chgrp -R certusers /etc/letsencrypt/live/
sudo chgrp -R certusers /etc/letsencrypt/archive/
sudo chmod -R g+rx /etc/letsencrypt/live/
sudo chmod -R g+rx /etc/letsencrypt/archive/

# Use setcap for ports
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# Now run normally
cd backend
node server.js
```

### Using PM2 (Production Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
cd backend
pm2 start server.js --name cargo-api

# Or with sudo if needed
sudo pm2 start server.js --name cargo-api

# Enable auto-restart on system reboot
pm2 startup
pm2 save

# View logs
pm2 logs cargo-api

# Monitor
pm2 monit
```

## Server Behavior

### With SSL Certificates Present:
- **HTTPS Server** runs on port **443** (0.0.0.0)
- **HTTP Redirect Server** runs on port **80** (redirects all traffic to HTTPS)
- Accessible at: `https://cargocapital.com`

### Without SSL Certificates:
- **HTTP Server** runs on configured port (default 443, but uses HTTP)
- Shows warning message about missing certificates
- Falls back to insecure HTTP mode

## Environment Variables

The following are set in `backend/.env`:

```env
# Server ports
PORT=443
HTTP_PORT=80
NODE_ENV=production

# SSL Certificate paths
SSL_KEY_PATH=/etc/letsencrypt/live/cargocapital.com/privkey.pem
SSL_CERT_PATH=/etc/letsencrypt/live/cargocapital.com/fullchain.pem

# CORS
CORS_ORIGIN=https://cargocapital.com
CORS_ORIGINS=https://cargocapital.com,http://cargocapital.com
```

## Certificate Renewal

Let's Encrypt certificates expire every 90 days. Set up automatic renewal:

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Set up auto-renewal with cron
sudo crontab -e

# Add this line to renew twice daily
0 0,12 * * * certbot renew --quiet --post-hook "pm2 restart cargo-api"
```

Or use systemd timer (if available):
```bash
# Check renewal timer
sudo systemctl status certbot.timer

# Enable it
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Firewall Configuration

Make sure ports 80 and 443 are open:

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# iptables (manual)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables-save
```

## DNS Configuration

Ensure your domain points to the VPS:

```bash
# Check DNS
nslookup cargocapital.com
dig cargocapital.com

# Your VPS IP should be returned
```

DNS records needed (at your domain registrar):
- **A Record**: `cargocapital.com` → `46.224.19.81` (your VPS IP)
- **A Record** (optional): `www.cargocapital.com` → `46.224.19.81`

## Troubleshooting

### Server won't start - Port already in use
```bash
# Find process using port 443
sudo lsof -i :443
sudo netstat -tulpn | grep :443

# Kill the process or stop the service
sudo kill -9 <PID>
```

### Permission denied error
```bash
# Run with sudo or use setcap as shown above
sudo node server.js

# Or grant capabilities
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

### Certificate not found
```bash
# Verify certificate paths
sudo ls -l /etc/letsencrypt/live/cargocapital.com/

# Re-run certbot if missing
sudo certbot certonly --standalone -d cargocapital.com
```

### CORS errors in browser
Update `backend/.env` CORS settings:
```env
CORS_ORIGIN=https://cargocapital.com
CORS_ORIGINS=https://cargocapital.com,http://cargocapital.com,https://www.cargocapital.com
```

Then restart the server.

### Check if HTTPS is working
```bash
# Test HTTPS endpoint
curl -k https://localhost:443/api/health
curl https://cargocapital.com/api/health

# Check certificate
openssl s_client -connect cargocapital.com:443 -servername cargocapital.com
```

## Security Best Practices

1. **Keep certificates updated** - Set up auto-renewal
2. **Use PM2 or systemd** - Don't run node directly in production
3. **Enable firewall** - Only allow necessary ports
4. **Regular updates** - Keep Node.js and packages updated
5. **Monitor logs** - Use `pm2 logs` or centralized logging
6. **Use environment variables** - Never commit secrets to git
7. **Restrict certificate access** - Use proper file permissions

## Quick Start Checklist

- [ ] Domain DNS points to VPS IP
- [ ] Certbot installed
- [ ] SSL certificates obtained (`sudo certbot certonly --standalone -d cargocapital.com`)
- [ ] Certificate files verified
- [ ] Ports 80 and 443 open in firewall
- [ ] Node.js has permission to bind to ports (`setcap`)
- [ ] `.env` file configured with correct paths
- [ ] PM2 installed and configured
- [ ] Server started (`pm2 start server.js --name cargo-api`)
- [ ] HTTPS working (`curl https://cargocapital.com/api/health`)
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal configured

## Support

If you encounter issues:
1. Check server logs: `pm2 logs cargo-api` or `sudo journalctl -u cargo-api -f`
2. Verify certificate paths in `.env`
3. Ensure ports are open and not blocked
4. Check DNS resolution
5. Review CORS settings for your frontend domain
