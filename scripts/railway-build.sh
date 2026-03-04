#!/bin/bash
set -e

# Override DATABASE_URL for build phase — Railway injects the real URL at runtime.
# prisma generate only needs a syntactically valid URL, not a reachable one.
export DATABASE_URL="postgresql://x:x@x:5432/x"

npx prisma generate
npx next build
