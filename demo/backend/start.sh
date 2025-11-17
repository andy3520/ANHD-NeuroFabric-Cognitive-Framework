#!/bin/bash
# Quick start script for NeuroFabric backend

echo "🧠 NeuroFabric Backend Setup"
echo "=============================="
echo ""

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit .env and add your OPENAI_API_KEY"
    echo "   nano .env"
    echo ""
    exit 1
fi

# Check if API key is set
if grep -q "your_openai_api_key_here" .env; then
    echo ""
    echo "⚠️  OPENAI_API_KEY not configured in .env"
    echo "📝 Please edit .env and add your actual API key"
    echo "   nano .env"
    echo ""
    exit 1
fi

echo "✓ Environment configured"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip install -q -r requirements.txt
echo "✓ Dependencies installed"
echo ""

# Create memory directory
mkdir -p memory
echo "✓ Memory directory created"
echo ""

# Start server
echo "🚀 Starting NeuroFabric API server..."
echo ""
echo "Server will be available at:"
echo "  - API:   http://localhost:8000"
echo "  - Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 -m uvicorn app.main:app --reload --port 8000
