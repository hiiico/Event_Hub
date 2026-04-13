#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CONTAINER_NAME="mongodb-e2e"
MONGO_PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("",0)); print(s.getsockname()[1]); s.close()' 2>/dev/null || echo "27019")
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up E2E environment...${NC}"
    kill ${BACKEND_PID} 2>/dev/null || true
    kill ${FRONTEND_PID} 2>/dev/null || true
    docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
}
trap cleanup EXIT

# ----------------------------------------------------------------------
# 1. Ensure ports are free
# ----------------------------------------------------------------------
echo -e "${YELLOW}🧹 Ensuring ports 3000 and 4200 are free...${NC}"
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 4200/tcp 2>/dev/null || true
sleep 2

# ----------------------------------------------------------------------
# 2. MongoDB container
# ----------------------------------------------------------------------
echo -e "${YELLOW}🚀 Preparing MongoDB container on port ${MONGO_PORT}...${NC}"
docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
docker run -d --name "${CONTAINER_NAME}" -p ${MONGO_PORT}:27017 mongo:7 --replSet rs0 --bind_ip_all
echo -e "${GREEN}✅ Container started.${NC}"

echo -e "${YELLOW}⏳ Waiting for MongoDB...${NC}"
until docker exec "${CONTAINER_NAME}" mongosh --eval "db.runCommand({ping:1})" &>/dev/null; do
    sleep 1
done
docker exec "${CONTAINER_NAME}" mongosh --eval "rs.initiate()" &>/dev/null || true
echo -e "${GREEN}✅ MongoDB ready.${NC}"

# ----------------------------------------------------------------------
# 3. Build and run backend
# ----------------------------------------------------------------------
echo -e "${YELLOW}🔧 Building backend...${NC}"
cd backend
./mvnw clean package -DskipTests
export SPRING_DATA_MONGODB_URI="mongodb://localhost:${MONGO_PORT}/e2e_db"
export SPRING_PROFILES_ACTIVE=e2e

echo -e "${YELLOW}🚀 Starting backend...${NC}"
java -jar target/*.jar &
BACKEND_PID=$!
cd ..

# Wait for backend
echo -e "${YELLOW}⏳ Waiting for backend (port 3000)...${NC}"
for i in {1..30}; do
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend ready.${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start.${NC}"
        exit 1
    fi
    sleep 2
done

# ----------------------------------------------------------------------
# 4. Start frontend (with output logging)
# ----------------------------------------------------------------------
echo -e "${YELLOW}🚀 Starting frontend on port 4200...${NC}"
cd frontend
npm install

# Kill any existing ng serve process
pkill -f "ng serve" || true

# Start frontend using npx (ensures local Angular CLI is used)
npx ng serve --port 4200 --host 0.0.0.0 --open=false > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready (curl with retry)
echo -e "${YELLOW}⏳ Waiting for frontend (port 4200) to respond...${NC}"
for i in {1..30}; do
    if curl -s -f http://localhost:4200 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend ready.${NC}"
        break
    fi
    # Check if process is still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend process died. Showing log:${NC}"
        cat frontend/frontend.log 2>/dev/null || echo "No log file"
        exit 1
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Frontend failed to start. Log:${NC}"
        cat frontend/frontend.log 2>/dev/null || echo "No log file"
        exit 1
    fi
    sleep 2
done

# ----------------------------------------------------------------------
# 5. Seed test user and sample event
# ----------------------------------------------------------------------
echo -e "${YELLOW}👤 Seeding test user...${NC}"
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","password":"password123"}' | tr -d '"')
if [ -z "$TOKEN" ]; then
    TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"password123"}' | tr -d '"')
fi
if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to obtain token.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Token obtained.${NC}"

echo -e "${YELLOW}🎭 Creating sample event...${NC}"
FUTURE_DATE=$(date -d "+7 days" +"%Y-%m-%dT18:00:00")
curl -s -X POST http://localhost:3000/api/events \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"title\":\"Sample Event\",\"description\":\"Test\",\"dateTime\":\"$FUTURE_DATE\",\"location\":\"Test Location\",\"category\":\"Tech\"}" > /dev/null
echo -e "${GREEN}✅ Sample event created.${NC}"

# ----------------------------------------------------------------------
# 6. Run Cypress tests (headless)
# ----------------------------------------------------------------------
echo -e "${YELLOW}🧪 Running Cypress E2E tests...${NC}"
cd frontend
npx cypress run --config baseUrl=http://localhost:4200
CYPRESS_EXIT_CODE=$?
cd ..

# ----------------------------------------------------------------------
# 7. Cleanup via trap
# ----------------------------------------------------------------------
if [ ${CYPRESS_EXIT_CODE} -eq 0 ]; then
    echo -e "${GREEN}✅ All E2E tests passed!${NC}"
else
    echo -e "${RED}❌ E2E tests failed (exit code ${CYPRESS_EXIT_CODE}).${NC}"
fi
exit ${CYPRESS_EXIT_CODE}