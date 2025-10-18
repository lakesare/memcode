#!/bin/bash
set -e

echo "🚀 Starting Memcode Docker container..."

# Create empty env.js file (app will use environment variables)
echo "// Environment variables are set via Docker\nexport default {};" > /app/env.js

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo "⏳ Waiting for PostgreSQL to be ready..."
    until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 2
    done
    echo "✅ PostgreSQL is ready!"
}

# Function to check if database exists and has tables
check_database_initialized() {
    TABLES_COUNT=$(psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")
    if [ "$TABLES_COUNT" -gt 0 ]; then
        echo "✅ Database already initialized with $TABLES_COUNT tables"
        return 0
    else
        echo "📋 Database needs initialization"
        return 1
    fi
}

# Function to build frontend
build_frontend() {
    echo "🏗️  Building frontend..."
    cd /app/frontend
    NODE_OPTIONS="--openssl-legacy-provider" ../node_modules/.bin/webpack --config ./webpack/development.config.js
    echo "✅ Frontend built successfully!"
    cd /app
}

# Wait for database
wait_for_postgres

# Check if database is initialized, if not the schema will be loaded by PostgreSQL init scripts
if ! check_database_initialized; then
    echo "🔄 Database will be initialized by PostgreSQL init scripts..."
    # Give PostgreSQL a moment to run the init scripts
    sleep 5
fi

# Build frontend if webpacked directory doesn't exist or is empty
if [ ! -d "/app/backend/webpacked" ] || [ -z "$(ls -A /app/backend/webpacked 2>/dev/null)" ]; then
    build_frontend
else
    echo "✅ Frontend already built"
fi

echo "🎯 Starting Memcode application..."

# Check if we're in development mode
if [ "$NODE_ENV" = "development" ]; then
    echo "🔄 Starting in development mode with hot reload..."
    
    # Start frontend webpack watcher in background
    echo "📦 Starting frontend webpack watcher..."
    cd /app/frontend
    NODE_OPTIONS="--openssl-legacy-provider" ../node_modules/.bin/webpack --config ./webpack/development.config.js --watch &
    WEBPACK_PID=$!
    cd /app
    
    # Function to cleanup background processes
    cleanup() {
        echo "🔄 Shutting down background processes..."
        kill $WEBPACK_PID 2>/dev/null || true
        exit 0
    }
    trap cleanup SIGTERM SIGINT
    
    # Start backend with nodemon for auto-restart
    echo "🚀 Starting backend with nodemon..."
    exec node_modules/.bin/nodemon --inspect=0.0.0.0:9229 --watch backend backend/index.js
else
    # Production mode
    exec node backend/index.js
fi
