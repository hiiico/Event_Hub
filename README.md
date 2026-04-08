# EventHub 

#### Full‑Stack Event Management Application

---

## Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Development Roadmap](DEVELOPMENT_ROADMAP.md)

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
