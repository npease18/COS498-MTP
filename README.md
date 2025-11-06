# COS498 Midterm Project: Server Side Programming Languages

This is a midterm project for **COS498: Server Side Programming Languages** that demonstrates a full-stack web application using containerized microservices architecture.

## Project Overview

This project implements a web application with the following architecture:
- **Frontend**: Nginx serving static files
- **Backend**: Node.js/Express API server
- **Containerization**: Docker containers orchestrated with Docker Compose

## Prerequisites

Before running this project, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```
COS498-MTP/
├── docker-compose.yml          # Docker Compose configuration
├── README.md                   # This file
├── backend/
│   ├── Dockerfile             # Backend container configuration
│   └── server.js              # Node.js Express server
├── frontend/
│   ├── Dockerfile             # Frontend container configuration
│   └── default.conf           # Nginx configuration
└── public/
    └── index.html             # Static frontend files
```

## How to Start the Webserver

### Option 1: Using Docker Compose (Recommended)

1. **Clone and navigate to the project directory:**
   ```bash
   cd /home/npease/COS498-MTP
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost/api/
   - Health check: http://localhost/api/health

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Docker Build

1. **Build the backend:**
   ```bash
   docker build -t mtp-backend ./backend
   ```

2. **Build the frontend:**
   ```bash
   docker build -f frontend/Dockerfile -t mtp-frontend .
   ```

3. **Run the containers:**
   ```bash
   # Run backend
   docker run -d -p 3000:3000 --name backend mtp-backend
   
   # Run frontend
   docker run -d -p 80:80 --name frontend mtp-frontend
   ```

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/` - Welcome message with timestamp
- `GET /api/health` - Health check endpoint

## Architecture Details

### Frontend (Nginx)
- Serves static files from the `public/` directory
- Proxies API requests to the backend service
- Configured to strip `/api` prefix when forwarding to backend

### Backend (Node.js/Express)
- REST API server running on port 3000
- Provides JSON responses
- Health monitoring endpoint
- CORS and middleware configured

### Containerization
- Each service runs in its own Docker container
- Services communicate through Docker's internal network
- Frontend acts as a reverse proxy for API requests

## Development Notes

- The nginx configuration strips the `/api` prefix when forwarding requests to the backend
- Static files are served directly by nginx for better performance
- The backend focuses solely on API functionality
- All services are containerized for consistent deployment

## Course Information

**Course**: COS498 - Server Side Programming Languages  
**Project Type**: Midterm Project  
**Focus**: Demonstrating containerized web application architecture with separation of concerns between frontend and backend services.

## Troubleshooting

1. **Port conflicts**: Ensure ports 80 and 3000 are available
2. **Docker issues**: Try `docker-compose down` and `docker-compose up --build`
3. **Permission issues**: Ensure Docker has proper permissions on your system
4. **API not responding**: Check that both containers are running with `docker-compose ps`

## Author

Nicholas Pease  
COS498: Server Side Programming Languages