#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ----------------------------------------------------------------------
# Helper: Find a free port on the host
# ----------------------------------------------------------------------
find_free_port() {
    local port
    while : ; do
        port=$(( ( RANDOM % 30000 ) + 10000 ))
        (echo >/dev/tcp/localhost/$port) &>/dev/null || break
    done
    echo "$port"
}

CONTAINER_NAME="mongodb-e2e"
MONGO_PORT=$(find_free_port)
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
# 1. Create a fresh MongoDB container on a free port
# ----------------------------------------------------------------------
echo -e "${YELLOW}🚀 Preparing MongoDB container for E2E tests on port ${MONGO_PORT}...${NC}"
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
# 2. Build and run backend (using the dynamic port)
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
    sleep 1
done

# ----------------------------------------------------------------------
# 3. Start frontend
# ----------------------------------------------------------------------
echo -e "${YELLOW}🚀 Starting frontend...${NC}"
cd frontend
npm install
ng serve --port 4200 --open=false &
FRONTEND_PID=$!
cd ..

echo -e "${YELLOW}⏳ Waiting for frontend (port 4200)...${NC}"
# shellcheck disable=SC2034
for i in {1..30}; do
    if curl -s -f http://localhost:4200 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend ready.${NC}"
        break
    fi
    sleep 1
done

# ----------------------------------------------------------------------
# 4. Seed test user and sample event
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
echo -e "${GREEN}✅ Token obtained.${NC}"

echo -e "${YELLOW}🎭 Creating sample event...${NC}"
FUTURE_DATE=$(date -d "+7 days" +"%Y-%m-%dT18:00:00")
curl -s -X POST http://localhost:3000/api/events \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"title\":\"Sample Event\",\"description\":\"Test\",\"dateTime\":\"$FUTURE_DATE\",\"location\":\"Test Location\",\"category\":\"Tech\"}" > /dev/null
echo -e "${GREEN}✅ Sample event created.${NC}"

# ----------------------------------------------------------------------
# 5. Run Cypress tests
# ----------------------------------------------------------------------
echo -e "${YELLOW}🧪 Running Cypress E2E tests...${NC}"
cd frontend
npx cypress run
CYPRESS_EXIT_CODE=$?
cd ..

# ----------------------------------------------------------------------
# 6. Cleanup will run via trap
# ----------------------------------------------------------------------
if [ ${CYPRESS_EXIT_CODE} -eq 0 ]; then
    echo -e "${GREEN}✅ All E2E tests passed!${NC}"
else
    echo -e "${RED}❌ E2E tests failed (exit code ${CYPRESS_EXIT_CODE}).${NC}"
fi
exit ${CYPRESS_EXIT_CODE}