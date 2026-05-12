# ─────────────────────────────────────────
# Builder Stage
# ─────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# Remove dev dependencies before copying into the runtime image
RUN npm prune --omit=dev

# Verify build output exists
RUN ls -la /app/dist/src/main.js

# ─────────────────────────────────────────
# Production Stage
# ─────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy production-ready node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy runtime assets
COPY --from=builder /app/src/i18n ./src/i18n
COPY --from=builder /app/src/mail/templates ./src/mail/templates

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose app port
EXPOSE 3000

# Start application with entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]