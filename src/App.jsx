import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layout & guards
import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Auth
import Login from "./pages/auth/Login";

// Role-specific dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import AgentDashboard from "./pages/agent/Dashboard";
import UserDashboard from "./pages/user/Dashboard";

// Settings (shared)
import Settings from "./pages/admin/Settings";

// Admin pages
import WaterSources from "./pages/sources/WaterSources";
import UserManagement from "./pages/users/UserManagement";
import ReportSchedule from "./pages/reports/ReportSchedule";
import AlertsList from "./pages/alerts/AlertsList";
import AdminRobines from "./pages/admin/Robines";

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

// Role-aware root dashboard
const RoleDashboard = () => {
  const { user } = useAuth();
  const role = (user?.role || "user").toLowerCase();
  if (role === "admin") return <AdminDashboard />;
  if (role === "agent") return <AgentDashboard />;
  return <UserDashboard />;
};

function App() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />

      {/* ── Authenticated (all roles) ───────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Root — role-aware dashboard */}
          <Route index element={<RoleDashboard />} />
          <Route path="/" element={<RoleDashboard />} />

          {/* Explicit role-specific dashboard URLs */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<ReportSchedule />} />
            <Route path="/admin/robines" element={<AdminRobines />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/users" element={<MyUsers />} />
            <Route path="/agent/robines" element={<AgentRobines />} />
            <Route path="/agent/quality" element={<AgentWaterQuality />} />
            <Route path="/agent/issues" element={<AgentIssues />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/my-alerts" element={<UserAlerts />} />
            <Route path="/user/robine" element={<UserMyRobine />} />
            <Route path="/user/quality" element={<UserWaterQuality />} />
            <Route path="/user/maintenance" element={<UserMaintenance />} />
          </Route>

          {/* Admin + Agent */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "agent"]} />}>
            <Route path="/sources" element={<WaterSources />} />
            <Route path="/alerts" element={<AlertsList />} />
          </Route>

          {/* All roles */}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* ── Catch-all → 404 ────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
