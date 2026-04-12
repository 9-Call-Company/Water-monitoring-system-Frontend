import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ReportSchedule from './pages/reports/ReportSchedule';
import AlertsList from './pages/alerts/AlertsList';
import WaterSources from './pages/sources/WaterSources';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<ReportSchedule />} />
          <Route path="/alerts" element={<AlertsList />} />
          <Route path="/sources" element={<WaterSources />} />
          
          <Route path="/communities" element={<div className="text-slate-500">Communities View (Work in Progress)</div>} />
          <Route path="/usage" element={<div className="text-slate-500">My Usage View (Work in Progress)</div>} />
          <Route path="/settings" element={<div className="text-slate-500">Settings View (Work in Progress)</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
