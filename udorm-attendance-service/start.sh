#!/bin/sh

set -e

python -m workers.attendance_consumer &
CONSUMER_PID=$!

cleanup() {
	kill "$CONSUMER_PID" 2>/dev/null || true
	wait "$CONSUMER_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

uvicorn main:app --host 0.0.0.0 --port "${APP_PORT:-8001}"
