# WCAM - Frontend Application

This is the React frontend for the Water Community Administration & Monitoring (WCAM) system. It features a modern, clean SaaS interface powered by Vite and Tailwind CSS, supporting distinct role-based views (`ADMIN`, `AGENT`, `USER`).

## Prerequisites
- Node.js (v18+ recommended)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root of the `frontend` directory to point to your backend API:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

## Running the Application

Start the Vite development server:
```bash
npm run dev
```

The app will typically be available at `http://localhost:5173`.

## Role-Based Access Design
The frontend actively adapts the Sidebar, Dashboard, and Routes depending on the user logged in:
- **Admin / Agent**: Full network overview, water sources tracking, and technical alert overviews.
- **User**: Personal consumption limits, scheduled reports, and localized community alerts.
# Water-monitoring-system-Frontend
