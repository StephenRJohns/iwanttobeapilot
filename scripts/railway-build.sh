#!/bin/bash
set -e

# Build script for Railway (Dockerfile builder).
# DATABASE_URL is injected by Railway at runtime via ${{Postgres.DATABASE_URL}}.
# prisma generate only needs a syntactically valid URL during build — not a live connection.
export DATABASE_URL="postgresql://build:build@localhost:5432/build"

echo "Running prisma generate..."
npx prisma generate

echo "Running next build..."
npx next build

echo "Build complete."
