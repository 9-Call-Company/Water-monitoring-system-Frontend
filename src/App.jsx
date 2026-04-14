import { Routes, Route, Navigate } from "react-router-dom";

// Layout & guards
import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Auth
import Login from "./pages/auth/Login";

// Shared / all-roles
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/admin/Settings";

// Admin pages
import WaterSources from "./pages/sources/WaterSources";
import UserManagement from "./pages/users/UserManagement";
import ReportSchedule from "./pages/reports/ReportSchedule";
import AlertsList from "./pages/alerts/AlertsList";

// Agent pages
import MyUsers from "./pages/agent/MyUsers";
import AgentRobines from "./pages/agent/AgentRobines";
import AgentWaterQuality from "./pages/agent/WaterQuality";
import AgentIssues from "./pages/agent/Issues";

// User pages
import UserAlerts from "./pages/user/UserAlerts";
import UserMyRobine from "./pages/user/MyRobine";
import UserWaterQuality from "./pages/user/WaterQuality";
import UserMaintenance from "./pages/user/Maintenance";

// 404
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />

      {/* ── Authenticated (all roles) ───────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Shared routes visible to every logged-in user */}
          <Route index element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />

          {/* ── Admin + Agent ──────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "agent"]} />}>
            <Route path="/sources" element={<WaterSources />} />
            <Route path="/alerts" element={<AlertsList />} />
          </Route>

          {/* ── Admin only ─────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<ReportSchedule />} />
          </Route>

          {/* ── Agent only ─────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
            <Route path="/agent/users" element={<MyUsers />} />
            <Route path="/agent/robines" element={<AgentRobines />} />
            <Route path="/agent/quality" element={<AgentWaterQuality />} />
            <Route path="/agent/issues" element={<AgentIssues />} />
          </Route>

          {/* ── User only ──────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/my-alerts" element={<UserAlerts />} />
            <Route path="/user/robine" element={<UserMyRobine />} />
            <Route path="/user/quality" element={<UserWaterQuality />} />
            <Route path="/user/maintenance" element={<UserMaintenance />} />
          </Route>
        </Route>
      </Route>

      {/* ── Catch-all → 404 ────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
