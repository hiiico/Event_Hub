# EventHub Backend

 Spring Boot REST API for EventHub – event discovery, RSVP, comments, and JWT authentication.

---

## Tech Stack
- Java 17
- Spring Boot 3.2.3
- Spring Data MongoDB
- Spring Security (JWT)
- Maven
- MongoDB Atlas

## Project Structure

```
backend/
├── pom.xml
├── src/
│ └── main/
│ ├── java/com/eventhub/
│ │ ├── EventHubApplication.java
│ │ ├── controller/
│ │ │ ├── AuthController.java
│ │ │ ├── EventController.java
│ │ │ └── HealthController.java
│ │ ├── dto/ # Request/response DTOs
│ │ ├── model/ # MongoDB documents (User, Event, Comment)
│ │ ├── repository/ # Spring Data MongoDB repositories
│ │ ├── security/ # JWT, SecurityConfig, filters
│ │ └── service/ # Business logic
│ └── resources/
│ └── application.properties
```

## Running Locally

### Prerequisites
- Java 17, Maven
- MongoDB Atlas account (or local MongoDB)

### Configuration

Create `src/main/resources/application-dev.properties` (do not commit) with:

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<app>
jwt.secret=<your-secret>
```

Or set environment variables: `MONGODB_USERNAME`, `MONGODB_PASSWORD`, `JWT_SECRET`.

### Run
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```
The API will be available at [http://localhost:3000](http://localhost:3000).

## Backend API Endpoints

| Method | Endpoint                     | Description                             | Auth Required |
|--------|------------------------------|-----------------------------------------|:-------------:|
| GET    | `/`                          | Health check – returns OK               |      No       |
| POST   | `/api/auth/register`         | Register a new user                     |      No       |
| POST   | `/api/auth/login`            | Login – returns JWT token               |      No       |
| GET    | `/api/events`                | List all events (paginated)             |      No       |
| GET    | `/api/events/{id}`           | Get event details                       |      No       |
| POST   | `/api/events`                | Create a new event                      |      Yes      |
| PUT    | `/api/events/{id}`           | Update an event (owner only)            |      Yes      |
| DELETE | `/api/events/{id}`           | Delete an event (owner only)            |      Yes      |
| POST   | `/api/events/{id}/rsvp`      | Toggle RSVP status                      |      Yes      |
| POST   | `/api/events/{id}/comments`  | Add a comment to an event               |      Yes      |
| GET    | `/api/events/user/created`   | Events created by the logged‑in user    |      Yes      |
| GET    | `/api/events/user/attending` | Events the logged‑in user is attending  |      Yes      |
| GET    | `/api/users/me`              | Get current user profile                |      Yes      |
| PUT    | `/api/users/me`              | Update user profile (name, email)       |      Yes      |

## Environment Variables

| Variable                | Description                    |    Default     |
|-------------------------|--------------------------------|:--------------:|
| SPRING_DATA_MONGODB_URI | Full MongoDB connection string |       -        |
| MONGODB_USERNAME        | MongoDB Atlas username         |       -        |
| MONGODB_PASSWORD        | MongoDB Atlas password         |       -        |
| JWT_SECRET              | JWT signing secret             | mySecretKey... |
| WEBSITES_PORT           | Azure App Service port         |      3000      |

## Deployment to Azure

The backend is deployed as a JAR to Azure App Service via GitHub Actions.
Set the environment variables in the App Service configuration.

### Health Check

Endpoints `/` and `/robots933456.txt` return `OK` to satisfy Azure health probes.