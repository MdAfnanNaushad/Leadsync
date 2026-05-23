# Leadsync — Multi-Role Lead Management Engine

**Leadsync** is a lightweight, role-based Lead Management SaaS platform built to help enterprise business teams track, organize, and qualify potential customer pipelines in real-time.

Decoupling data access from network processing, this ecosystem leverages a strict **MERN Architecture (TypeScript)** featuring dynamic server-side aggregate pagination filtering, automated security access tokens, custom UI text debouncing, and lightweight streaming data extractions.

---

## ⚡ Core Business Architecture Features

* **Multi-Property Live Text Search:** Processes partial matching indexes across `Name` or `Email` properties concurrently.
* **Asynchronous Server Pagination Engine:** Dynamically calculates page offsets, limit ranges, page availability vectors, and database record scopes using high-performance parallel `Promise.all` aggregations.
* **Dynamic Multi-Filtering Matrix:** Supports combined filtering queries using custom transactional system parameters (`Status` and `Source`).
* **Cryptographic Token Verification Gateways:** Secures endpoints using signature verified JSON Web Tokens (JWT) bound directly to custom extended Express lifecycle request streams.
* **Role-Based Access Control (RBAC):** Strict operational isolation restricting destructive write operations (like `Delete`) exclusively to administrative authorization tiers.
* **High-Performance Client Debouncing:** Prevents server query fatigue during live text inputs using an optimized custom hook delay threshold.
* **Streaming Binary Blob Extraction:** Captures active filtered collections and streams string-escaped CSV spreadsheets natively down to the client file system.
* **Global Theme Configuration Engine:** Fully responsive layouts with native Dark Mode utility matching modern user interface presentation guidelines.

---

## 🏗️ System Workspace Directory Tree

```text
Leadsync/
├── server/                     # Backend API Node Service
│   ├── src/
│   │   ├── constants/          # Structural Enums & Constants
│   │   ├── controllers/        # HTTP Request Context Handlers
│   │   ├── middleware/         # Security Guards & Request Validation
│   │   ├── models/             # Strict Mongoose Document Schemas
│   │   ├── repositories/       # Isolated Data Access Database Layers
│   │   ├── routes/             # API Router Mapping Pipelines
│   │   ├── utils/              # Async Helpers & Operational Errors
│   │   ├── validators/         # Structural Request Body Validation (Zod)
│   │   └── app.ts              # System Main Application Core
└── client/                     # Frontend Client Application
    ├── src/
    │   ├── context/            # Global Security & Theme State Providers
    │   ├── features/           # Feature-Bound UI Form Views & Layouts
    │   ├── hooks/              # Custom Optimization Performance Hooks
    │   ├── layouts/            # Navigation Shell Workspace Controls
    │   ├── routes/             # Client Routing Gatekeeper Components
    │   ├── services/           # Interceptor Bound Axios Network API Clients
    │   └── types/              # Unified TypeScript Property Formats

```

---

## 🛠️ Environmental Configurations Deployment

### 1. Backend API Service Configuration

Create a file named **`server/.env`** and populate it with the following configuration:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/leadsync
JWT_SECRET_KEY=YOUR_ENTERPRISE_SIGNING_KEY_STRING_HERE
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

```

### 2. Frontend React Client Configuration

Create a file named **`client/.env`** and populate it with the following configuration:

```text
VITE_API_BASE_URL=http://localhost:5000/api/v1

```

---

## 🚀 Step-by-Step Local Deployment Routine

Before launching, ensure you have an active local MongoDB instance running on your host environment (`net start MongoDB`).

### 📡 Launching the Backend REST API Engine

Open a clean standalone terminal terminal node in your root path:

```powershell
cd server
npm install
npm run dev

```

*The endpoint gateway will launch and hot-reload securely at `http://localhost:5000/api/v1/`.*

### 🎨 Launching the Frontend User Interface

Open a second isolated terminal window:

```powershell
cd client
npm install
npm run dev

```

*The development server will boot instantly, exposing a local UI link at `http://localhost:5173/`.*

---

## 📊 Standard Operational REST API Reference Map

| HTTP Method | Route Gateway URI | Security Clearance Required | Operational Task Description |
| --- | --- | --- | --- |
| **POST** | `/api/v1/auth/register` | Open (Public Access Node) | Registers a fresh user profile + issues signed token. |
| **POST** | `/api/v1/auth/login` | Open (Public Access Node) | Validates credentials and initializes standard session. |
| **GET** | `/api/v1/leads` | Token Required (`Admin` / `Sales User`) | Retrieves dynamic paginated, filtered collections. |
| **GET** | `/api/v1/leads/export` | Token Required (`Admin` / `Sales User`) | Streams targeted collection parameters as custom raw CSV data. |
| **POST** | `/api/v1/leads` | Token Required (`Admin` / `Sales User`) | Validates and appends a fresh lead directly to MongoDB. |
| **PATCH** | `/api/v1/leads/:id` | Token Required (`Admin` / `Sales User`) | Runs validation checks and alters matching record details. |
| **DELETE** | `/api/v1/leads/:id` | Token Required + **`Admin` Only** | Permanently purges target record index from storage. |

---

## 🔒 Rigorous Compile Validation Commands

To check the strict typing constraints across both tiers, execute the following syntax trees within your active directories:

```powershell
# Run validation check inside server workspace
cd server && npx tsc --noEmit

# Run validation check inside client workspace
cd ../client && npx tsc --noEmit

```

---

## 📄 License and Compliance Core

Distributed as an educational workspace deployment archetype. All database handling code, state machines, and view properties conform directly to enterprise standard clean-code development paradigms.
