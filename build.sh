#!/bin/bash
set -e

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Running migrations if needed..."
cd backend
python -c "from app.core.database import init_db; init_db()"
cd ..

echo "Build complete!"