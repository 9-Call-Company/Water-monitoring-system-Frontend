import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Layout from "./components/shared/Layout";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSources from "./pages/admin/Sources";
import AdminUsers from "./pages/admin/Users";
import AdminRobines from "./pages/admin/Robines";
import AdminIssues from "./pages/admin/Issues";
import AdminAlerts from "./pages/admin/Alerts";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AgentDashboard from "./pages/agent/Dashboard";
import AgentMyUsers from "./pages/agent/MyUsers";
import AgentRobines from "./pages/agent/Robines";
import AgentWaterQuality from "./pages/agent/WaterQuality";
import AgentIssues from "./pages/agent/Issues";
import AgentAlerts from "./pages/agent/Alerts";
import UserDashboard from "./pages/user/Dashboard";
import UserMyRobine from "./pages/user/MyRobine";
import UserAlerts from "./pages/user/Alerts";
import UserWaterQuality from "./pages/user/WaterQuality";
import UserMaintenance from "./pages/user/Maintenance";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<Layout role="admin" pageTitle="WCAM Admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/sources" element={<AdminSources />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/robines" element={<AdminRobines />} />
          <Route path="/admin/issues" element={<AdminIssues />} />
          <Route path="/admin/alerts" element={<AdminAlerts />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
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
