#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed!"
echo "🔧 Ensuring settings row exists..."
node prisma/bootstrap-settings.js

echo "🚀 Starting NestJS application..."

exec node dist/src/main.js
