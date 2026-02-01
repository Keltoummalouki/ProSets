# ProSets — Digital Assets Marketplace

> Where creators meet buyers. Secure. Fast. Frictionless.

A full-stack digital assets marketplace built with modern web technologies. Buy and sell 3D models, code snippets, and Notion templates with zero hassle.

---

## 🎯 What's This About?

ProSets is a secure marketplace platform designed for creators and buyers to exchange high-quality digital assets. Think of it as the bridge between talented creators and those who need their work.

**Key Features:**
- 🔒 Secure file delivery via temporary presigned URLs
- 💳 Seamless Stripe integration for payments
- 👤 Social & email authentication (Auth0)
- 📊 Creator & buyer dashboards
- 🏪 Browse, filter, and discover assets instantly
- 📈 Real-time sales tracking for creators

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (App Router) + Tailwind CSS + Shadcn/ui |
| **Backend** | NestJS |
| **Database** | PostgreSQL (Prisma ORM) |
| **Auth** | Auth0 |
| **Storage** | AWS S3 |
| **Payments** | Stripe |
| **Deployment** | Docker + Docker Compose |

---

## 📦 Project Structure

```
prosets/
├── apps/
│   ├── frontend/          # Next.js client app
│   └── backend/           # NestJS API server
├── packages/              # Shared utilities & types
├── docker-compose.yml     # Local development setup
├── Dockerfile             # Production builds
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- AWS S3 account (or local S3-compatible storage)
- Stripe & Auth0 credentials

### Setup (Local Dev)

```bash
# Clone & install
git clone https://github.com/keltoummalouki/prosets.git
cd prosets
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run locally
docker-compose up -d

# Start dev servers
npm run dev:frontend
npm run dev:backend
```

Visit `http://localhost:3000` for the frontend.

### Production Build

```bash
# Build Docker images
docker build -t prosets-frontend -f apps/frontend/Dockerfile .
docker build -t prosets-backend -f apps/backend/Dockerfile .

# Deploy with compose
docker-compose -f docker-compose.prod.yml up
```

---

## 🎮 Core Features

### For Buyers
- **Browse & Filter** — Discover assets by category, price, or search
- **Preview Before Buy** — High-quality previews (images/videos) for every asset
- **Secure Checkout** — One-click Stripe payment
- **Instant Access** — Download immediately after payment
- **Purchase History** — Track all your downloads in one place

### For Creators
- **Easy Upload** — Drag-and-drop asset & preview files
- **Asset Management** — Edit prices, descriptions, and status anytime
- **Sales Dashboard** — Real-time revenue tracking
- **Secure Storage** — Your files are private until purchased

### For Admins
- **Moderation Tools** — Review and disable non-compliant assets
- **Platform Stats** — Monitor marketplace health

---

## 🔐 Security Highlights

- **Presigned URLs** — Files accessible for 5 minutes only, then expire
- **Private Storage** — All source files stored in protected S3 buckets
- **Payment Validation** — Stripe webhooks confirm purchases before granting access
- **Role-Based Access** — Buyers, creators, and admins have isolated permissions
- **Auth0 Integration** — Enterprise-grade authentication with social login

---

## 📊 API Endpoints (Backend)

**Authentication**
```
POST   /auth/login
POST   /auth/signup
POST   /auth/refresh
```

**Assets**
```
GET    /assets              # List all assets (paginated, filterable)
GET    /assets/:id          # Asset details + preview
POST   /assets              # Create asset (creators only)
PATCH  /assets/:id          # Update asset (owner only)
DELETE /assets/:id          # Disable asset (owner/admin only)
```

**Purchases**
```
POST   /orders              # Create checkout session
GET    /orders              # Order history (auth required)
GET    /download/:id        # Generate presigned URL (paid customers only)
```

**Webhooks**
```
POST   /webhooks/stripe     # Handle payment confirmations
```

---

## 🧪 Testing & Quality

```bash
# Run tests
npm run test

# Check code quality
npm run lint
npm run format

# Coverage report
npm run test:coverage
```

**Standards:**
- ESLint + Prettier for code consistency
- Jest for unit/integration tests
- E2E tests with Playwright (optional)
- CI/CD pipeline (GitHub Actions)

---

## 📈 Performance Targets

- ⚡ Page load < 2s (Core Web Vitals)
- 🎯 Lighthouse score > 90
- 📦 Bundle size < 150KB (gzipped)
- 🗄️ DB queries optimized with indexes
- 💾 Redis caching for hot assets

---

## 🐛 Known Limitations & Future Work

- [ ] Bulk upload for creators
- [ ] Advanced analytics (heatmaps, demographics)
- [ ] Subscription plans for assets
- [ ] In-app messaging between creators & buyers
- [ ] Automated moderation (ML-based content review)

---

## 🤝 Contributing

This is an individual project for educational purposes. Follow these guidelines if extending:

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Commit with clear messages: `git commit -m "feat: add thing"`
3. Push & open a PR for review
4. Ensure tests pass & linting is clean

---

## 📝 Deployment Notes

### Docker Multi-Stage Build
Both services use optimized multi-stage builds to minimize image size:
- Development dependencies stripped in production
- Node modules cached efficiently
- Final images < 300MB each

### Environment Variables
See `.env.example` for all required configs. Key ones:
- `DATABASE_URL` — PostgreSQL connection
- `STRIPE_SECRET_KEY` — Payment processing
- `AUTH0_SECRET` — Authentication
- `AWS_S3_BUCKET` — File storage


---

## 📄 License

This project is for educational purposes only. All rights reserved.

---

**Built with precision. Shipped with confidence.**
