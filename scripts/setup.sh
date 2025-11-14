#!/bin/bash
# CricAuc Setup Script for Linux/Mac

echo "🚀 Setting up CricAuc..."

# Check if .env files exist, create if not
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cp backend/env.template backend/.env
    echo "✅ Created backend/.env"
else
    echo "✅ backend/.env already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local..."
    cp frontend/env.template frontend/.env.local
    echo "✅ Created frontend/.env.local"
else
    echo "✅ frontend/.env.local already exists"
fi

echo ""
echo "📦 Installing dependencies..."
echo "Installing root dependencies..."
npm install

echo ""
echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo ""
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Docker: npm run docker:up"
echo "2. Create admin: cd backend && npm run create-admin"
echo "3. Start dev: npm run dev"



