#!/bin/bash

# VPS Diagnostic Script for Cargo Capital
# Run this on your VPS to diagnose why the backend stopped working

echo "🔍 Cargo Capital Backend Diagnostic Tool"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Check if Node.js is running
echo "1️⃣  Checking if Node.js backend is running..."
NODE_PROCESSES=$(ps aux | grep -E "node.*server.js|PM2" | grep -v grep)
if [ -z "$NODE_PROCESSES" ]; then
  echo -e "${RED}❌ NO Node.js backend process found!${NC}"
  echo "   This is likely why you're getting 405 errors."
  echo "   Backend needs to be restarted."
else
  echo -e "${GREEN}✅ Node.js processes found:${NC}"
  echo "$NODE_PROCESSES"
fi

# 2. Check PM2 status
echo ""
echo "2️⃣  Checking PM2 status..."
if command -v pm2 &> /dev/null; then
  PM2_LIST=$(pm2 list 2>/dev/null)
  echo "$PM2_LIST"
  
  if echo "$PM2_LIST" | grep -q "cargo-backend"; then
    PM2_STATUS=$(echo "$PM2_LIST" | grep "cargo-backend" | awk '{print $10}')
    if echo "$PM2_STATUS" | grep -q "online"; then
      echo -e "${GREEN}✅ PM2 shows cargo-backend as online${NC}"
    else
      echo -e "${RED}❌ PM2 shows cargo-backend but NOT online${NC}"
      echo "   Status: $PM2_STATUS"
      echo "   Run: pm2 restart cargo-backend"
    fi
  else
    echo -e "${YELLOW}⚠️  PM2 installed but cargo-backend not found${NC}"
    echo "   Run: pm2 start server.js --name cargo-backend"
  fi
else
  echo -e "${YELLOW}⚠️  PM2 not installed${NC}"
fi

# 3. Check which ports are listening
echo ""
echo "3️⃣  Checking which ports are listening..."
echo "   Expected: Port 443, 80, or 5000"
LISTENING_PORTS=$(sudo netstat -tlnp 2>/dev/null | grep -E ":443|:80|:5000|:3000" | grep LISTEN)
if [ -z "$LISTENING_PORTS" ]; then
  echo -e "${RED}❌ NO backend ports (443, 80, 5000) are listening!${NC}"
  echo "   Backend is definitely not running."
else
  echo -e "${GREEN}✅ Listening ports found:${NC}"
  echo "$LISTENING_PORTS"
fi

# 4. Check if port 443/80 requires sudo
echo ""
echo "4️⃣  Checking port permissions..."
if [ "$EUID" -ne 0 ]; then
  echo -e "${YELLOW}⚠️  Not running as root${NC}"
  echo "   Ports 443/80 require root privileges"
  echo "   Your server might have crashed trying to bind to these ports"
  echo ""
  echo -e "${BLUE}💡 Solution: Use port 5000 instead (doesn't require root)${NC}"
fi

# 5. Test localhost connection
echo ""
echo "5️⃣  Testing localhost connections..."
echo "   Testing port 5000..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null | grep -q "200"; then
  echo -e "${GREEN}✅ Port 5000 responds (200 OK)${NC}"
else
  echo -e "${RED}❌ Port 5000 not responding${NC}"
fi

echo "   Testing port 443..."
if curl -s -k -o /dev/null -w "%{http_code}" https://localhost:443/api/health 2>/dev/null | grep -q "200"; then
  echo -e "${GREEN}✅ Port 443 responds (200 OK)${NC}"
else
  echo -e "${RED}❌ Port 443 not responding${NC}"
fi

# 6. Check Nginx
echo ""
echo "6️⃣  Checking Nginx..."
if command -v nginx &> /dev/null; then
  if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
    
    # Check if Nginx is configured to proxy to backend
    if [ -f "/etc/nginx/sites-enabled/cargocapital" ] || [ -f "/etc/nginx/sites-enabled/default" ]; then
      echo "   Nginx configuration exists"
      
      # Check if Nginx is proxying correctly
      NGINX_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health 2>/dev/null)
      if [ "$NGINX_TEST" = "200" ]; then
        echo -e "${GREEN}   ✅ Nginx proxy working (200 OK)${NC}"
      else
        echo -e "${YELLOW}   ⚠️  Nginx proxy returns: $NGINX_TEST${NC}"
        echo "   This means Nginx is working but backend is not responding"
      fi
    fi
  else
    echo -e "${YELLOW}⚠️  Nginx installed but not running${NC}"
    echo "   Run: sudo systemctl start nginx"
  fi
