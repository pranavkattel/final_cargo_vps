#!/bin/bash

# Quick Start Script for VPS Deployment
# Run this script to start the backend on your VPS

echo "🚀 Starting Cargo Capital Backend on VPS"
echo "========================================"

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "❌ .env file not found!"
  echo "📝 Creating .env from template..."
  
  if [ -f ".env.vps" ]; then
    cp .env.vps .env
    echo "✅ .env file created from .env.vps"
    echo "⚠️  IMPORTANT: Edit .env with your actual values!"
    echo "   Run: nano .env"
    exit 1
  else
    echo "❌ No template found. Please create .env file manually."
    exit 1
  fi
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

# Kill existing processes on port 5000
echo ""
echo "🧹 Cleaning up existing processes..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "   Killing process on port 5000..."
  kill -9 $(lsof -t -i:5000) 2>/dev/null
fi

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
  echo ""
  echo "✅ PM2 detected"
  echo "🔄 Starting with PM2..."
  
  # Stop existing PM2 process
  pm2 delete cargo-backend 2>/dev/null
  
  # Start with PM2
  pm2 start server.js --name cargo-backend
  
  if [ $? -eq 0 ]; then
    echo "✅ Backend started with PM2"
    echo ""
    echo "📊 View logs: pm2 logs cargo-backend"
    echo "📈 Monitor: pm2 monit"
    echo "🔄 Restart: pm2 restart cargo-backend"
    echo "⏹️  Stop: pm2 stop cargo-backend"
    
    # Save PM2 config
    pm2 save
    
    echo ""
    echo "💾 PM2 configuration saved"
    echo "🔁 Run 'pm2 startup' to enable auto-start on boot"
  else
    echo "❌ Failed to start with PM2"
    exit 1
  fi
else
  echo ""
  echo "⚠️  PM2 not found"
  echo "📝 Install PM2 for better process management:"
  echo "   sudo npm install -g pm2"
  echo ""
  echo "🔄 Starting with Node.js..."
  
  # Start with Node
  nohup node server.js > backend.log 2>&1 &
  
  if [ $? -eq 0 ]; then
    echo "✅ Backend started"
    echo "📊 View logs: tail -f backend.log"
  else
    echo "❌ Failed to start backend"
    exit 1
  fi
fi

# Wait a moment for server to start
sleep 2

# Test the server
echo ""
echo "🧪 Testing server..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)

if [ "$HEALTH_CHECK" = "200" ]; then
  echo "✅ Server is running! (HTTP $HEALTH_CHECK)"
  echo ""
  echo "========================================"
  echo "🎉 Backend Successfully Started!"
  echo "========================================"
  echo "📍 Local: http://localhost:5000"
  echo "🌐 API: http://localhost:5000/api/health"
  echo ""
  echo "Next steps:"
  echo "1. Test API: curl http://localhost:5000/api/health"
  echo "2. Configure Nginx reverse proxy (recommended)"
  echo "3. Set up SSL with Let's Encrypt"
  echo "========================================"
else
  echo "⚠️  Server started but health check failed (HTTP $HEALTH_CHECK)"
  echo "📊 Check logs for details"
fi
