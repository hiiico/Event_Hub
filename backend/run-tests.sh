#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting automated test setup...${NC}"

# ----------------------------------------------------------------------
# 1. Check / install Docker (Ubuntu/Debian)
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

# ----------------------------------------------------------------------
# 2. Start Docker daemon if not running
# ----------------------------------------------------------------------
if ! sudo systemctl is-active --quiet docker; then
    echo -e "${YELLOW}🐳 Starting Docker daemon...${NC}"
    sudo systemctl start docker
    echo -e "${GREEN}✅ Docker daemon started.${NC}"
else
    echo -e "${GREEN}✅ Docker daemon already running.${NC}"
fi

# ----------------------------------------------------------------------
# 3. Ensure MongoDB container exists and is running
# ----------------------------------------------------------------------
CONTAINER_NAME="mongodb-local"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${GREEN}✅ Container ${CONTAINER_NAME} exists.${NC}"
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${GREEN}✅ Container ${CONTAINER_NAME} is already running.${NC}"
    else
        echo -e "${YELLOW}▶️  Starting existing container ${CONTAINER_NAME}...${NC}"
        docker start ${CONTAINER_NAME}
    fi
else
    echo -e "${YELLOW}📦 Creating new MongoDB container ${CONTAINER_NAME}...${NC}"
    docker run -d -p 27017:27017 --name ${CONTAINER_NAME} mongo:7
    echo -e "${GREEN}✅ Container created and started.${NC}"
fi

# ----------------------------------------------------------------------
# 4. Wait for MongoDB to become ready
# ----------------------------------------------------------------------
echo -e "${YELLOW}⏳ Waiting for MongoDB to be ready...${NC}"
until docker exec ${CONTAINER_NAME} mongosh --eval "db.runCommand({ping:1})" &>/dev/null; do
    echo -n "."
    sleep 1
done
echo -e "\n${GREEN}✅ MongoDB is ready.${NC}"

# ----------------------------------------------------------------------
# 5. Run Maven tests
# ----------------------------------------------------------------------
echo -e "${YELLOW}🧪 Running Maven tests...${NC}"
mvn clean test
TEST_EXIT_CODE=$?

# ----------------------------------------------------------------------
# 6. Stop the container after tests (optional)
# ----------------------------------------------------------------------
echo -e "${YELLOW}🛑 Stopping MongoDB container...${NC}"
docker stop ${CONTAINER_NAME}
echo -e "${GREEN}✅ Container stopped.${NC}"

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
else
    echo -e "${RED}❌ Tests failed with exit code ${TEST_EXIT_CODE}.${NC}"
    exit $TEST_EXIT_CODE
fi