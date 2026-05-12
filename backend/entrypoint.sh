#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed!"
echo "🚀 Starting NestJS application..."

exec node dist/src/main.js
