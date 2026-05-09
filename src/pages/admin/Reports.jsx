import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Download, Loader2 } from "lucide-react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: true, labels: { color: "#a3a3a3" } } },
  scales: {
    x: {
      grid: { color: "#1f1f1f" },
      ticks: { color: "#a3a3a3", font: { family: "monospace", size: 11 } },
    },
    y: {
      grid: { color: "#1f1f1f" },
      ticks: { color: "#a3a3a3", font: { family: "monospace", size: 11 } },
    },
  },
};

export default function Reports() {
  const [reportType, setReportType] = useState("Consumption");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { showToast } = useToast();

  // Sample data - in production, fetch from backend
  const getConsumptionData = () => {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];
    return {
      labels,
      datasets: [
        {
          label: "Water Consumption (m³)",
          data: [12.5, 14.2, 11.8, 15.3, 13.7, 16.1, 14.9],
          borderColor: "#FF6B00",
          backgroundColor: "rgba(255,107,0,0.1)",
          tension: 0.4,
          pointBackgroundColor: "#FF6B00",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: true,
        },
      ],
    };
  };

  const getAlertsData = () => {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];
    return {
      labels,
      datasets: [
        {
          label: "Critical",
          data: [2, 3, 1, 4, 2, 3, 1],
          backgroundColor: "rgba(239, 68, 68, 0.6)",
          borderColor: "#ef4444",
        },
        {
          label: "Warning",
          data: [5, 6, 4, 7, 5, 8, 6],
          backgroundColor: "rgba(245, 158, 11, 0.6)",
          borderColor: "#f59e0b",
        },
        {
          label: "Info",
          data: [8, 7, 9, 6, 10, 7, 9],
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "#3b82f6",
        },
      ],
    };
  };

  const getUsersData = () => {
    const labels = ["Active", "Inactive", "Pending"];
    return {
      labels,
      datasets: [
        {
          label: "User Count",
          data: [156, 23, 8],
          backgroundColor: ["#FF6B00", "#ef4444", "#f59e0b"],
          borderColor: "#1e1e1e",
          borderWidth: 2,
        },
      ],
    };
  };

  const getEquipmentData = () => {
    const labels = ["Online", "Offline", "Maintenance"];
    return {
      labels,
      datasets: [
        {
          label: "Equipment Status",
          data: [87, 12, 5],
          backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
          borderColor: "#1e1e1e",
          borderWidth: 2,
        },
      ],
    };
  };

  const getChartData = (type) => {
    switch (type) {
      case "Consumption":
        return getConsumptionData();
      case "Alerts":
        return getAlertsData();
      case "Users":
        return getUsersData();
      case "Equipment":
        return getEquipmentData();
      default:
        return getConsumptionData();
    }
  };

  const downloadAsCSV = () => {
    setLoading(true);
    try {
      const headers = ["Date", "Value", "Status"];
      let csvContent = [headers.join(",")];

      if (reportType === "Consumption") {
        const rows = [
          ["2025-05-01", "12.5", "normal"],
          ["2025-05-08", "14.2", "normal"],
          ["2025-05-15", "11.8", "normal"],
          ["2025-05-22", "15.3", "high"],
          ["2025-05-29", "13.7", "normal"],
        ];
        csvContent.push(...rows.map((r) => r.join(",")));
      } else if (reportType === "Alerts") {
        const rows = [
          ["2025-05-01", "5", "critical"],
          ["2025-05-08", "9", "critical"],
          ["2025-05-15", "5", "warning"],
          ["2025-05-22", "11", "critical"],
        ];
        csvContent.push(...rows.map((r) => r.join(",")));
      } else if (reportType === "Users") {
        const rows = [
          ["2025-05-01", "156", "active"],
          ["2025-05-15", "160", "active"],
          ["Pending", "8", "pending"],
        ];
        csvContent.push(...rows.map((r) => r.join(",")));
      }

      const blob = new Blob([csvContent.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType}-report-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`${reportType} report downloaded as CSV`, "success");
    } catch (error) {
      showToast("Failed to download CSV", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsExcel = () => {
    setLoading(true);
    try {
      // Simple Excel format simulation using CSV with .xlsx extension
      const content = generateExcelContent();
      const blob = new Blob([content], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType}-report-${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`${reportType} report downloaded as Excel`, "success");
    } catch (error) {
      showToast("Failed to download Excel", "error");
    } finally {
      setLoading(false);
    }
  };

  const generateExcelContent = () => {
    // Basic CSV that can be opened in Excel
    const headers = ["Date", "Value", "Status"];
    let content = [headers.join("\t")];

    if (reportType === "Consumption") {
      content.push(
        ["2025-05-01", "12.5 m³", "Normal"].join("\t"),
        ["2025-05-08", "14.2 m³", "Normal"].join("\t"),
        ["2025-05-15", "11.8 m³", "Normal"].join("\t"),
        ["2025-05-22", "15.3 m³", "High"].join("\t"),
        ["Total", "54.0 m³", "Average"].join("\t"),
      );
    } else if (reportType === "Alerts") {
      content.push(
        ["2025-05-01", "5", "Critical"].join("\t"),
        ["2025-05-08", "9", "Critical"].join("\t"),
        ["2025-05-15", "5", "Warning"].join("\t"),
        ["Total", "19", "Summary"].join("\t"),
      );
    }

    return content.join("\n");
  };

  const chartData = getChartData(reportType);

  return (
    <div className="space-y-6 p-6 font-mono">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and analyze water system performance and user activity
        </p>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-2">
        {["Consumption", "Alerts", "Users", "Equipment"].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              reportType === type
                ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                : "border-[#1E1E1E] bg-[#111111] text-gray-400 hover:text-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-4 rounded-lg border border-[#1E1E1E] bg-[#111111] p-4">
        <div className="flex-1">
          <label className="block text-[10px] text-gray-500 uppercase tracking-widest">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="mt-1 w-full rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] px-3 py-2 text-sm text-white focus:border-[#FF6B00] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] text-gray-500 uppercase tracking-widest">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="mt-1 w-full rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] px-3 py-2 text-sm text-white focus:border-[#FF6B00] focus:outline-none"
          />
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3">
        <button
          onClick={downloadAsCSV}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-[#FF6B00] bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#e05f00] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export CSV
        </button>
        <button
          onClick={downloadAsExcel}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-[#1E1E1E] bg-[#111111] px-5 py-2 text-sm font-semibold text-gray-300 transition-all hover:bg-[#1a1a1a] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export Excel
        </button>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">
            {reportType} Trend
          </h2>
          <div className="h-80">
            {reportType === "Alerts" ? (
              <Bar data={chartData} options={chartOptions} />
            ) : reportType === "Users" || reportType === "Equipment" ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-3">
          {reportType === "Consumption" && (
            <>
              <div className="rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Avg Usage
                </p>
                <p className="mt-2 text-2xl font-bold text-white">13.5 m³</p>
              </div>
              <div className="rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Peak Week
                </p>
                <p className="mt-2 text-2xl font-bold text-[#FF6B00]">16.1 m³</p>
              </div>
              <div className="rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Total 7 Weeks
                </p>
                <p className="mt-2 text-2xl font-bold text-white">94.5 m³</p>
              </div>
            </>
          )}

          {reportType === "Alerts" && (
            <>
              <div className="rounded-lg border border-red-700/30 bg-red-950/20 p-4">
                <p className="text-[10px] text-red-400 uppercase tracking-widest">
                  Critical
                </p>
                <p className="mt-2 text-2xl font-bold text-red-300">19</p>
              </div>
              <div className="rounded-lg border border-amber-700/30 bg-amber-950/20 p-4">
                <p className="text-[10px] text-amber-400 uppercase tracking-widest">
                  Warnings
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-300">28</p>
              </div>
              <div className="rounded-lg border border-blue-700/30 bg-blue-950/20 p-4">
                <p className="text-[10px] text-blue-400 uppercase tracking-widest">
                  Info
                </p>
                <p className="mt-2 text-2xl font-bold text-blue-300">56</p>
              </div>
            </>
          )}

          {reportType === "Users" && (
            <>
              <div className="rounded-lg border border-emerald-700/30 bg-emerald-950/20 p-4">
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest">
                  Active
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">156</p>
              </div>
              <div className="rounded-lg border border-red-700/30 bg-red-950/20 p-4">
                <p className="text-[10px] text-red-400 uppercase tracking-widest">
                  Inactive
                </p>
                <p className="mt-2 text-2xl font-bold text-red-300">23</p>
              </div>
              <div className="rounded-lg border border-amber-700/30 bg-amber-950/20 p-4">
                <p className="text-[10px] text-amber-400 uppercase tracking-widest">
                  Pending
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-300">8</p>
              </div>
            </>
          )}

          {reportType === "Equipment" && (
            <>
              <div className="rounded-lg border border-emerald-700/30 bg-emerald-950/20 p-4">
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest">
                  Online
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">87</p>
              </div>
              <div className="rounded-lg border border-red-700/30 bg-red-950/20 p-4">
                <p className="text-[10px] text-red-400 uppercase tracking-widest">
                  Offline
                </p>
                <p className="mt-2 text-2xl font-bold text-red-300">12</p>
              </div>
              <div className="rounded-lg border border-amber-700/30 bg-amber-950/20 p-4">
                <p className="text-[10px] text-amber-400 uppercase tracking-widest">
                  Maintenance
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-300">5</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#111111]">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1E1E1E] bg-[#0D0D0D]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Value
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Status
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E1E]">
            {reportType === "Consumption" && (
              <>
                {[
                  { date: "2025-05-01", value: "12.5 m³", status: "Normal", location: "Gasabo" },
                  { date: "2025-05-08", value: "14.2 m³", status: "Normal", location: "Kicukiro" },
                  { date: "2025-05-15", value: "11.8 m³", status: "Normal", location: "Nyarugenge" },
                  { date: "2025-05-22", value: "15.3 m³", status: "High", location: "Gasabo" },
                  { date: "2025-05-29", value: "13.7 m³", status: "Normal", location: "Kicukiro" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0D0D0D]">
                    <td className="px-6 py-4 text-white">{row.date}</td>
                    <td className="px-6 py-4 text-white font-semibold">{row.value}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row.status === "Normal"
                            ? "bg-emerald-950/50 text-emerald-300"
                            : "bg-amber-950/50 text-amber-300"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{row.location}</td>
                  </tr>
                ))}
              </>
            )}

            {reportType === "Alerts" && (
              <>
                {[
                  { date: "2025-05-01", count: "5", severity: "Critical", location: "All Sources" },
                  { date: "2025-05-08", count: "9", severity: "Critical", location: "Gasabo" },
                  { date: "2025-05-15", count: "5", severity: "Warning", location: "Kicukiro" },
                  { date: "2025-05-22", count: "11", severity: "Critical", location: "All Sources" },
                  { date: "2025-05-29", count: "7", severity: "Warning", location: "Nyarugenge" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0D0D0D]">
                    <td className="px-6 py-4 text-white">{row.date}</td>
                    <td className="px-6 py-4 text-white font-semibold">{row.count}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row.severity === "Critical"
                            ? "bg-red-950/50 text-red-300"
                            : "bg-amber-950/50 text-amber-300"
                        }`}
                      >
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{row.location}</td>
                  </tr>
                ))}
              </>
            )}

            {reportType === "Users" && (
              <>
                {[
                  { date: "2025-05-01", count: "156", status: "Active", type: "Registered" },
                  { date: "2025-05-15", count: "160", status: "Active", type: "Registered" },
                  { date: "2025-05-29", count: "23", status: "Inactive", type: "Dormant" },
                  { date: "2025-05-30", count: "8", status: "Pending", type: "New" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0D0D0D]">
                    <td className="px-6 py-4 text-white">{row.date}</td>
                    <td className="px-6 py-4 text-white font-semibold">{row.count}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-950/50 text-emerald-300">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{row.type}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
