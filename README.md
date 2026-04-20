<div align="center">

# 🏢 Acquisitions API

### Production-grade REST API for buying and selling SaaS businesses  
Built with a full **DevSecOps CI/CD pipeline**, **GitOps deployment**, and **real-time observability**

<br/>

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)

![Trivy](https://img.shields.io/badge/Trivy-1904DA?style=for-the-badge&logo=aquasecurity&logoColor=white)
![SonarCloud](https://img.shields.io/badge/SonarCloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

<br/>

> This project demonstrates a **complete DevOps lifecycle** — from local development  
> through automated security gates, GitOps deployment, and production monitoring.

</div>

---

## 📌 Table of Contents

<details>
<summary>Click to expand</summary>

- [About the Project](-#about-the-project)
- [Architecture](-#-architecture)
- [Tech Stack](-#-tech-stack)
- [CI/CD Pipeline](-#-cicd-pipeline)
- [GitOps Deployment](#-gitops-deployment)
- [Monitoring & Alerting](#-monitoring--alerting)
- [API Endpoints](#-api-endpoints)
- [Getting Started Locally](#-getting-started-locally)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Testing](#-testing)
- [What I Learned](#-what-i-learned)

</details>

---

## 🏢 About the Project

The **Acquisitions API** is a backend platform for buying and selling SaaS businesses. It handles user authentication, business listing management, and deal tracking — but the real focus of this project is the **DevOps infrastructure** built around it.

This project was designed to answer one question: **what does a real production deployment pipeline actually look like?**

The answer involves five layers working together:

1. **Application** — A Node.js REST API with JWT auth, role-based access control, Zod validation, and structured logging
2. **CI** — GitHub Actions pipeline with security gates (Trivy + SonarCloud) that block bad code before it ships
3. **CD** — ArgoCD doing GitOps: Git is the only source of truth, and any manual cluster changes are automatically reverted
4. **Infrastructure** — Kubernetes with rolling deployments, health probes, and resource limits
5. **Observability** — Prometheus scraping custom metrics, Grafana dashboards, and Alertmanager sending Slack notifications

---

## 🏗️ Architecture

### CI/CD + GitOps Pipeline

<img width="2242" height="405" alt="diagram-export-4-20-2026-5_52_01-PM" src="https://github.com/user-attachments/assets/4617f3b6-5cba-47a8-b51a-d0d076b578a1" />
<br>

> 🔗 **GitOps repo:** [acquisitions-gitops](https://github.com/himanshu2604/acquisitions-gitops)  
> All Kubernetes manifests and Helm values live there — not here.

---

## 🛠️ Tech Stack

| Category | Tool | Purpose |
|---|---|---|
| **Runtime** | Node.js 20 + Express | Backend API framework |
| **Language** | TypeScript | Type safety across the codebase |
| **Database** | Neon DB (Serverless Postgres) | Cloud-hosted PostgreSQL |
| **ORM** | Drizzle ORM | Type-safe queries and migrations |
| **Auth** | JWT + bcrypt | Token-based auth and password hashing |
| **Validation** | Zod | Request schema validation |
| **Logging** | Winston + Morgan | Structured app logs + HTTP request logs |
| **Security** | Helmet + CORS + Arcjet | HTTP headers, cross-origin, bot protection |
| **Metrics** | prom-client | Exposes `/metrics` for Prometheus |
| **CI/CD** | GitHub Actions | Automated pipeline (lint → scan → deploy) |
| **Security Gates** | Trivy + SonarCloud | CVE scanning + SAST code analysis |
| **Containers** | Docker (multi-stage) | Optimised production images |
| **Orchestration** | Kubernetes | Scaling, rolling updates, self-healing |
| **GitOps** | ArgoCD | Declarative CD with drift detection |
| **Monitoring** | Prometheus + Grafana | Metrics collection and dashboards |
| **Alerting** | Alertmanager | Slack notifications on alert rules |
| **Testing** | Jest + Supertest | Unit and integration tests |
| **Code Quality** | ESLint + Prettier | Linting and formatting |

---

## ⚙️ CI/CD Pipeline

The pipeline has **4 sequential stages**. Each stage must pass before the next one runs. If any stage fails, the image is never pushed to Docker Hub.

<img width="1614" height="637" alt="diagram-export-4-20-2026-5_52_35-PM" src="https://github.com/user-attachments/assets/2d00c311-ded5-40db-85d4-ed45d4b4f609" />
<br>

**Why two security gates?**

- **Trivy** catches vulnerabilities in the OS packages and npm dependencies of your *built image* — things you didn't write but ship with your app
- **SonarCloud** catches security issues in *your own code* — hardcoded secrets, SQL injection risks, insecure patterns

Neither can catch what the other catches. You need both.

---

## 🔄 GitOps Deployment

This project uses a **two-repo GitOps pattern**:

| Repo | Contains | Who writes to it |
|---|---|---|
| `acquisitions-api` (this repo) | Application code + Dockerfile + CI pipeline | Developers |
| `acquisitions-gitops` | Kubernetes YAML manifests only | CI bot (automated) |

**Why separate repos?**

When the CI pipeline passes all gates, it commits the new Docker image tag to `acquisitions-gitops`. ArgoCD watches that repo and deploys the change automatically.

This means:
- **Git is always the source of truth** — not the CI runner, not someone's terminal
- **Drift detection** — if anyone manually changes the cluster (e.g. scales down replicas), ArgoCD detects the divergence and automatically restores it within minutes
- **Full audit trail** — every deployment is a Git commit with a message and author

> I tested drift detection by manually scaling the deployment to 1 replica.  
> ArgoCD restored it to 3 replicas automatically within 3 minutes.

---

## 📊 Monitoring & Alerting

### How it works

The API exposes a `/metrics` endpoint via `prom-client`. Prometheus scrapes it every 15 seconds. Grafana visualises the data.

### Custom metrics exposed

| Metric | Type | Description |
|---|---|---|
| `http_requests_total` | Counter | Every request labelled by method, route, status |
| `http_request_duration_seconds` | Histogram | Request duration with percentile buckets |
| `process_heap_bytes` | Gauge | Node.js heap usage (auto-collected) |
| `nodejs_eventloop_lag_seconds` | Gauge | Event loop lag (auto-collected) |

### Grafana dashboards

| Dashboard | ID | Shows |
|---|---|---|
| Kubernetes Cluster | `315` | Node CPU/memory, pod counts |
| ArgoCD Status | `14584` | Sync health, deployment history |
| Node.js API | `11159` | Request rate, heap, event loop |
| **Custom API dashboard** | — | Req/s, P95 latency, error rate % |

### Alert rules

| Alert | Trigger | Severity |
|---|---|---|
| `AcquisitionsPodCrashLooping` | Pod restarts > 3 in 2 min | Critical |
| `AcquisitionsHighCPU` | CPU > 80% for 5 min | Warning |
| `AcquisitionsHighErrorRate` | 5xx rate > 5% for 2 min | Critical |

Alerts fire to **Slack** via Alertmanager.

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | Public |
| `POST` | `/api/auth/signin` | Login and receive JWT cookie | Public |
| `POST` | `/api/auth/signout` | Logout and clear session | Required |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/users` | Get all users | Admin only |
| `GET` | `/api/users/:id` | Get user by ID | Required |
| `PUT` | `/api/users/:id` | Update user profile | Owner or Admin |
| `DELETE` | `/api/users/:id` | Delete user | Admin only |

### Business Listings [Working on this feature !!!]

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/listings` | Get all active listings | Public |
| `GET` | `/api/listings/:id` | Get listing by ID | Public |
| `POST` | `/api/listings` | Create new listing | Required |
| `PUT` | `/api/listings/:id` | Update listing | Owner or Admin |
| `DELETE` | `/api/listings/:id` | Delete listing | Owner or Admin |

### System

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns status + timestamp |
| `GET` | `/metrics` | Prometheus metrics endpoint |

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- A [Neon DB](https://neon.tech) account (free)
- An [Arcjet](https://arcjet.com) account (free)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/himanshu2604/acquisitions-api.git
cd acquisitions-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in all values in .env (see below)

# 4. Run database migrations
npm run db:migrate

# 5. Start the development server
npm run dev
# API running at http://localhost:3000
```

### Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@host/dbname
JWT_SECRET=minimum_32_character_random_string
ARCJET_KEY=your_arcjet_api_key
COOKIE_SECRET=another_random_secret
```

### Using Docker Compose

```bash
# Start with Docker Compose (recommended)
docker-compose up

# Or build and run the Docker image directly
docker build -t acquisitions-api .
docker run -p 3000:3000 --env-file .env acquisitions-api
```

---

## 📁 Project Structure

```
acquisitions-api/
├── src/
│   ├── config/          # DB connection, app config
│   ├── controllers/     # Route handlers (thin layer — calls services)
│   ├── middleware/      # Auth, validation, rate limiting, metrics
│   ├── models/          # Drizzle ORM schemas
│   ├── routes/          # Express router definitions
│   ├── services/        # Business logic
│   ├── utils/           # Logger, JWT helpers, prom-client metrics
│   └── validations/     # Zod request schemas
├── tests/               # Jest + Supertest test suites
├── .github/
│   └── workflows/       # Full CI/CD pipeline
│       ├── docker-and-trivy.yml
│       ├── lint-and-format.yml
│       └── tests.yml
├── kubernetes/          # Local K8s reference manifests
├── Dockerfile           # Multi-stage build
├── docker-compose.yml   # Local development stack
├── screenshot/          # Video + screenshots
└── sonar-project.properties
```

---

## 🔒 Security

| Layer | Tool | Protection |
|---|---|---|
| HTTP Headers | Helmet | XSS, clickjacking, MIME sniffing |
| Cross-Origin | CORS | Controlled cross-origin access |
| Bot Protection | Arcjet | Real-time bot detection and blocking |
| Rate Limiting | Arcjet | Per-route request throttling |
| Authentication | JWT + bcrypt | Secure sessions, hashed passwords |
| Input Validation | Zod | All request bodies validated |
| CVE Scanning | Trivy (CI gate) | Container vulnerabilities blocked before deploy |
| Code Analysis | SonarCloud (CI gate) | Security hotspots in source code |
| Container | Non-root USER | App runs as unprivileged user in Docker |

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test -- --coverage

# Run in watch mode
npm run test -- --watch
```

Tests cover:
- ✅ Auth flows — signup, signin, signout, invalid credentials
- ✅ Protected route enforcement
- ✅ Input validation error responses
- ✅ User CRUD with role-based access
- ✅ Business listings CRUD
- ✅ Health check endpoint

---

## 💡 What I Learned

> These are the real lessons — not just "I used Docker".

- **Why GitOps is safer than `kubectl` in a pipeline** — When a CI runner applies manifests directly, the cluster state lives in an ephemeral job. With GitOps, every change is a Git commit. The cluster always reflects what's in Git, and any deviation is automatically corrected.

- **The difference between livenessProbe and readinessProbe** — Liveness restarts a container that is deadlocked. Readiness removes a pod from the load balancer during startup or when it's overwhelmed. You need both, and they serve completely different purposes.

- **How Trivy catches what SonarCloud misses (and vice versa)** — Trivy finds CVEs in your dependencies and OS packages at the image level. SonarCloud finds insecure patterns in your own source code. Neither tool overlaps. Both are necessary.

- **What drift detection actually means in practice** — It's not just a feature. It's a guarantee that your cluster state will always match your Git repo, even if someone panics and runs `kubectl` commands in production at 2am.

- **How PromQL queries work** — `rate()` for per-second rates, `histogram_quantile()` for percentile latency, label selectors to filter by your app. Writing these from scratch is the difference between reading dashboards and building them.

- **Why multi-stage Docker builds matter for security** — The builder stage installs dev dependencies and compiles TypeScript. The production stage copies only `dist/` and `node_modules`. The attack surface shrinks significantly because build tools never ship to production.

---

## 📄 License

This project is for educational and portfolio purposes.

---

<div align="center">

**🔗 Related repo:** [acquisitions-gitops](https://github.com/himanshu2604/acquisitions-gitops) — K8s manifests and Helm values

*Built by Himanshu as a DevOps portfolio project*

</div>
