# Memcode Docker Setup

## Quick Start

**Local Development:**
```bash
git clone https://github.com/lakesare/memcode.git
cd memcode
./docker-setup.sh setup
./docker-setup.sh start
```

**GitHub Codespaces:**  
Just open in Codespaces - automatically starts!

Open http://localhost:3000 when ready

## Commands

```bash
./docker-setup.sh setup     # First time setup
./docker-setup.sh start     # Start Memcode
./docker-setup.sh stop      # Stop Memcode  
./docker-setup.sh logs      # View logs
./docker-setup.sh reset     # Reset everything
```

## Manual Docker Commands

```bash
docker-compose up           # Start
docker-compose down         # Stop
docker-compose down -v      # Reset (deletes data)
```
