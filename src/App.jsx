import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import WaterSources from "./pages/sources/WaterSources";
import UserManagement from "./pages/users/UserManagement";
import ReportSchedule from "./pages/reports/ReportSchedule";
import AlertsList from "./pages/alerts/AlertsList";
import MyUsers from "./pages/agent/MyUsers";
import AgentRobines from "./pages/agent/AgentRobines";
import UserAlerts from "./pages/user/UserAlerts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* All authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Shared */}
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/settings"
            element={
              <div className="text-gray-500 font-mono p-6">
                Settings — Coming Soon
              </div>
            }
          />

          {/* Admin + Agent shared routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "agent"]} />}>
            <Route path="/sources" element={<WaterSources />} />
            <Route path="/alerts" element={<AlertsList />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<ReportSchedule />} />
          </Route>

          {/* Agent only */}
          <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
            <Route path="/agent/users" element={<MyUsers />} />
            <Route path="/agent/robines" element={<AgentRobines />} />
          </Route>

          {/* User only */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/my-alerts" element={<UserAlerts />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
        <Route element={<Layout role="agent" pageTitle="WCAM Agent" />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/users" element={<AgentMyUsers />} />
          <Route path="/agent/robines" element={<AgentRobines />} />
          <Route path="/agent/quality" element={<AgentWaterQuality />} />
          <Route path="/agent/issues" element={<AgentIssues />} />
          <Route path="/agent/alerts" element={<AgentAlerts />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<Layout role="user" pageTitle="WCAM Home" />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/robine" element={<UserMyRobine />} />
          <Route path="/user/alerts" element={<UserAlerts />} />
          <Route path="/user/quality" element={<UserWaterQuality />} />
          <Route path="/user/maintenance" element={<UserMaintenance />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
