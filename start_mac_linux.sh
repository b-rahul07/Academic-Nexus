#!/bin/bash

# NEXUS Setup Script for macOS and Linux
# IMPORTANT: Before running, execute:
#   chmod +x start_mac_linux.sh
#
# Then run the script:
#   ./start_mac_linux.sh

echo ""
echo "======================================"
echo "  NEXUS SETUP SCRIPT FOR MAC/LINUX"
echo "======================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "NEXUS SETUP: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "WARNING: .env file created with placeholder values."
    echo "IMPORTANT: Edit .env and add your Supabase credentials:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo ""
    read -p "Press Enter to continue..."
else
    echo "NEXUS SETUP: .env file found. Proceeding..."
    echo ""
fi

echo "Installing dependencies (this may take 1-2 minutes)..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed!"
    exit 1
fi

echo ""
echo "======================================"
echo "  STARTING NEXUS SERVER"
echo "======================================"
echo ""
echo "Server will be available at:"
echo "   http://localhost:5000"
echo ""
echo "Opening browser in 3 seconds..."
echo ""

sleep 3

# Try to open browser (macOS uses 'open', Linux uses 'xdg-open')
if command -v open &> /dev/null; then
    open http://localhost:5000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5000
else
    echo "Could not detect a browser. Please manually visit: http://localhost:5000"
fi

echo "Starting development server..."
npm run dev
