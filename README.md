# WCAM Frontend

React + Vite frontend for WCAM with role-based dashboards for admin, agent, and user.

## Tech Stack
- React
- Vite
- Tailwind CSS
- Axios
- Chart.js

## Prerequisites
- Node.js 18+
- npm
- Backend API running

## 1. Install Dependencies
```bash
npm install
```

## 2. Configure Environment
Create `.env` in frontend root:

```env
VITE_API_URL="http://localhost:5000/api"
```

## 3. Run Frontend
Development:
```bash
npm run dev
```

Build production bundle:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Default app URL:
- `http://localhost:5173`

## Test Login Accounts
Use backend seeded users (password: `Wcam123!`):
- Admin: `byukusengebaraka16@gmail.com`
- Agent: `irakaramale@gmail.com`
- User: `mugishajohn004@gmail.com`

## Main Functional Areas
- Role-aware navigation and protected routes
- Water quality management and visibility by role
- Maintenance request flow
- User/admin/agent alerts and dashboards
- Reports page (including consumption totals with footer total)

## Troubleshooting
- Frontend cannot call backend:
   - Verify `VITE_API_URL` points to backend `/api`.
   - Ensure backend is running on expected port.
- Login fails:
   - Confirm backend seed ran successfully.
   - Check browser console/network for API response details.
