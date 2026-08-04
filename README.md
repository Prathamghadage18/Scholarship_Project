# School SaaS Platform

A scalable, multi-tenant SaaS platform for school management built with **Django**, **React**, and **PostgreSQL**. Designed to handle multiple schools with complete data isolation, this platform provides role-based dashboards, a comprehensive Student Information System (SIS), timetable scheduling, and automated notifications.

## 🌟 Key Features

- **Multi-Tenant Architecture**: Schema-based multi-tenancy ensures complete data isolation between different schools (tenants).
- **Role-Based Access Control (RBAC)**: Custom dashboards and permissions for HQ, Principals, Teachers, Students, and Parents.
- **Student Information System (SIS)**: Full student lifecycle management, attendance tracking, and performance reporting.
- **Smart Timetable Scheduling**: Automated conflict detection prevents overlapping classes for teachers, rooms, and classes.
- **Automated Notifications**: Email notification system (built with React Email) for attendance, announcements, and tenant onboarding.
- **Subscription Billing**: Integrated Stripe payments for tenant subscription management.
- **Modern Responsive UI**: Fast and intuitive Single Page Application (SPA) built with Vite and React Router.
- **Secure Authentication**: JWT-based authentication via Django Rest Framework.

## 🏗️ Architecture & Multi-Tenancy

The system utilizes **schema-based multi-tenancy** (via `django-tenants`) for complete data isolation.

When a new school (tenant) is onboarded by HQ:
1. A separate PostgreSQL schema is automatically provisioned for the school.
2. A unique subdomain (e.g., `riverside.schoolsaas.localhost`) is assigned.
3. Domain routing middleware automatically directs traffic to the correct schema.
4. Shared data (like authentication) remains in the public schema, while tenant data (students, attendance, timetables) is strictly isolated.

## 👥 Role-Based Capabilities

| Role | Capabilities & Dashboard View |
|------|-------------------------------|
| **HQ Admin** | Onboards and manages schools, oversees subscriptions, views platform-wide metrics. |
| **Principal** | Manages their school's staff and students, views tenant-specific KPIs and attendance trends. |
| **Teacher** | Manages class attendance, views assigned subjects and daily timetable. |
| **Student** | Views personal attendance records, timetable, and upcoming classes. |
| **Parent** | Tracks child's attendance, views fee status and school notices. |

## 💻 Tech Stack

**Backend:**
- Python 3.13+
- Django & Django Rest Framework (DRF)
- PostgreSQL (with `django-tenants`)
- JWT Authentication
- Celery & Redis (Background Jobs)
- Stripe (Billing)

**Frontend:**
- React.js (Vite)
- React Router
- React Email (Notification Templates)
- CSS Grid / Flexbox for responsive layouts

## 🚀 Local Setup & Installation

### Prerequisites
- Python 3.13+
- Node.js 16+
- PostgreSQL

### 1. Backend Setup

```bash
# Clone the repository and navigate to backend
cd school-saas-backend

# Create and activate virtual environment
python -m venv .venv
# On Windows use: .venv\Scripts\activate
# On macOS/Linux use: source .venv/bin/activate

# Install dependencies (assuming you have a requirements.txt)
pip install django-tenants psycopg[binary] djangorestframework djangorestframework-simplejwt stripe celery redis

# Configure PostgreSQL in .env
# Ensure USE_DJANGO_TENANTS=1 for PostgreSQL schema isolation

# Run multi-tenancy setup script and migrations
python scripts/enable_multi_tenancy.py
python manage.py makemigrations
python manage.py migrate

# Create superuser for the HQ admin
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd school-saas-frontend/school-saas-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://127.0.0.1:8000`.

## 📡 API Overview

The platform provides a comprehensive RESTful API. Key endpoints include:

- **Auth**: `/api/token/`, `/api/auth/register/`, `/api/auth/me/`
- **Tenant Management**: `/api/tenants/` (HQ only)
- **Students & Attendance**: `/api/students/`, `/api/attendance/`, `/api/attendance/summary/`
- **Teachers & Timetable**: `/api/teachers/`, `/api/timetable/` (Includes conflict validation)
- **Notifications**: `/api/notifications/attendance/`, `/api/notifications/announcement/`

## 📊 System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    School SaaS Platform                     │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│  React SPA           │        Django REST API               │
│  (Vite)              │        (DRF + JWT)                   │
│                      │                                      │
│  ┌─────────────┐     │  ┌──────────────────────────────┐   │
│  │ Auth &      │────→│  │ /api/token/                  │   │
│  │ Dashboards  │     │  │ /api/auth/register           │   │
│  └─────────────┘     │  └──────────────────────────────┘   │
│                      │                                      │
│  ┌─────────────┐     │  ┌──────────────────────────────┐   │
│  │ Role-Based  │────→│  │ /api/students/ & attendance  │   │
│  │ Operations  │     │  │ /api/teachers/ & timetable   │   │
│  └─────────────┘     │  │ /api/tenants/ (HQ)           │   │
│                      │  └──────────────────────────────┘   │
│                      │                                      │
│  JWT + Roles         │  PostgreSQL (Multi-schema ready)    │
│  in localStorage     │  Role-filtered QuerySets            │
│                      │  Stripe Webhooks & Background Tasks │
└──────────────────────┴──────────────────────────────────────┘
```

## 📝 License

This project is licensed under the MIT License.
