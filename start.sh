#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/backend"
export PYTHONPATH="$PWD"

exec uvicorn app.main:app --host 0.0.0.0 --port 8000
