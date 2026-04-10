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

## Quick Start

- Backend detailed setup in [backend/README.md](backend/README.md#running-locally).
- Frontend detailed setup in [frontend/README.md](frontend/README.md#running-locally).

#### The backend is already deployed on Azure, test it at [https://eventhub-backend.azurewebsites.net](https://eventhub-backend.azurewebsites.net). You can run the frontend locally, and it will connect to this live backend.

Quick command:
```bash
cd frontend
npm install
npm start
```

#### Optional – Run backend locally (if you prefer to run your own backend instance):

> Note: The frontend uses the Azure backend URL by default (see [frontend/src/environments/environment.prod.ts](frontend/src/environments/environment.prod.ts)).
For local development with a local backend, change `environment.prod.ts` to point to `http://localhost:3000/api`.

Open [http://localhost:4200](http://localhost:4200)

---

## Testing

- [Backend](backend/README.md#running-tests)

- [Frontend](frontend/README.md#running-tests)

### Running E2E Tests (Full Stack)

The project also includes an end‑to‑end test script that starts a disposable MongoDB container, builds and runs the backend, serves the frontend, executes all Cypress tests, and cleans up everything afterward.

```bash
./run-e2e-tests.sh
```

#### What the script does automatically:

- 🐳 Installs Docker (if missing – works on Ubuntu/Debian)
- 🔄 Starts the Docker daemon (if not already running)
- 🗄️ Creates a fresh MongoDB container named mongodb-e2e (replica set enabled)
- 🔧 Builds the backend (mvn clean package -DskipTests) and starts it on port 3000 with the e2e profile
- 🌐 Starts the Angular frontend (ng serve) on port 4200
- ⏳ Waits for both services to become responsive
- 🧪 Runs all Cypress E2E tests from frontend/cypress/e2e/
- 🧹 Stops the backend, frontend, and removes the MongoDB container (no leftovers)

All E2E tests run against a real MongoDB instance and a fully functional backend + frontend, ensuring maximum reliability.

> Note: The script assumes a Linux environment (Ubuntu/Debian) for Docker installation. On macOS or Windows, install Docker Desktop manually; the script will still manage the container lifecycle.
The backend is expected to run on port 3000 and the frontend on port 4200. Adjust the script if your setup uses different ports.

If you prefer to run Cypress tests against an already running backend (e.g., your development backend), you can execute the tests directly:

```bash
ng serve   # in one terminal
# In another terminal:
npx cypress open   # interactive mode
# or
npx cypress run    # headless mode
```

Make sure the backend is running and the environment variables (API URL) are correctly configured (e.g., in `src/environments/environment.ts`).


---