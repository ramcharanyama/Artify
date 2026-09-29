# ARTIFY — Art Marketplace

A full-stack e-commerce platform where independent artists list and sell original artwork, and customers browse, buy, and track orders. Built with React, Spring Boot, and MySQL.

**Live demo:** https://artify-frontend.onrender.com
**Backend API:** https://artify-backend-q0s7.onrender.com/api

> The demo runs on free-tier hosting. The backend sleeps after ~15 minutes of inactivity and can take a minute to wake up on the first request — this is expected, not a bug.

---

## Features

- **Role-based accounts** — Customer, Artist, and Admin, each with their own dashboard and permissions
- **Artist workspace** — list, edit, publish/draft, and delete artwork, with live stats (total listed, active gallery, sold, average rating)
- **Product catalog** — search, category filters, price filters, sorting, pagination
- **Shopping cart & checkout** — quantity management, multiple payment methods including Cash on Delivery
- **Order history** — track and cancel orders
- **Reviews & ratings** — one review per customer per product
- **Admin panel** — manage users, products, and view reports
- **JWT authentication** with Spring Security, role-based route protection on both frontend and backend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Spring Boot 3.2, Java 17, Spring Security, JWT |
| Database | MySQL 8 |
| ORM | Hibernate / Spring Data JPA |
| Containerization | Docker (multi-stage builds), Docker Compose |
| CI/CD | GitHub Actions (build/test, Docker image push) |
| Hosting | Render (backend + frontend), Aiven (managed MySQL) |

---

## Project Structure

```
art_git/
├── artify-frontend/      React SPA
│   └── src/
│       ├── pages/        One file per route
│       ├── components/   Layout, product, cart, dashboard, common
│       ├── services/     All API calls (one file per domain)
│       ├── context/      Auth and Cart state
│       └── utils/        Constants, validators, formatters
├── artify-backend/       Spring Boot REST API
│   └── src/main/java/com/artify/
│       ├── controller/   One per domain (Auth, Product, Cart, Order, Payment, Review, Category, Artist, Admin)
│       ├── service/      Business logic, mirrors controllers
│       ├── repository/   Spring Data JPA interfaces
│       ├── model/        JPA entities + enums (Role, OrderStatus, PaymentStatus, ProductStatus, PaymentMethod)
│       ├── dto/          Request/response objects
│       ├── security/     JWT provider, filter, user details service
│       └── config/       Security and CORS configuration
├── database/
│   ├── schema.sql        Full table definitions, kept in sync with production
│   └── seed.sql          Local development sample data (do not run in production)
├── docker-compose.yml    Runs MySQL + backend + frontend together locally
└── .github/workflows/    CI/CD pipeline definitions
```

---

## Running Locally

### Prerequisites
- Java 17
- Node.js 18+
- MySQL 8 running locally
- Maven

### 1. Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p artify_db < database/seed.sql
```

### 2. Backend
```bash
cd artify-backend
mvn spring-boot:run
```
Runs on `http://localhost:8081`. Uses `application.properties` defaults (local MySQL, `root`/`root`) unless overridden by environment variables.

### 3. Frontend
```bash
cd artify-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

### Or run everything with Docker Compose
```bash
docker-compose up --build
```
Brings up MySQL, backend, and frontend together, networked correctly.

---

## Environment Variables

The backend reads these at startup (see `application.properties` for local defaults):

| Variable | Purpose |
|---|---|
| `SPRING_DATASOURCE_URL` | JDBC URL, e.g. `jdbc:mysql://host:port/artify_db?sslMode=REQUIRED` |
| `SPRING_DATASOURCE_USERNAME` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key used to sign JWTs — must be a long random string in production |
| `APP_CORS_ORIGINS` | Comma-separated list of allowed frontend origins (in addition to `localhost:*`) |
| `PORT` | Injected automatically by the hosting platform (Render); defaults to `8081` locally |

The frontend reads:

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL the frontend calls, e.g. `https://your-backend.onrender.com/api` |

---

## Deployment

Deployed on free-tier infrastructure:
- **Database:** Aiven (managed MySQL, SSL required)
- **Backend:** Render web service (Docker runtime)
- **Frontend:** Render static site

Key details for anyone redeploying this:
- The backend Dockerfile uses a multi-stage build (`maven:3.9-eclipse-temurin-17` to compile, `eclipse-temurin:17-jre-alpine` to run) — no Maven wrapper (`mvnw`) is used or required.
- `spring.jpa.hibernate.ddl-auto=validate` is intentional — the app will refuse to start if the database schema doesn't match the entity mappings exactly, rather than silently altering or dropping tables. Load `schema.sql` into any new database before starting the app.
- The frontend's Render static site needs a rewrite rule (`/*` → `/index.html`) for client-side routing to work on page refresh.
- `seed.sql` is for local development only — it contains a default admin account with a password visible in this repo. Never run it against a public database. Promote a real account to admin instead:
  ```sql
  UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
  ```

---

## Known Limitations / Roadmap

- Payment processing is simulated — no real payment gateway integration
- No automated end-to-end test suite (manual QA only)
- Free-tier hosting means occasional cold-start delays
- "Artworks Sold" metric currently reflects manually-set status rather than aggregated order data

---

## Team

| Role | Focus |
|---|---|
| Product Owner | Requirements, backlog, stakeholder communication |
| Scrum Master | Sprint planning and coordination |
| System Architect | Architecture, UML, DFD, ER diagrams |
| Frontend Developer | React UI, routing, components |
| Backend Developer | REST APIs, security, business logic |
| DevOps Engineer | GitHub, Docker, CI/CD, deployment |
| QA/Test Engineer | Functional, API, and regression testing |

---

## License

This project was built as an academic exercise. No license has been specified — contact the maintainers before reuse.