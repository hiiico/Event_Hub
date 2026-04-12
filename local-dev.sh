#!/bin/bash
set -e

MONGO_CONTAINER="mongodb-local"
MONGO_PORT=27017
MONGO_VOLUME="mongodb_data"

# Cleanup: stop the MongoDB container on exit
cleanup() {
    echo -e "\n🧹 Stopping persistent MongoDB container (data preserved)..."
    docker stop "${MONGO_CONTAINER}" 2>/dev/null || true
    echo "✅ MongoDB container stopped."
}
trap cleanup EXIT

# ----------------------------------------------------------------------
# 1. Ensure MongoDB container exists and is running
# ----------------------------------------------------------------------
if ! docker ps -a --format '{{.Names}}' | grep -q "^${MONGO_CONTAINER}$"; then
    echo "Creating persistent MongoDB container..."
    docker run -d \
        --name ${MONGO_CONTAINER} \
        -p ${MONGO_PORT}:27017 \
        -v ${MONGO_VOLUME}:/data/db \
        mongo:7
else
    if ! docker ps --format '{{.Names}}' | grep -q "^${MONGO_CONTAINER}$"; then
        echo "Starting existing MongoDB container..."
        docker start ${MONGO_CONTAINER}
    else
        echo "MongoDB container already running."
    fi
fi

# ----------------------------------------------------------------------
# 2. Start backend (on host) with dev profile
# ----------------------------------------------------------------------
echo "Starting backend on port 3000 with dev profile..."
cd backend
export SPRING_DATA_MONGODB_URI="mongodb://localhost:${MONGO_PORT}/eventhub_dev"
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &
BACKEND_PID=$!
cd ..

# ----------------------------------------------------------------------
# 3. Start frontend (on host)
# ----------------------------------------------------------------------
echo "Starting frontend on port 4200..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo -e "\n✅ Local development environment ready."
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:4200"
echo "   MongoDB:  localhost:27017 (persistent)"
echo -e "\nPress Ctrl+C to stop backend/frontend and also stop MongoDB container.\n"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID