#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting E2E test environment...${NC}"

# ----------------------------------------------------------------------
# 1. Docker setup (Ubuntu/Debian)
# ----------------------------------------------------------------------
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Docker not found. Installing Docker...${NC}"
    sudo apt update
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    echo -e "${GREEN}✅ Docker installed.${NC}"
else
    echo -e "${GREEN}✅ Docker already installed.${NC}"
fi

if ! sudo systemctl is-active --quiet docker; then
    echo -e "${YELLOW}🐳 Starting Docker daemon...${NC}"
    sudo systemctl start docker
    echo -e "${GREEN}✅ Docker daemon started.${NC}"
else
    echo -e "${GREEN}✅ Docker daemon already running.${NC}"
fi

# ----------------------------------------------------------------------
# 2. Kill processes using ports 3000 and 4200 (if any)
# ----------------------------------------------------------------------
echo -e "${YELLOW}🧹 Ensuring ports 3000 (backend) and 4200 (frontend) are free...${NC}"
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 4200/tcp 2>/dev/null || true
sleep 2

# ----------------------------------------------------------------------
# 3. MongoDB container (disposable)
# ----------------------------------------------------------------------
CONTAINER_NAME="mongodb-e2e"
MONGO_PORT="27017"
DB_NAME="e2e_test_db"

docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

echo -e "${YELLOW}🆕 Creating fresh MongoDB container...${NC}"
docker run -d -p ${MONGO_PORT}:27017 --name ${CONTAINER_NAME} mongo:7 --replSet rs0 --bind_ip_all
echo -e "${GREEN}✅ Container created.${NC}"

echo -e "${YELLOW}⏳ Waiting for MongoDB to be ready...${NC}"
until docker exec ${CONTAINER_NAME} mongosh --eval "db.runCommand({ping:1})" &>/dev/null; do
    echo -n "."
    sleep 1
done
echo -e "\n${GREEN}✅ MongoDB is ready.${NC}"

# Initialize replica set
docker exec ${CONTAINER_NAME} mongosh --eval "rs.initiate()" &>/dev/null || true
sleep 2

# ----------------------------------------------------------------------
# 4. Build backend
# ----------------------------------------------------------------------
echo -e "${YELLOW}🔧 Building backend...${NC}"
cd backend

if [ -f "./mvnw" ]; then
    ./mvnw clean package -DskipTests
else
    mvn clean package -DskipTests
fi

# ----------------------------------------------------------------------
# 5. Start backend (ensure it's really stopped before)
# ----------------------------------------------------------------------
echo -e "${YELLOW}🚀 Starting backend on port 3000...${NC}"
export SPRING_DATA_MONGODB_URI="mongodb://localhost:${MONGO_PORT}/${DB_NAME}"
export SPRING_PROFILES_ACTIVE=e2e

# Remove any old PID file
rm -f backend.pid

java -jar target/*.jar &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid
cd ..

# ----------------------------------------------------------------------
# 6. Start frontend
# ----------------------------------------------------------------------
echo -e "${YELLOW}🚀 Starting frontend (Angular) on port 4200...${NC}"
cd frontend
npm install   # ensure dependencies

# Remove any old PID file
rm -f frontend.pid

ng serve --port 4200 --open=false &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid
cd ..

# ----------------------------------------------------------------------
# 7. Wait for services to be ready
# ----------------------------------------------------------------------
echo -e "${YELLOW}⏳ Waiting for backend (port 3000) to respond...${NC}"
for i in {1..60}; do
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    if [ "$i" -eq 60 ]; then
        echo -e "${RED}❌ Backend failed to start.${NC}"
        kill ${BACKEND_PID} 2>/dev/null || true
        kill ${FRONTEND_PID} 2>/dev/null || true
        docker rm -f ${CONTAINER_NAME}
        exit 1
    fi
    sleep 1
done

echo -e "${YELLOW}⏳ Waiting for frontend (port 4200) to respond...${NC}"
for i in {1..60}; do
    if curl -s -f http://localhost:4200 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready!${NC}"
        break
    fi
    if [ "$i" -eq 60 ]; then
        echo -e "${RED}❌ Frontend failed to start.${NC}"
        kill ${BACKEND_PID} 2>/dev/null || true
        kill ${FRONTEND_PID} 2>/dev/null || true
        docker rm -f ${CONTAINER_NAME}
        exit 1
    fi
    sleep 1
done

# ----------------------------------------------------------------------
# 8. Cleanup function (called on exit)
# ----------------------------------------------------------------------
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    if [ -f backend.pid ]; then
        kill "$(cat backend.pid)" 2>/dev/null || true
        rm backend.pid
    fi
    if [ -f frontend.pid ]; then
        kill "$(cat frontend.pid)" 2>/dev/null || true
        rm frontend.pid
    fi
    # Also kill any stray processes on ports
    sudo fuser -k 3000/tcp 2>/dev/null || true
    sudo fuser -k 4200/tcp 2>/dev/null || true
    docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
    echo -e "${GREEN}✅ Cleanup finished.${NC}"
}

trap cleanup EXIT

# ----------------------------------------------------------------------
# 9. Run Cypress tests (ALL tests)
# ----------------------------------------------------------------------
echo -e "${YELLOW}🧪 Running all Cypress E2E tests...${NC}"
cd frontend
npx cypress run   # runs all specs in cypress/e2e/
CYPRESS_EXIT_CODE=$?
cd ..

# ----------------------------------------------------------------------
# 10. Exit with Cypress result
# ----------------------------------------------------------------------
if [ ${CYPRESS_EXIT_CODE} -eq 0 ]; then
    echo -e "${GREEN}✅ All E2E tests passed!${NC}"
else
    echo -e "${RED}❌ E2E tests failed (exit code ${CYPRESS_EXIT_CODE}).${NC}"
fi
exit ${CYPRESS_EXIT_CODE}