#!/bin/bash

# AI Student Toolkit - Development Start Script for macOS/Linux

echo ""
echo "🚀 AI Student Toolkit - Starting Development Server"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# Start the development server
echo "🔥 Starting Next.js development server..."
echo ""
echo "📍 Visit: http://localhost:3000"
echo "📍 Press Ctrl+C to stop"
echo ""

npm run dev
