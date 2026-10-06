# Weather API Wrapper Service

[Roadmap Project](https://roadmap.sh/projects/weather-api-wrapper-service)

![Weather App Frontend](react/public/project_frontend.png)

A weather API wrapper service that fetches real-time forecasts from a 3rd-party weather provider ([Visual Crossing](https://www.visualcrossing.com/weather-api)) and caches responses in an in-memory [Redis](https://redis.io/) cache to minimize external network calls, prevent rate limiting, and deliver low-latency responses.

Built as a full-stack solution for the [roadmap.sh Weather API Wrapper Service](https://roadmap.sh/projects/weather-api-wrapper-service) project.

---

## 📌 Project Overview & Description

Instead of relying on self-hosted weather datasets, modern web applications consume external weather providers. This project demonstrates core backend and full-stack patterns:

1. **3rd-Party API Consumption**: Integrates with Visual Crossing's Timeline Weather API using Spring Boot's non-blocking `WebClient`.
2. **In-Memory Caching with Redis**: Implements cache-aside semantics via Spring Cache (`@Cacheable`), using the requested city or country as the cache key to serve repeated requests without hitting external API quotas.
3. **Secure Environment Variables**: Protects sensitive API credentials and configurable connection hosts via external environment variables (`.env`).
4. **Interactive React UI**: Features search with quick-select city chips, dynamic condition-based weather icons, and Celsius temperature formatting.
5. **Container Orchestration**: Fully containerized using Docker Compose for 1-step deployment (Redis + Spring Boot API + React frontend).

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot 4, Spring WebFlux (`WebClient`), Spring Data Redis, Jackson |
| **Caching** | Redis 7 (`redis:7-alpine`) |
| **Frontend** | React 19 / 18, Vite, CSS |
| **External API** | [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🏗️ Architecture & How It Works

```
[ User / React UI ]
        │
        ▼
[ Spring Boot API (port 8080) ]
        │
        ├──────── Check Cache ───────► [ Redis Cache (port 6379) ]
        │                                       │
        │   Cache Hit: Return instantly         │
        ◄───────────────────────────────────────┘
        │
        ▼ Cache Miss
[ Visual Crossing 3rd-Party API ]
        │
        ├─── Save result in Redis ───► [ Redis Cache ]
        │
        └─── Return payload to client
```

1. A user enters a city or clicks a suggestion chip in the React frontend.
2. The UI sends a request to `/api/{city}` (proxied to backend `http://localhost:8080/{city}`).
3. The Spring controller checks the Redis cache (`weather_single::<city>`).
   - **Cache Hit**: Returns the cached JSON payload immediately.
   - **Cache Miss**: Calls Visual Crossing's Timeline API via `WebClient`, stores the result in Redis, and returns the response.

---

## 🔌 API Reference

### `GET /{place}`

Returns today's weather conditions for a given city or location.

**Request:**
```http
GET http://localhost:8080/Hyderabad
```

**Response (`200 OK`):**
```json
{
  "datetime": "2026-10-06",
  "humidity": 59.0,
  "city": "Hyderabad, TS, India",
  "temp": 80.0,
  "icon": "partly-cloudy-day"
}
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Description | Default |
|---|---|---|
| `VISUAL_CROSSING_API` | Your Visual Crossing API key (**required**) | `""` |
| `SPRING_DATA_REDIS_HOST` | Redis server hostname | `localhost` (Docker: `redis`) |
| `SPRING_DATA_REDIS_PORT` | Redis server port | `6379` |

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/) (recommended) **OR**
- Java 21+, Maven (`mvnw` included), Node.js 18+, and a running Redis instance.

---

### Option 1: Run with Docker Compose (Fastest)

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd weather-spring
   ```

2. Configure your environment:
   ```bash
   cp .env.example .env
   # Add your Visual Crossing API key inside .env
   ```

3. Start all services (Redis, Backend, Frontend):
   ```bash
   docker compose up --build
   ```

4. Access the applications:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080/London](http://localhost:8080/London)

---

### Option 2: Run Locally

#### 1. Start Redis
```bash
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

#### 2. Start the Spring Boot Backend
```bash
cd backend
export VISUAL_CROSSING_API="your_api_key_here"  # Windows PowerShell: $env:VISUAL_CROSSING_API="your_api_key_here"
./mvnw spring-boot:run                          # Windows: .\mvnw.cmd spring-boot:run
```
The API starts at [http://localhost:8080](http://localhost:8080).

#### 3. Start the React Frontend
```bash
cd ../react
npm install
npm run dev
```
The UI starts at [http://localhost:5173](http://localhost:5173) (configured with Vite proxy to `http://localhost:8080`).

---

## 📂 Project Structure

```
weather-spring/
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Controllers, configs, DTOs, and Redis configuration
│   └── src/main/resources/   # application.properties
├── react/                    # React + Vite application
│   ├── public/               # Static assets & screenshots
│   └── src/                  # React components (WeatherIcon, App, styles)
├── docker-compose.yml        # Multi-container orchestration
├── compose.yaml              # Docker Desktop compose configuration
├── .env.example              # Environment variables template
└── README.md                 # Project documentation
```
