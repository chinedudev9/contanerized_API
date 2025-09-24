# ===========================
# Base Stage - Common Dependencies
# ===========================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies required for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Copy package files
COPY package*.json ./

# ===========================
# Development Stage
# ===========================
FROM base AS development

# Set NODE_ENV to development
ENV NODE_ENV=development

# Install all dependencies (including devDependencies)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p /app/log

# Expose port
EXPOSE 3000

# Command for development (with hot reload)
CMD ["npm", "run", "dev"]

# ===========================
# Production Dependencies Stage
# ===========================
FROM base AS prod-deps

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# ===========================
# Production Build Stage
# ===========================
FROM node:20-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy production dependencies from prod-deps stage
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package*.json ./

# Copy source code
COPY --chown=nodejs:nodejs . .

# Create logs directory with proper permissions
RUN mkdir -p /app/log && chown -R nodejs:nodejs /app/log

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "
        const http = require('http');
        const options = {
            host: 'localhost',
            port: process.env.PORT || 3000,
            path: '/health',
            timeout: 2000
        };
        const request = http.request(options, (res) => {
            if (res.statusCode == 200) {
                process.exit(0);
            } else {
                process.exit(1);
            }
        });
        request.on('error', () => process.exit(1));
        request.end();
    "

# Start the application
CMD ["node", "src/server.js"]