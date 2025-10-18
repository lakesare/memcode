#!/bin/bash

# Memcode Docker Setup Script
# This script helps set up and run Memcode with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first:"
        echo "  Ubuntu/Debian: sudo apt install docker.io"
        echo "  macOS: brew install --cask docker"
        echo "  Windows: Download from https://docker.com"
        exit 1
    fi
    
    print_success "Docker is installed: $(docker --version)"
}

# Check if Docker Compose is available
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
        print_success "Docker Compose is available: $(docker-compose --version)"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
        print_success "Docker Compose plugin is available: $(docker compose version)"
    else
        print_error "Docker Compose is not available. Installing..."
        install_docker_compose
    fi
}

# Install Docker Compose
install_docker_compose() {
    print_status "Installing Docker Compose..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux installation
        sudo apt update
        sudo apt install -y docker-compose
        COMPOSE_CMD="docker-compose"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS installation
        brew install docker-compose
        COMPOSE_CMD="docker-compose"
    else
        print_error "Please install Docker Compose manually for your system"
        exit 1
    fi
    
    print_success "Docker Compose installed successfully"
}

# Main setup function
setup() {
    print_status "Setting up Memcode with Docker..."
    
    check_docker
    check_docker_compose
    
    # Make docker-entrypoint.sh executable
    chmod +x docker-entrypoint.sh
    
    print_success "Setup complete! You can now run Memcode with Docker."
    echo ""
    echo "To start Memcode, run:"
    echo "  ./docker-setup.sh start"
    echo ""
    echo "To see all available commands:"
    echo "  ./docker-setup.sh help"
}

# Start the application
start() {
    print_status "Starting Memcode..."
    $COMPOSE_CMD up
}

# Start in background
start_detached() {
    print_status "Starting Memcode in background..."
    $COMPOSE_CMD up -d
    print_success "Memcode is running in background"
    echo "View logs with: ./docker-setup.sh logs"
    echo "Stop with: ./docker-setup.sh stop"
}

# Stop the application
stop() {
    print_status "Stopping Memcode..."
    $COMPOSE_CMD down
    print_success "Memcode stopped"
}

# Show logs
logs() {
    $COMPOSE_CMD logs -f
}

# Rebuild containers
rebuild() {
    print_status "Rebuilding Memcode containers..."
    $COMPOSE_CMD build --no-cache
    print_success "Containers rebuilt"
}

# Reset everything (including database)
reset() {
    print_warning "This will delete all data including the database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting Memcode environment..."
        $COMPOSE_CMD down -v
        docker system prune -f
        print_success "Environment reset complete"
    else
        print_status "Reset cancelled"
    fi
}

# Show help
show_help() {
    echo "Memcode Docker Setup Script"
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial setup (install Docker Compose if needed)"
    echo "  start     - Start Memcode (foreground)"
    echo "  start-bg  - Start Memcode in background"
    echo "  stop      - Stop Memcode"
    echo "  logs      - Show application logs"
    echo "  rebuild   - Rebuild Docker containers"
    echo "  reset     - Reset everything (⚠️  deletes all data)"
    echo "  help      - Show this help message"
    echo ""
    echo "First time setup:"
    echo "  1. ./docker-setup.sh setup"
    echo "  2. ./docker-setup.sh start"
    echo "  3. Open http://localhost:3000 in your browser"
}

# Main script logic
case "$1" in
    "setup")
        setup
        ;;
    "start")
        start
        ;;
    "start-bg")
        start_detached
        ;;
    "stop")
        stop
        ;;
    "logs")
        logs
        ;;
    "rebuild")
        rebuild
        ;;
    "reset")
        reset
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac