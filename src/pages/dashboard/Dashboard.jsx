import {
  Activity,
  AlertTriangle,
  Droplets,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendStatus = "neutral",
}) => {
  const statusColors = {
    good: "text-emerald-600 bg-emerald-50 border-emerald-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    danger: "text-red-600 bg-red-50 border-red-100",
    neutral: "text-slate-600 bg-slate-50 border-transparent",
  };

  return (
    <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-slate-500">
                {title}
              </dt>
              <dd>
                <div className="text-2xl font-semibold text-slate-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className={`px-5 py-3 border-t ${statusColors[trendStatus]}`}>
        <div className="text-sm font-medium flex items-center gap-1.5">
          {trendStatus === "good" && <CheckCircle2 className="w-4 h-4" />}
          {trendStatus === "danger" && <AlertTriangle className="w-4 h-4" />}
          {trend}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const role = (user?.role || "USER").toUpperCase();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {role === "USER" ? "My Water Usage" : "System Overview"}
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          {role === "USER"
            ? "Track your daily consumption and network alerts."
            : "Real-time status of water community networks and infrastructure."}
        </p>
      </div>

      {/* Role-specifc stat cards */}
      {role !== "USER" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sources"
            value="12"
            icon={Droplets}
            trend="All operational"
            trendStatus="good"
          />
          <StatCard
            title="Active Alerts"
            value="2"
            icon={AlertTriangle}
            trend="2 pipes need attention"
            trendStatus="warning"
          />
          <StatCard
            title="Monitored Communities"
            value="8"
            icon={Users}
            trend="Growing"
            trendStatus="neutral"
          />
          <StatCard
            title="System Health"
            value="98.9%"
            icon={Activity}
            trend="Stable"
            trendStatus="good"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="My Consumption (Today)"
            value="145 Liters"
            icon={Droplets}
            trend="Below average"
            trendStatus="good"
          />
          <StatCard
            title="Network Status"
            value="Online"
            icon={Activity}
            trend="No issues in your area"
            trendStatus="good"
          />
          <StatCard
            title="Local Alerts"
            value="0"
            icon={AlertTriangle}
            trend="Clear"
            trendStatus="good"
          />
        </div>
      )}

      {/* Shared dashboard content area */}
      <div className="mt-8 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-medium text-slate-900">
            {role === "USER"
              ? "Recent Consumption History"
              : "Live Network Map"}
          </h3>
        </div>
        <div className="p-8 flex items-center justify-center min-h-[400px] bg-slate-50/50">
          <p className="text-slate-400">
            {role === "USER"
              ? "Chart showing liters used over the last 7 days will render here."
              : "Geospatial node map will render here."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
