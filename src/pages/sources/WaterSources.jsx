import { Droplets, Activity, MapPin } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const WaterSources = () => {
  const { user } = useAuth();

  if (user?.role?.toUpperCase() === "USER") {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Pass. Unauthorized.
      </div>
    );
  }

  const sources = [
    {
      id: "WS-101",
      name: "Main Reservoir Alpha",
      location: "North District",
      flowRate: "120 L/min",
      status: "optimal",
      lastReading: "2 mins ago",
    },
    {
      id: "WS-102",
      name: "Community Tank B",
      location: "South Valley",
      flowRate: "45 L/min",
      status: "optimal",
      lastReading: "5 mins ago",
    },
    {
      id: "WS-103",
      name: "Pump Station 4",
      location: "East Heights",
      flowRate: "0 L/min",
      status: "offline",
      lastReading: "1 hour ago",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900">
            Water Sources
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Hardware monitoring, active tanks, and pump stations.
          </p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
          Add New Source
        </button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Source ID / Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Flow Rate
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Droplets className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {source.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {source.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-500">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                      {source.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        source.status === "optimal"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      {source.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="font-medium text-slate-900">
                      {source.flowRate}
                    </div>
                    <div className="text-xs text-slate-400">
                      Updated {source.lastReading}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Manage
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaterSources;