else
  echo -e "${YELLOW}⚠️  Nginx not installed${NC}"
fi

# 7. Check logs for errors
echo ""
echo "7️⃣  Checking recent errors in logs..."
if command -v pm2 &> /dev/null; then
  echo "   PM2 Logs (last 10 lines):"
  pm2 logs cargo-backend --lines 10 --nostream 2>/dev/null | tail -10
fi

if [ -f "logs/error.log" ]; then
  echo ""
  echo "   Error log (last 10 lines):"
  tail -10 logs/error.log
fi

# 8. Check environment file
echo ""
echo "8️⃣  Checking .env file..."
if [ -f ".env" ]; then
  echo -e "${GREEN}✅ .env file exists${NC}"
  
  # Check PORT setting
  if grep -q "^PORT=" .env; then
    PORT_VAL=$(grep "^PORT=" .env | cut -d'=' -f2)
    echo "   PORT is set to: $PORT_VAL"
    
    if [ "$PORT_VAL" = "443" ] || [ "$PORT_VAL" = "80" ]; then
      echo -e "${YELLOW}   ⚠️  PORT $PORT_VAL requires root privileges!${NC}"
      echo -e "${BLUE}   💡 Change to PORT=5000 in .env${NC}"
    fi
  else
    echo -e "${YELLOW}   ⚠️  PORT not set in .env${NC}"
  fi
  
  # Check MongoDB
  if grep -q "^MONGODB_URI=" .env; then
    echo -e "${GREEN}   ✓ MONGODB_URI is set${NC}"
  else
    echo -e "${YELLOW}   ⚠️  MONGODB_URI not set${NC}"
  fi
else
  echo -e "${RED}❌ .env file NOT found${NC}"
fi

# 9. Check SSL certificates
echo ""
echo "9️⃣  Checking SSL certificates..."
SSL_KEY="/etc/letsencrypt/live/cargocapital.com/privkey.pem"
SSL_CERT="/etc/letsencrypt/live/cargocapital.com/fullchain.pem"

if [ -f "$SSL_KEY" ] && [ -f "$SSL_CERT" ]; then
  echo -e "${GREEN}✅ SSL certificates found${NC}"
  
  # Check expiry
  CERT_EXPIRY=$(openssl x509 -enddate -noout -in "$SSL_CERT" 2>/dev/null | cut -d= -f2)
  echo "   Expires: $CERT_EXPIRY"
else
  echo -e "${YELLOW}⚠️  SSL certificates not found${NC}"
  echo "   Server might have failed to start if configured for HTTPS"
fi

# 10. Summary and recommendations
echo ""
echo "=========================================="
echo "📋 DIAGNOSTIC SUMMARY"
echo "=========================================="

# Determine the main issue
if [ -z "$NODE_PROCESSES" ]; then
  echo -e "${RED}🚨 MAIN ISSUE: Backend is NOT running${NC}"
  echo ""
  echo "Quick Fix:"
  echo "  cd /path/to/backend"
  echo "  pm2 start server.js --name cargo-backend"
  echo ""
elif ! echo "$LISTENING_PORTS" | grep -q ":5000\|:443\|:80"; then
  echo -e "${RED}🚨 MAIN ISSUE: Backend running but not listening on any port${NC}"
  echo ""
  echo "Possible causes:"
  echo "  1. Port permission denied (trying to use 443/80 without sudo)"
  echo "  2. Port already in use"
  echo "  3. Server crashed during startup"
  echo ""
  echo "Quick Fix:"
  echo "  1. Edit .env and set: PORT=5000"
  echo "  2. pm2 restart cargo-backend"
  echo ""
else
  echo -e "${YELLOW}⚠️  Backend appears to be running but not responding correctly${NC}"
  echo ""
  echo "Check:"
  echo "  1. PM2 logs: pm2 logs cargo-backend"
  echo "  2. Nginx configuration"
  echo "  3. Firewall settings"
fi

echo "=========================================="
echo ""
echo "Next steps to fix:"
echo "  1. cd /path/to/cargo-main/backend"
echo "  2. Edit .env: nano .env"
echo "     Set: PORT=5000"
echo "  3. pm2 restart cargo-backend"
echo "  4. Test: curl http://localhost:5000/api/health"
echo ""
echo "View full logs:"
echo "  pm2 logs cargo-backend --lines 50"
echo ""
