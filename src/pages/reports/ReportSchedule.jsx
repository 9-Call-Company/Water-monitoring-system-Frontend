import { useState } from "react";
import { Filter, Download, Loader2, FileX } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import {
  getConsumptionReport,
  getAlertsReport,
  getUsersReport,
  getEquipmentReport,
  exportReport,
} from "../../services/reportService";

const inputCls =
  "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls =
  "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";
const PROVINCES = ["", "Kigali", "Northern", "Southern", "Eastern", "Western"];
const REPORT_TYPES = ["Consumption", "Alerts", "Users", "Equipment"];

const COLUMNS = {
  Consumption: ["User", "Total M3 Used", "Last Reading"],
  Alerts: ["Date", "Subject", "Severity", "User", "Status"],
  Users: ["User ID", "Full Name", "Role", "Date Joined", "Province"],
  Equipment: ["Robine ID", "Owner", "Source", "Status", "Last Reading"],
};

const ReportSchedule = () => {
  const { showToast } = useToast();
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    report_type: "Consumption",
    province: "",
    district: "",
    cell: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState("");
  const [fetched, setFetched] = useState(false);

  const setF = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const buildParams = () => ({
    startDate: filters.start_date || undefined,
    endDate: filters.end_date || undefined,
    province: filters.province || undefined,
    district: filters.district || undefined,
    cell: filters.cell || undefined,
  });

  const handleApply = async () => {
    setLoading(true);
    setFetched(true);
    try {
      const params = buildParams();
      let res;
      if (filters.report_type === "Consumption")
        res = await getConsumptionReport(params);
      else if (filters.report_type === "Alerts")
        res = await getAlertsReport(params);
      else if (filters.report_type === "Users")
        res = await getUsersReport(params);
      else res = await getEquipmentReport(params);
      const data = res.data;
      setResults(
        Array.isArray(data)
          ? data
          : data.data || data.results || data.records || [],
      );
      if ((Array.isArray(data) ? data : []).length === 0)
        showToast("No records found for selected filters", "info");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to fetch report",
        "error",
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    setExportLoading(type);
    try {
      const params = buildParams();
      const res = await exportReport(
        type,
        filters.report_type.toLowerCase(),
        params,
      );
      const blob = new Blob([res.data], {
        type: type === "pdf" ? "application/pdf" : "application/vnd.ms-excel",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${filters.report_type.toLowerCase()}.${type === "pdf" ? "pdf" : "xlsx"}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Export started", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Export failed", "error");
    } finally {
      setExportLoading("");
    }
  };

  const renderCell = (row, col) => {
    const t = filters.report_type;
    if (t === "Consumption") {
      if (col === "User") return row.full_name ?? "—";
      if (col === "Total M3 Used")
        return (
          <span className="text-[#FF6B00] font-bold">
            {row.total_m3 ?? row.m3_delta ?? row.m3_consumed ?? "—"}
          </span>
        );
      if (col === "Last Reading")
        return row.last_recorded_at
          ? new Date(row.last_recorded_at).toLocaleDateString()
          : "—";
    }
    if (t === "Alerts") {
      if (col === "Date")
        return row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "—";
      if (col === "Subject") return row.subject ?? "—";
      if (col === "Severity")
        return (
          <span
            className={`px-1.5 py-0.5 rounded text-xs ${
              row.severity === "critical"
                ? "bg-red-900/40 text-red-400"
                : row.severity === "warning"
                  ? "bg-amber-900/40 text-amber-400"
                  : "bg-blue-900/40 text-blue-400"
            }`}
          >
            {row.severity}
          </span>
        );
      if (col === "User") return row.user?.full_name ?? "—";
      if (col === "Status") return row.status ?? "—";
    }
    if (t === "Users") {
      if (col === "User ID") return row.user_id ?? "—";
      if (col === "Full Name") return row.full_name ?? "—";
      if (col === "Role") return row.role ?? "—";
      if (col === "Date Joined")
        return row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "—";
      if (col === "Province") return row.province ?? "—";
    }
    if (t === "Equipment") {
      if (col === "Robine ID") return row.robine_id ?? "—";
      if (col === "Owner") return row.user?.full_name ?? "—";
      if (col === "Source") return row.source?.source_name ?? "—";
      if (col === "Status") return row.status ?? "—";
      if (col === "Last Reading")
        return row.assigned_at
          ? new Date(row.assigned_at).toLocaleDateString()
          : "—";
    }
    return "—";
  };

  const cols = COLUMNS[filters.report_type];
  const isConsumption = filters.report_type === "Consumption";
  const consumptionTotal = isConsumption
    ? results.reduce((sum, row) => sum + Number(row.total_m3 || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Reports</h1>
        <p className="text-xs text-gray-500 mt-1">
          Generate and export system reports
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className={labelCls}>Start Date</label>
            <input
              type="date"
              className={inputCls}
              value={filters.start_date}
              onChange={(e) => setF("start_date", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>End Date</label>
            <input
              type="date"
              className={inputCls}
              value={filters.end_date}
              onChange={(e) => setF("end_date", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Report Type</label>
            <select
              className={inputCls}
              value={filters.report_type}
              onChange={(e) => setF("report_type", e.target.value)}
            >
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Province</label>
            <select
              className={inputCls}
              value={filters.province}
              onChange={(e) => setF("province", e.target.value)}
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p || "All Provinces"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className={labelCls}>District</label>
            <input
              className={inputCls}
              value={filters.district}
              onChange={(e) => setF("district", e.target.value)}
              placeholder="Any district"
            />
          </div>
          <div>
            <label className={labelCls}>Cell</label>
            <input
              className={inputCls}
              value={filters.cell}
              onChange={(e) => setF("cell", e.target.value)}
              placeholder="Any cell"
            />
          </div>
          <div className="lg:col-start-4">
            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Filter className="w-4 h-4" />
              )}
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
          <h2 className="text-white text-sm font-semibold">
            {filters.report_type} Report
            {results.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 font-normal">
                ({results.length} records)
              </span>
            )}
          </h2>
          {results.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport("pdf")}
                disabled={!!exportLoading}
                className="flex items-center gap-1.5 border border-[#1E1E1E] text-gray-300 hover:text-white hover:border-gray-600 px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
              >
                {exportLoading === "pdf" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                PDF
              </button>
              <button
                onClick={() => handleExport("excel")}
                disabled={!!exportLoading}
                className="flex items-center gap-1.5 border border-[#1E1E1E] text-gray-300 hover:text-white hover:border-gray-600 px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
              >
                {exportLoading === "excel" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Excel
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
          </div>
        ) : !fetched ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <Filter className="w-8 h-8 mb-3" />
            <p className="text-sm font-mono">
              Apply filters to generate a report
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <FileX className="w-8 h-8 mb-3" />
            <p className="text-sm font-mono">
              No records found for the selected criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  {cols.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors"
                  >
                    {cols.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-3 text-gray-300 text-xs font-mono"
                      >
                        {renderCell(row, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {isConsumption && (
                <tfoot>
                  <tr className="border-t border-[#1E1E1E] bg-[#141414]">
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-white">
                      Grand Total
                    </td>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-[#FF6B00]">
                      {consumptionTotal.toFixed(5)}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                      m3
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSchedule;
