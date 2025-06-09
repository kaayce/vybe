
# Setup

## 1. Clone & Install Dependencies

1. Copy `.env.example` to `.env` in both:
   - `packages/client/.env`
   - `packages/server/.env`

   Update these `.env` files with real values:
   - `EXTRNODE_API_KEY`
   - `REDIS_URL`
   - `COINGECKO_API_KEY` [API key setup guide](https://docs.coingecko.com/v3.0.1/reference/setting-up-your-api-key).
2. Install all dependencies:

   ```bash
   pnpm install
   ```

## 🧪 Development Environment

To run the app locally with live reloading:

1. Start the **Redis** container:

   ```bash
   make up-dev
   ```

2. Start the **frontend** and **backend** in dev mode:

   ```bash
   pnpm dev
   ```

- **Frontend** (Vite/React): [http://localhost:3001](http://localhost:3001)
- **Backend** (Hono API): [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Production Build with Docker

To build and run the entire app (frontend + backend + Redis) in production mode:

1. Build and start the full stack:

   ```bash
   make up
   ```

2. The Docker setup will:

   - Build the client with Vite
   - Build the backend with Hono
   - Serve static frontend assets from the backend server
   - Connect to Redis for caching

- **Production Backend with embedded frontend** is served on: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:3000/](http://localhost:3000/)
- API: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

---

### 🧪 Testing

To run the tests:

```bash
pnpm test
```

---

## 🧼 Stop & Clean

- Stop development containers:

  ```bash
  make down-dev
  ```

- Stop production containers:

  ```bash
  make down
  ```

- Cleanup all containers and volumes:

  ```bash
  make clean
  ```

---
