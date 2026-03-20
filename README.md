# Zariva Property Management System

<div align="center">

  **Your Trusted Real Estate Partner**

  A modern, elegant property management system for landlords, tenants, and administrators.
</div>

## About

Zariva Property Management System is a comprehensive platform designed to streamline property management operations for **Zariva Africa Properties Ltd**. The system addresses inefficiencies in traditional property management by providing:

- Real-time property and financial insights
- Seamless communication between landlords, tenants, and property managers
- Efficient maintenance request handling
- Automated rent collection and payment tracking
- Mobile-responsive, user-friendly interface

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand / React Query

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic
- **Task Queue**: Celery + Redis
- **Authentication**: JWT (python-jose)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Hosting**: AWS (ECS, RDS, S3, CloudFront)
- **CI/CD**: GitHub Actions

## Project Structure

```
zariva-property-management/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docs/              # Documentation
├── assets/            # Images, logos, design files
├── .github/           # GitHub Actions workflows
└── docker-compose.yml # Development environment
```

## Local Development

### Prerequisites
- Node.js 18+ (we're using v24.11.1)
- Python 3.10+
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/MesfinGithinji/zariva-property-management.git
   cd zariva-property-management
   ```

2. **Start with Docker Compose**
   ```bash
   docker compose up
   ```

3. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Brand Colors

- **Primary (Forest Green)**: `#1B4332`
- **Secondary (Gold)**: `#D4AF37`
- **Accent (Cream)**: `#F5F1E8`
- **Text**: `#1F2937`

## Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fixes
- `chore/*` - Maintenance tasks

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Create a Pull Request to `develop`
4. Wait for review and approval

## License

Proprietary - Zariva Africa Properties Ltd © 2026

---

Built for modern property management
