FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for Prisma in Alpine
RUN apk add --no-cache libc6-compat openssl

# Install dependencies first
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source and prisma schema
COPY . .

# Generate Prisma Client
RUN pnpm prisma:generate

# Build the project
RUN pnpm build

# --- Production Image ---
FROM node:20-alpine

WORKDIR /app

# Install dependencies for Prisma in Alpine
RUN apk add --no-cache libc6-compat openssl

# Install pnpm globally to run migrations if needed
RUN npm install -g pnpm

# Copy only what's needed from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/swagger.yaml ./swagger.yaml

# Create logs directory
RUN mkdir -p logs && chown -R node:node /app

USER node

EXPOSE 3000

# Script to run migrations and start server
CMD ["sh", "-c", "pnpm prisma:deploy && pnpm start"]
