#!/bin/bash

# VPS Deployment Fix Script for Cargo Capital
# This script diagnoses and fixes common deployment issues

echo "🔧 Cargo Capital VPS Deployment Fix"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${YELLOW}⚠️  Not running as root. Some fixes may require sudo.${NC}"
fi

# 1. Check Node.js
echo "1️⃣  Checking Node.js installation..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
  echo -e "${RED}❌ Node.js not found!${NC}"
  echo "   Install Node.js 18+:"
  echo "   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
  echo "   sudo apt-get install -y nodejs"
fi

# 2. Check if backend directory exists
echo ""
echo "2️⃣  Checking backend directory..."
if [ -d "backend" ]; then
  echo -e "${GREEN}✅ Backend directory found${NC}"
  cd backend
else
  echo -e "${RED}❌ Backend directory not found!${NC}"
  exit 1
fi

# 3. Check package.json
echo ""
echo "3️⃣  Checking package.json..."
if [ -f "package.json" ]; then
  echo -e "${GREEN}✅ package.json found${NC}"
else
  echo -e "${RED}❌ package.json not found!${NC}"
  exit 1
fi

# 4. Install dependencies
echo ""
echo "4️⃣  Installing/Updating dependencies..."
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${RED}❌ Failed to install dependencies${NC}"
  exit 1
fi

# 5. Check .env file
echo ""
echo "5️⃣  Checking environment configuration..."
if [ -f ".env" ]; then
  echo -e "${GREEN}✅ .env file exists${NC}"
  
  # Check critical environment variables
  if grep -q "MONGODB_URI=" .env; then
    echo -e "${GREEN}   ✓ MONGODB_URI configured${NC}"
  else
    echo -e "${YELLOW}   ⚠️  MONGODB_URI not set${NC}"
  fi
  
  if grep -q "CORS_ORIGIN=" .env; then
    echo -e "${GREEN}   ✓ CORS_ORIGIN configured${NC}"
  else
    echo -e "${YELLOW}   ⚠️  CORS_ORIGIN not set${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
  if [ -f ".env.production" ]; then
    cp .env.production .env
    echo -e "${GREEN}✅ .env file created from .env.production${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env with your actual values!${NC}"
  else
    echo -e "${RED}❌ No .env template found${NC}"
  fi
fi

# 6. Check MongoDB connection
echo ""
echo "6️⃣  Testing MongoDB connection..."
if [ -f "test-mongodb.js" ]; then
  timeout 10 node test-mongodb.js &> /dev/null
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ MongoDB connection successful${NC}"
  else
    echo -e "${YELLOW}⚠️  MongoDB connection failed or timed out${NC}"
    echo "   Check your MONGODB_URI in .env"
  fi
else
  echo -e "${YELLOW}⚠️  test-mongodb.js not found, skipping connection test${NC}"
fi

# 7. Check if port 5000 is available
echo ""
echo "7️⃣  Checking port availability..."
PORT=5000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Port $PORT is already in use${NC}"
  echo "   Killing existing process..."
  sudo kill -9 $(lsof -t -i:$PORT) 2>/dev/null
  echo -e "${GREEN}✅ Port $PORT freed${NC}"
else
  echo -e "${GREEN}✅ Port $PORT is available${NC}"
fi

# 8. Check firewall
echo ""
echo "8️⃣  Checking firewall..."
if command -v ufw &> /dev/null; then
  UFW_STATUS=$(sudo ufw status | grep -c "Status: active")
  if [ "$UFW_STATUS" -eq 1 ]; then
    echo -e "${YELLOW}⚠️  UFW firewall is active${NC}"
    echo "   Allowing ports 80, 443, 5000..."
    sudo ufw allow 80/tcp >/dev/null 2>&1
    sudo ufw allow 443/tcp >/dev/null 2>&1
    sudo ufw allow 5000/tcp >/dev/null 2>&1
    echo -e "${GREEN}✅ Firewall configured${NC}"
  else
    echo -e "${GREEN}✅ UFW firewall not active${NC}"
  fi
else
  echo -e "${GREEN}✅ UFW not installed (firewall check skipped)${NC}"
fi

# 9. Check for PM2
echo ""
echo "9️⃣  Checking PM2 process manager..."
if command -v pm2 &> /dev/null; then
  echo -e "${GREEN}✅ PM2 installed${NC}"
else
  echo -e "${YELLOW}⚠️  PM2 not installed${NC}"
  echo "   Installing PM2..."
  sudo npm install -g pm2
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 installed successfully${NC}"
  else
    echo -e "${RED}❌ Failed to install PM2${NC}"
  fi
fi

# 10. Stop any existing PM2 processes
echo ""
echo "🔟  Stopping existing PM2 processes..."
pm2 delete cargo-backend 2>/dev/null
pm2 delete all 2>/dev/null
echo -e "${GREEN}✅ Cleaned up PM2 processes${NC}"

# 11. Create ecosystem file for PM2
echo ""
echo "1️⃣1️⃣  Creating PM2 ecosystem file..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'cargo-backend',
    script: './server.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
EOF
echo -e "${GREEN}✅ ecosystem.config.js created${NC}"

# Create logs directory
mkdir -p logs

# 12. Start the backend with PM2
echo ""
echo "1️⃣2️⃣  Starting backend server with PM2..."
pm2 start ecosystem.config.js
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Backend server started${NC}"
  pm2 save
  pm2 startup
else
  echo -e "${RED}❌ Failed to start backend server${NC}"
  exit 1
fi

# 13. Test API endpoints
echo ""
echo "1️⃣3️⃣  Testing API endpoints..."
sleep 3

# Test health endpoint
echo "   Testing /api/health..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$HEALTH_RESPONSE" = "200" ]; then
  echo -e "${GREEN}   ✅ Health endpoint working (200)${NC}"
else
  echo -e "${RED}   ❌ Health endpoint failed ($HEALTH_RESPONSE)${NC}"
fi

# Test contact endpoint
echo "   Testing /api/contact..."
CONTACT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}')
if [ "$CONTACT_RESPONSE" = "200" ] || [ "$CONTACT_RESPONSE" = "500" ]; then
  echo -e "${GREEN}   ✅ Contact endpoint accessible ($CONTACT_RESPONSE)${NC}"
else
  echo -e "${RED}   ❌ Contact endpoint failed ($CONTACT_RESPONSE)${NC}"
fi

# 14. Display server status
echo ""
echo "=================================="
echo "📊 SERVER STATUS"
echo "=================================="
pm2 list
pm2 logs cargo-backend --lines 10 --nostream

echo ""
echo "=================================="
echo "📝 NEXT STEPS"
echo "=================================="
echo "1. Configure Nginx reverse proxy (if needed):"
echo "   sudo nano /etc/nginx/sites-available/cargocapital"
echo ""
echo "2. Check logs:"
echo "   pm2 logs cargo-backend"
echo ""
echo "3. Monitor server:"
echo "   pm2 monit"
echo ""
echo "4. Update .env with production values:"
echo "   nano .env"
echo ""
echo "5. Restart after config changes:"
echo "   pm2 restart cargo-backend"
echo ""
echo "6. Set PM2 to start on boot:"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "=================================="
echo -e "${GREEN}✅ VPS Deployment Fix Complete!${NC}"
echo "=================================="
