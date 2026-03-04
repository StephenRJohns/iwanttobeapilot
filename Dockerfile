FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies (fresh, with optional packages for native bindings)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install --include=optional

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runner
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/data ./src/data

EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

CMD ["npm", "start"]
