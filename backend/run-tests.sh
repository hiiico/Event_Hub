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
        port=$(( ( RANDOM % 30000 ) + 10000 ))  # between 10000 and 40000
        (echo >/dev/tcp/localhost/$port) &>/dev/null || break
    done
    echo "$port"
}

CONTAINER_NAME="mongodb-backend-test"
MONGO_PORT=$(find_free_port)

cleanup() {
    echo -e "${YELLOW}🧹 Removing test MongoDB container...${NC}"
    docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
}
trap cleanup EXIT

# ----------------------------------------------------------------------
# 1. Create a fresh MongoDB container on a free port
# ----------------------------------------------------------------------
echo -e "${YELLOW}🚀 Preparing MongoDB container for backend tests on port ${MONGO_PORT}...${NC}"
docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
docker run -d --name "${CONTAINER_NAME}" -p ${MONGO_PORT}:27017 mongo:7
echo -e "${GREEN}✅ Container started.${NC}"

# Wait for MongoDB to be ready
echo -e "${YELLOW}⏳ Waiting for MongoDB...${NC}"
until docker exec "${CONTAINER_NAME}" mongosh --eval "db.runCommand({ping:1})" &>/dev/null; do
    sleep 1
done
echo -e "${GREEN}✅ MongoDB ready.${NC}"

# ----------------------------------------------------------------------
# 2. Run Maven tests with a dedicated database
# ----------------------------------------------------------------------
echo -e "${YELLOW}🔧 Running Maven tests...${NC}"
export SPRING_DATA_MONGODB_URI="mongodb://localhost:${MONGO_PORT}/testdb"
mvn clean test
TEST_EXIT_CODE=$?
cd ..

# ----------------------------------------------------------------------
# 3. Cleanup will run via trap
# ----------------------------------------------------------------------
if [ ${TEST_EXIT_CODE} -eq 0 ]; then
    echo -e "${GREEN}✅ All backend tests passed!${NC}"
else
    echo -e "${RED}❌ Backend tests failed (exit code ${TEST_EXIT_CODE}).${NC}"
fi
exit ${TEST_EXIT_CODE}