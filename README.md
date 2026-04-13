![Event](https://img.shields.io/badge/Event-DD0031?style=for-the-badge&logo=angular&logoColor=white)![Hub](https://img.shields.io/badge/Hub-6CB252?style=for-the-badge&logo=spring&logoColor=white)
#### Full‑Stack Event Management Application

---

## Documentation
- [Project Board](https://github.com/users/hiiico/projects/14)
- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
- [Development](DEVELOPMENT_ROADMAP.md)

---

## Technology Stack

| Layer     | Technology                                                                    |
|-----------|-------------------------------------------------------------------------------|
| Backend   | Java 17+, Spring Boot 3.2.x, Spring Data MongoDB, Spring Security, JWT, Maven |
| Frontend  | Angular 17+ (standalone), TypeScript, RxJS, Angular CLI, CSS (custom)         |
| Database  | MongoDB Atlas (or local MongoDB)                                              |
| Container | Docker + Docker Compose                                                       |
| CI/CD     | GitHub Actions (backend JAR deployment)                                       |
| Hosting   | Azure App Service (backend), Azure Storage (frontend)                         |

---

## Getting Started

### Quick Start commands

#### MongoDB instance running locally:

```bash
docker run -d -p 27017:27017 --name mongodb-local mongo:7
```

#### Backend:

> Option A: Create `backend/src/main/resources/application-dev.properties`
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/eventhub_dev
jwt.secret=mySecretKeyForJWTGenerationShouldBeLongEnough12345
```

>Option B: Use environment variables

```bash
export SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/eventhub_dev
export JWT_SECRET=mySecretKeyForJWTGenerationShouldBeLongEnough12345
```

Then run

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
The API will be available at [http://localhost:3000](http://localhost:3000).

- Backend detailed setup in [backend/README.md](backend/README.md#running-locally).

#### Frontend:

```bash
cd frontend
npm install
npm start
```
The API will be available at [http://localhost:4200](http://localhost:4200).

- Frontend detailed setup in [frontend/README.md](frontend/README.md#running-locally).

---

### 1. Try the deployed app (no setup required)

The backend is already running on Azure, and the frontend is hosted as a static website.  
👉 [**EventHub Live Demo**](https://eventhubfrontend.z28.web.core.windows.net)

> You can browse events, but to create events or RSVP you need to register an account – it’s completely free.

---

### 2. Fork the repo and run locally (full development mode)

```bash
cd ../
./local-dev.sh
```

The script will:

- Create a persistent MongoDB container (data survives restarts)

- Launch the backend on port 3000 with the dev profile

- Launch the frontend on port 4200 with live reload

- Press `Ctrl+C` to stop – the MongoDB container stops automatically (data is kept for next run).

> Requirements: Docker, Java 17, Maven, Node.js 20, Angular CLI.

---

### 3. Pull pre‑built Docker images and run (no build required)

If you just want to run the application without building anything, use the images from Docker Hub.

```bash
# Pull the images
docker pull hiiico/eventhub-backend:latest
docker pull hiiico/eventhub-frontend:latest

# Run the backend (requires a MongoDB instance – see note below)
docker run -d -p 3000:3000 --name eventhub-backend hiiico/eventhub-backend:latest

# Run the frontend
docker run -d -p 4200:80 --name eventhub-frontend hiiico/eventhub-frontend:latest
```

> Note: The pre‑built backend expects a MongoDB connection string via the environment variable SPRING_DATA_MONGODB_URI. For a quick test, you can start a local MongoDB container: 
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
docker run -d -p 3000:3000 --name eventhub-backend --link mongodb -e SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/eventhub hiiico/eventhub-backend:latest
```

---

### 4. Build and run everything with Docker Compose (full local stack)

This option builds the images from source and runs a complete local environment with a MongoDB container, backend, and frontend – all isolated.

```bash
# Clone the repository
git clone https://github.com/hiiico/Event_Hub
cd eventhub

# (Optional) Create a .env file for JWT secret
echo "JWT_SECRET=mySuperSecretKey" > .env

# Build and start all services
docker-compose up --build

# Stop and remove containers (including the database volume)
docker-compose down -v
```

- Frontend: http://localhost:4200

- Backend API: http://localhost:3000

- MongoDB: internal mongodb://mongodb:27017/eventhub

> The frontend is built with `API_URL=http://localhost:3000/api`, so your browser talks directly to the backend container via the host‑mapped port.

---

## Testing

- [Backend](backend/README.md#running-tests)

- [Frontend](frontend/README.md#running-tests)

## Running E2E Tests (Full Stack)

The project provides two ways to run Cypress end‑to‑end tests:

1. **Fully automated script** – starts a disposable environment, runs all tests, cleans up.
2. **Manual run** – uses your already‑running local backend/frontend (good for debugging).

---

### Option 1: Automated (recommended for CI and clean runs)

```bash
./run-e2e-tests.sh
```

This script does everything for you:

- 🐳 Installs Docker (if missing – works on Ubuntu/Debian)

- 🔄 Starts the Docker daemon (if not already running)

- 🗄️ Creates a fresh MongoDB container named `mongodb-e2e` (replica set enabled)

- 🔧 Builds the backend (`mvn clean package -DskipTests`) and starts it on port 3000 with the e2e profile

- 🌐 Starts the Angular frontend (`ng serve`) on port 4200

- ⏳ Waits for both services to become responsive

- 🧪 Runs all Cypress E2E tests from `frontend/cypress/e2e/`

- 🧹 Stops the backend, frontend, and removes the MongoDB container (no leftovers)

All tests run against a real MongoDB instance inside a disposable container – no leftover data.

> Platform note: The script installs Docker automatically on Ubuntu/Debian. On macOS or Windows, install Docker Desktop manually; the script will still manage the container lifecycle.

Login E2E Test – Sequence Diagram

```mermaid
sequenceDiagram
    participant User as Cypress Test
    participant Frontend as Angular App (port 4200)
    participant Backend as Spring Boot (port 3000)
    participant MongoDB as MongoDB Container

    User->>Frontend: cy.visit('/login')
    Frontend->>User: Login page loads
    User->>Frontend: Type email & password, click "Sign in"
    Frontend->>Backend: POST /api/auth/login
    Backend->>MongoDB: Find user by email
    MongoDB-->>Backend: User document
    Backend-->>Frontend: JWT token + user data
    Frontend->>Frontend: Store token in localStorage
    Frontend->>User: Redirect to /events
    User->>Frontend: cy.url().should('include', '/events')
    Frontend->>Backend: GET /api/events?page=0&size=1000
    Backend->>MongoDB: Find events
    MongoDB-->>Backend: Events list
    Backend-->>Frontend: Events JSON
    Frontend->>User: Render event cards
    User->>Frontend: cy.get('.event-card').should('have.length.at.least', 1)
```

---

### Option 2: Manual run against your local development stack

If you already have the backend and frontend running locally (e.g., via `local-dev.sh` or manual commands), you can run Cypress directly without the disposable script.

Prerequisites:

- Backend running on `http://localhost:3000` (e.g., `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`)

Frontend running on `http://localhost:4200` (e.g., ng serve)

The frontend’s `environment.ts` must point to the backend URL (`http://localhost:3000/api` – default for `ng serve`)

Run Cypress:

```bash
cd frontend
npx cypress open      # interactive mode (Cypress Test Runner)
# or
npx cypress run       # headless mode (CI style)
```

> Note: This manual mode uses your existing development database. For a completely isolated, repeatable test run, use Option 1 instead.

---

## CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration and deployment. On every push to the `main` branch:

1. **Backend unit/integration tests** – runs `./backend/run-tests.sh` (spins up a disposable MongoDB container, executes Maven tests, cleans up).
2. **Frontend unit tests** – runs `ng test` in headless Chrome.
3. **End‑to‑end (Cypress) tests** – runs `./run-e2e-tests.sh` (full isolated stack: MongoDB container, backend JAR, frontend `ng serve`, seeds test data, runs all specs, then destroys everything).
4. **Deployment** – if all tests pass:
    - Backend JAR is deployed to Azure App Service.
    - Frontend build is uploaded to Azure Storage static website.

All test containers and processes are automatically cleaned up, even on failure.  
See the workflow file: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---