# 🚀 Secure & Fast Local LLM Inference Service

### (Turborepo Monorepo Architecture)

A secure, low-latency local LLM inference API built with:

* 🧠 Local LLM (Ollama / vLLM compatible)
* 🔐 JWT Authentication
* ⚡ Rate Limiting
* 📊 Latency Tracking (avg + p95)
* 🧾 Structured Logging
* 🐳 Dockerized Deployment
* 🧩 Turborepo Monorepo Architecture

---

# 🏗 Monorepo Architecture

This project uses **Turborepo** for modular and scalable architecture.

```
.
├── apps/
│   └── api/                 # Express API server
│       ├── src/
│       │   ├── routes/
│       │   ├── middleware/
|       |   ├── warmup-model/
│       │   ├── metrics-service/
|       |   ├── connectDb.ts/
|       |   ├── index.ts/
│       │   ├── ollamaConfig.ts/
|       |   ├── rateLimiter.ts/
│     
│
├── packages/
│   ├── db/                  # MongoDB models & DB logic
│   │   └── src/
│   │       └── userModel.ts
│   │
│   └── common/              # Shared utilities
│       └── src/
│           └── validation.ts
│
├── package.json
├── Dockerfile
├── turbo.json
└── README.md
```

---

# 🧩 Package Responsibilities

## 📦 `apps/api`

Main backend service:

* REST API routes
* Authentication middleware
* Rate limiting
* Latency measurement
* Logging
* LLM integration (Ollama)

---

## 📦 `packages/db`

Contains:

```
packages/db/src/userModel.ts
```

Responsibilities:

* MongoDB connection logic
* User schema definition
* User-related DB operations

This keeps DB logic isolated from API logic.

---

## 📦 `packages/common`

Contains:

```
packages/common/src/validation.ts
```

Responsibilities:

* Zod/Joi validation schemas
* Request body validation
* Shared types/utilities

This ensures:

* DRY validation logic
* Clean separation of concerns
* Reusable validation across services

---

# 🧠 How Everything Connects

```
Client
   │
   ▼
apps/api
   │
   ├── uses → packages/common (validation)
   ├── uses → packages/db (User Model)
   │
   ▼
Local LLM (Ollama)
```

Monorepo benefit:

* Clean boundaries
* Reusable packages
* Scalable to multiple services

---

# 🛠 Local Development Setup

---

## 1️⃣ Install Dependencies (root)

```bash
npm install
```

Turborepo will link internal packages automatically.

---

## 2️⃣ Start MongoDB

```bash
docker run -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=supersecret \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  -d mongodb/mongodb-community-server:latest
```

---

## 3️⃣ Install & Start Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run mistral
```

Keep Ollama running at:

```
http://localhost:11434
```

---

## 4️⃣ Create `.env` inside `apps/api`

```
MONGOOSE_URL=mongodb://admin:supersecret@localhost:27017/mydb?authSource=admin
jwt_secret=mySecretjwt
OLLAMA_HOST=http://localhost:11434
PORT=8000
```

---

## 5️⃣ Run API via Turborepo

From root:

```bash
npx turbo run dev --filter=api
```

Server runs at:

```
http://localhost:8000
```

---

# 🐳 Docker Setup (Monorepo-Aware)

Because this is a monorepo, Docker builds only `apps/api` but installs workspace dependencies.

---

## Step 1 — Build Image (from root)

```bash
docker build -t inference-service .
```

---

## Step 2 — Run MongoDB

```bash
docker run -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=supersecret \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  -d mongodb/mongodb-community-server:latest
```

---

## Step 3 — Run API Container

```bash
docker run \
  --add-host=host.docker.internal:host-gateway \
  -e OLLAMA_HOST=http://host.docker.internal:11434 \
  -e MONGOOSE_URL='mongodb://admin:supersecret@host.docker.internal:27017/mydb?authSource=admin' \
  -e jwt_secret=mySecretjwt \
  -p 8000:8000 \
  inference-service
```

---

# 🔐 Authentication Flow

---

## 📝 Sign Up

`POST /user/signup`

```json
{
  "name": "Om Sharma",
  "email": "omsharma.8e31@gmail.com",
  "password": "Password@042"
}
```

Response:

```json
{
  "msg": "SignUp Successful! Log in.."
}
```

---

## 🔑 Sign In

`POST /user/signin`

```json
{
  "email": "omsharma.8e31@gmail.com",
  "password": "Password@042"
}
```

Response:

```json
{
  "authToken": "<JWT_TOKEN>",
  "msg": "Login Successful!"
}
```

---

# 🚀 Inference Endpoint

`POST /inference/v1/infer`

```bash
curl -X POST http://localhost:8000/inference/v1/infer \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Give me a short story about AI and trust."}'
```

Response:

```json
{
  "msg": "...generated text...",
  "latency": {
    "totalMs": 3705.11,
    "modelMs": 3705.11,
    "overheadMs": 0.0007
  }
}
```

---

# 📊 Metrics Endpoint

`GET /metrics`

```json
{
  "totalRequests": 4,
  "avgLatency": 3690.69,
  "p95Latency": 4020.77
}
```

---

# 📈 Latency Design

Each request tracks:

| Metric     | Description         |
| ---------- | ------------------- |
| totalMs    | Full request time   |
| modelMs    | LLM inference time  |
| overheadMs | API processing time |

Goal:

```
API overhead < 300ms
```

Current logs show:

```
overheadMs ≈ ~0.002ms
```

Extremely optimized request handling.

---

# 🧾 Structured Logging

Each inference logs:

```json
{
  "userId": "69a40f095136ced07b62568c",
  "promptLength": 35,
  "totalMs": 3705.11,
  "modelMs": 3705.11,
  "overheadMs": 0.0007,
  "status": "success"
}
```

Logged data includes:

* User ID
* Prompt length
* Latency breakdown
* Success/failure status

---

# 🛡 Security Measures

* JWT expiry enforced
* Middleware-based authentication
* Rate limiting (10 requests/min per user)
* Validation via shared `packages/common`
* DB logic isolated in `packages/db`
* Structured error handling

Invalid token → `401 Unauthorized`

---

# 🎯 Why Monorepo?

Using Turborepo allows:

* Clear separation of concerns
* Shared validation logic
* Scalable multi-service architecture
* Independent package builds
* Faster incremental builds

Future scaling example:

```
apps/
  api/
  worker/
  admin-panel/

packages/
  db/
  common/
  auth/
  logger/
```

---

# 📌 Future Improvements

* Streaming token generation
* Redis caching layer
* Prometheus metrics export
* GPU vLLM integration
* Model warmup on boot
* Distributed inference scaling

---

# 🧠 Evaluation Mapping

| Criteria          | Implementation                     |
| ----------------- | ---------------------------------- |
| Authentication    | JWT with expiry + middleware       |
| Latency           | Measured & separated               |
| Model Integration | Local LLM via Ollama               |
| Code Quality      | Monorepo modular architecture      |
| Deployment        | Dockerized                         |
| Monitoring        | Structured logs + metrics endpoint |

---

# ✨ Summary

This project demonstrates:

* Secure API design
* Local LLM integration
* Low-latency request handling
* Production-ready monorepo architecture
* Observability and performance tracking
* Docker reproducibility


