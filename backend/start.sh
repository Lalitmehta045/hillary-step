#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Running seed script..."
node prisma/seed.js

echo "Starting application..."
exec node dist/main
