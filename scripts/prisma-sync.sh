#!/bin/bash

echo "Syncing generated Prisma client to running Docker services..."

# Sync scheduler container
echo "Syncing alua-academy-management-scheduler..."
docker exec alua-academy-management-scheduler npx prisma generate

# Sync worker container
echo "Syncing alua-academy-management-worker..."
docker exec alua-academy-management-worker npx prisma generate

# Sync server container
echo "Syncing alua-academy-management-server..."
docker exec alua-academy-management-server npx prisma generate

echo "Prisma sync complete!"
