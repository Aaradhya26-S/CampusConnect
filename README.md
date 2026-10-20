# Campus Connect — University Issue and Complaint Management System

[![CI Pipeline](https://github.com/campus-connect/campus-connect/actions/workflows/ci.yml/badge.svg)](https://github.com/campus-connect/campus-connect/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](./package.json)

**Campus Connect** is an enterprise-grade university issue and facility complaint management web application engineered for modern higher-education campuses. It provides college students, campus facility managers, and university administrators with an end-to-end digital desk to report, triage, assign, investigate, resolve, and audit campus maintenance disruptions.

Developed as a college **DevOps & Full-Stack Engineering project** by a Second-Year BTech Computer Science & Engineering student, this project demonstrates clean separation of concerns, automated CI pipelines, containerized databases, automated testing, and dual-mode runtime resilience.

---

## 🎨 Visual Identity & UI Design

Designed with a modern SaaS aesthetic inspired by leading developer tools and administrative portals:
- **Palette**: Deep Navy Blue (`#0B192C` / `#070F1E`) sidebars, crisp off-white (`#F8FAFC`) surfaces, and vibrant Teal (`#0D9488` / `#14B8A6`) accents for primary highlights, status badges, and interactive elements.
- **Typography**: Clean, readable Inter typeface with strict semantic visual hierarchy.
- **Components**: Reusable status badges with pulsed live indicators, collapsible responsive sidebars, accessible modals, and custom interactive SVG charts (Donut status distribution, monthly trend lines, category distribution bars).
- **Responsive Layout**: Seamlessly adapts across widescreen monitors, laptops, tablets, and smartphones.

---

## 🚀 Key Modules & Features

### 🎓 1. Student Portal
- **Interactive Dashboard**: KPI metric cards showing Total Complaints, Pending Review, In Progress, and Resolved cases, plus visual status breakdown and real-time activity stream.
- **Complaint Lodging Form**: Categorized complaint submission across 9 university departments (*Infrastructure, Electricity, Water Supply, Cleanliness, Internet & Wi-Fi, Hostel, Classroom, Library, Other*) with 4 urgency levels (*Low, Medium, High, Urgent*), precise location picker, and optional photo/document evidence.
- **My Complaints Hub**: Searchable and filterable complaint log with multi-criteria filters (Status, Category, Priority), pagination, and instant ticket detail navigation.
- **Complaint Investigation View**: Live 6-stage lifecycle progress timeline with timestamps and auditable notes.
- **Ticket Reopening**: Students can reopen resolved complaints if an issue recurs, requiring a mandatory detailed explanation that logs an audit record.
- **Real-Time Notification Center**: Badge indicators and notification popovers alerting students when their complaint is reviewed, assigned, or resolved.
- **Student Profile**: Displays official student roll ID, department, and contact information with inline editing capability.

### 🛡️ 2. Administrator Workspace
- **Executive Operations Dashboard**: High-level university overview featuring 5 operational KPI cards (*Total Complaints, Triage Queue, Active Maintenance, Resolved, Resolution Rate %*), monthly resolution trends, and category distribution charts.
- **Master Complaint Queue**: Comprehensive administrative table with multi-parameter filtering, full-text search, column sorting, and pagination.
- **Triage & Assignment**: Assign complaints to specialized campus departments and designated field technicians with status updates.
- **Rejection Workflow**: Administrators can reject invalid or duplicate complaints with a recorded justification.
- **Department Directory**: Manage university operational cells (*Estate & Infrastructure, Electrical Maintenance, Water & Sanitation, IT & Network Services, Hostel Welfare, Academic Facilities*).
- **Analytics & Operational Reports**: Turnaround metrics (average resolution time in hours, resolution percentage) and one-click **CSV Report Export** of all complaint records.

---

## 🔄 Complaint Lifecycle Workflow

Campus Connect enforces a strict state machine lifecycle:

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Student lodges issue
    SUBMITTED --> UNDER_REVIEW : Admin begins triage
    SUBMITTED --> REJECTED : Admin rejects with mandatory reason
    UNDER_REVIEW --> ASSIGNED : Dispatched to department
    UNDER_REVIEW --> REJECTED : Rejected during review
    ASSIGNED --> IN_PROGRESS : Field technician on-site
    IN_PROGRESS --> RESOLVED : Maintenance completed
    RESOLVED --> CLOSED : Confirmed & finalized
    RESOLVED --> UNDER_REVIEW : Reopened by student with explanation
    CLOSED --> UNDER_REVIEW : Exceptional review reopen
```

---

## 🆔 Student ID Generation Rules

Campus Connect implements strict university student ID constraints:
1. **Prefix**: All generated student IDs strictly begin with `5900`.
2. **Format**: Exactly 9 characters in the format `5900XXXXX` (where `XXXXX` represents 5 random digits).
3. **Collision Detection**: Generated against existing sets with automated retry logic.
4. **Strict Prohibited ID Guard**: Prohibited student ID patterns are strictly banned and verified by automated unit tests never to be accepted, generated, or seeded.
5. **Distinct Reference IDs**: Complaint ticket IDs follow an entirely separate pattern (e.g. `CC-2025-XXXXX`) to eliminate any confusion with student roll numbers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router Dom |
| **Backend** | Node.js, Express, TypeScript, Zod, Multer, bcryptjs, JSON Web Tokens (JWT) |
| **Database & ORM** | PostgreSQL, Prisma ORM, Dual-mode in-memory repository fallback |
| **Testing** | Vitest, React Testing Library, Supertest, Jest DOM |
| **DevOps & CI/CD** | GitHub Actions (`ci.yml`), npm scripts, Environment separation |

---

## ⚙️ Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- *(Optional)* **PostgreSQL**: `v14+` (Campus Connect includes built-in Demo Mode store that operates seamlessly even if PostgreSQL is not currently running locally)

### 1. Clone & Install Dependencies

From the repository root directory:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

*(Note for Windows PowerShell: Use `npm.cmd` if PowerShell execution policy restricts `.ps1` scripts).*

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default local `.env` values:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/campus_connect?schema=public"
JWT_SECRET="campus-connect-dev-secret-key-replace-in-production-32bytes"
CLIENT_URL="http://localhost:5173"
DEMO_MODE=true
```

### 3. Run Database Migrations & Seeds *(Optional when using PostgreSQL)*

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed realistic university test data
npm run db:seed
```

### 4. Start Development Servers

Run both the React frontend and Express backend concurrently:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Healthcheck**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials

For demonstration and testing purposes, pre-configured accounts are provided with 1-click test fill buttons on the login screen:

| Role | Email | Password | Student ID | Department |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student@campusconnect.edu` | `DemoStudent123!` | `590014298` | Computer Science & Engineering |
| **Administrator** | `admin@campusconnect.edu` | `DemoAdmin123!` | N/A | Central Campus Administration |
| **Student 2** | `priya.patel@campusconnect.edu` | `DemoStudent123!` | `590087312` | Electronics & Communication |

---

## 🧪 Automated Testing & Quality Checks

Run the automated test suites:

```bash
# Run all tests (client + server)
npm run test

# Run server unit & integration tests
npm --prefix server run test

# Run client component tests
npm --prefix client run test

# Run TypeScript typechecks
npm run lint
```

### Test Coverage Highlights:
- **`studentId.test.ts`**: Verifies `5900XXXXX` format, collision avoidance, and asserts that prohibited student IDs are never generated across 5,000 continuous iterations.
- **`complaintWorkflow.test.ts`**: Validates status lifecycle transitions, rejection reasons, and reopen validations.
- **`auth.test.ts`**: Tests JWT issue, bcrypt password hashing, login via student ID or email, and role authorization barriers preventing students from accessing admin analytics.

---

## 🚢 DevOps & Continuous Integration (CI)

Campus Connect includes an automated GitHub Actions CI pipeline configured in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

1. **Dependency Installation**: Runs clean `npm ci` on both client and server.
2. **Type Checking & Linting**: Executes `tsc --noEmit` across frontend and backend.
3. **Automated Testing**: Runs unit, component, and integration suites with Vitest.
4. **Production Build**: Builds optimized Vite frontend bundle and TypeScript server distribution.

---

## 📂 Project Structure

```
CampusConnect/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
├── client/                      # React frontend
│   ├── public/                  # Static assets & icons
│   ├── src/
│   │   ├── components/          # Reusable UI (Sidebar, Navbar, Badge, Charts, Modal, Timeline)
│   │   ├── context/             # AuthContext, NotificationContext
│   │   ├── pages/               # Login, Register, StudentDashboard, AdminDashboard, etc.
│   │   ├── services/            # API client and demo fallback repository
│   │   ├── test/                # Client Vitest tests
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Student ID generation & validation
│   │   ├── App.tsx              # App entry & protected routes
│   │   ├── main.tsx
│   │   └── index.css            # Tailwind styling
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                      # Express backend
│   ├── prisma/
│   │   ├── schema.prisma        # PostgreSQL models & relationships
│   │   └── seed.ts              # Database seeding script
│   ├── src/
│   │   ├── controllers/         # Auth, Complaints, Departments, Notifications, Analytics
│   │   ├── middleware/          # JWT auth, role enforcement, Zod validation
│   │   ├── routes/              # Express API routers
│   │   ├── services/            # Dual-mode repository & Prisma connector
│   │   ├── utils/               # Student ID generator & CSV exporter
│   │   ├── app.ts               # Express configuration
│   │   └── server.ts            # Entrypoint
│   ├── tests/                   # Vitest unit & integration tests
│   ├── package.json
│   └── tsconfig.json
├── .env.example                 # Environment template
├── .gitignore                   # Standard gitignore
├── package.json                 # Monorepo management scripts
└── README.md                    # Project documentation
```

---

## 🎓 College Project Viva / Demo Talking Points

If presenting this project in a viva or college demonstration:
1. **DevOps Pipeline**: Explain how GitHub Actions continuously checks every push with automated typechecking, test suites, and production builds.
2. **Dual-Mode Architecture**: Explain that the application is resilient: if PostgreSQL is accessible, Prisma ORM handles persistence; if PostgreSQL is offline or running on an external demonstrator's laptop, an in-memory repository seamlessly services all API calls with pre-seeded demo records without crashing.
3. **Security**: Point out server-side role-based authorization (students cannot access admin endpoints even if they craft HTTP requests manually), JWT expiration, and password hashing using bcrypt.
4. **Business Logic**: Explain how the complaint lifecycle strictly governs state transitions (e.g. a complaint cannot jump straight from `SUBMITTED` to `RESOLVED` without triage and assignment).
