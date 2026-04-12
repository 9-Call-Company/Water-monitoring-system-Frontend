import { AlertTriangle, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AlertsList = () => {
  const { user } = useAuth();
  const role = (user?.role || "USER").toUpperCase();

  const alerts = [
    {
      id: 1,
      type: "Leak Detected",
      location: "Pipe Sector 4A",
      time: "10 mins ago",
      severity: "high",
      status: "active",
      litersLost: "~45L/hr",
    },
    {
      id: 2,
      type: "Pressure Drop",
      location: "Community Tank B",
      time: "2 hours ago",
      severity: "medium",
      status: "investigating",
      litersLost: "N/A",
    },
    {
      id: 3,
      type: "Maintenance Block",
      location: "Main Valve 2",
      time: "1 day ago",
      severity: "low",
      status: "resolved",
      litersLost: "0L",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold leading-7 text-slate-900">
          System Alerts & Issues
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          {role === "USER"
            ? "Track issues affecting your local water supply."
            : "Monitor network-wide anomalies and hardware faults."}
        </p>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 p-2 rounded-full ${
                      alert.severity === "high"
                        ? "bg-red-100 text-red-600"
                        : alert.severity === "medium"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {alert.status === "resolved" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-900">
                      {alert.type}
                    </h4>
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border ${
                      alert.status === "active"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : alert.status === "investigating"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {alert.status}
                  </span>
                  {(role === "ADMIN" || role === "AGENT") &&
                    alert.status !== "resolved" && (
                      <div className="mt-2 text-sm font-medium text-red-600">
                        Est. Loss: {alert.litersLost}
                      </div>
                    )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlertsList;
