# Use Node.js 22 as specified in package.json
FROM node:22-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client \
    bash

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Make entrypoint script executable
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Use custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]