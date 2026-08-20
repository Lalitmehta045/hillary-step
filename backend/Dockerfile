# ============================================================
# Multi-stage Dockerfile — Hillary Step Backend API
# Container/OS hardening: non-root user, minimal image, no dev deps
# ============================================================

# --- Stage 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install ALL dependencies (including dev) for building
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Remove dev dependencies — only keep production deps in the final image
RUN npm ci --omit=dev && npm cache clean --force


# --- Stage 2: Production ---
FROM node:22-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy built application and production node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Copy nginx config (for reference, not used in container)
COPY nginx ./nginx

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main"]
