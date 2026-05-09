import { useEffect, useState } from "react";
import { Filter, Download, Loader2, FileX } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import {
  getConsumptionReport,
  getAlertsReport,
  getUsersReport,
  getEquipmentReport,
} from "../../services/reportService";
import html2pdf from "html2pdf.js";

const inputCls =
  "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls =
  "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";
const PROVINCES = ["", "Kigali", "Northern", "Southern", "Eastern", "Western"];
const REPORT_TYPES = ["Consumption", "Alerts", "Users", "Equipment"];

const COLUMNS = {
  Consumption: ["User", "Total M3 Used", "Last Reading"],
  "Consumption (Detailed)": ["Date", "User", "Source", "Flow In", "Flow Out", "M3 Delta"],
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
  const [detailed, setDetailed] = useState(false);

  const setF = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const buildParams = () => ({
    startDate: filters.start_date || undefined,
    endDate: filters.end_date || undefined,
    province: filters.province || undefined,
    district: filters.district || undefined,
    cell: filters.cell || undefined,
    ...(filters.report_type === "Consumption" && detailed ? { raw: 'true' } : {}),
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
    if (results.length === 0) {
      showToast("No data to export", "error");
      return;
    }
    setExportLoading(type);
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit" 
      }).replace(/\//g, "-");

      if (type === "pdf") {
        // Generate HTML for PDF
        const cols = COLUMNS[detailed && filters.report_type === "Consumption" ? "Consumption (Detailed)" : filters.report_type];
        const title = `${filters.report_type} Report`;
        const subtitle = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
        
        const tableRows = results
          .map(
            (row) => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                ${cols
                  .map(
                    (col) => `
                  <td style="
                    padding: 12px;
                    text-align: left;
                    font-size: 11px;
                    color: #1f2937;
                    border-right: 1px solid #f3f4f6;
                  ">
                    ${renderCellText(row, col)}
                  </td>
                `
                  )
                  .join("")}
              </tr>
            `
          )
          .join("");

        const summaryStats =
          filters.report_type === "Consumption"
            ? `
            <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #ff6b00; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #1f2937; font-size: 12px;">SUMMARY STATISTICS</p>
              <table style="width: 100%; font-size: 11px; color: #4b5563;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Total Records:</strong> ${results.length}</td>
                  <td style="padding: 5px 0; padding-left: 40px;"><strong>Total M3:</strong> ${results.reduce((sum, row) => sum + Number(row.total_m3 || row.m3_delta || 0), 0).toFixed(5)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Report Type:</strong> ${detailed ? "Detailed Readings" : "Aggregated"}</td>
                  <td style="padding: 5px 0; padding-left: 40px;"><strong>Time Period:</strong> ${filters.start_date ? filters.start_date : "All time"}</td>
                </tr>
              </table>
            </div>
          `
            : "";

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body {
                  font-family: 'Segoe UI', 'Arial', sans-serif;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
                .header {
                  background: linear-gradient(135deg, #ff6b00 0%, #e05f00 100%);
                  color: white;
                  padding: 40px;
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: bold;
                  letter-spacing: 0.5px;
                }
                .header p {
                  margin: 10px 0 0 0;
                  font-size: 12px;
                  opacity: 0.95;
                }
                .content {
                  padding: 40px;
                }
                .subtitle {
                  color: #666;
                  font-size: 12px;
                  margin-bottom: 30px;
                  border-bottom: 1px solid #e5e7eb;
                  padding-bottom: 15px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                thead tr {
                  background: #f3f4f6;
                  border-bottom: 2px solid #ff6b00;
                }
                thead th {
                  padding: 14px;
                  text-align: left;
                  font-weight: 600;
                  font-size: 11px;
                  color: #1f2937;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                tbody td {
                  padding: 12px;
                  font-size: 11px;
                  color: #4b5563;
                  border-right: 1px solid #f3f4f6;
                }
                .highlight {
                  color: #ff6b00;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  text-align: center;
                  font-size: 10px;
                  color: #999;
                }
                .page-break {
                  page-break-before: always;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${title}</h1>
                <p>Water Community Administration & Management System</p>
              </div>
              
              <div class="content">
                <div class="subtitle">${subtitle}</div>
                
                ${summaryStats}
                
                <table>
                  <thead>
                    <tr>
                      ${cols
                        .map(
                          (col) => `
                        <th>${col}</th>
                      `
                        )
                        .join("")}
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows}
                  </tbody>
                </table>
                
                <div class="footer">
                  <p>This is an automatically generated report. For inquiries, please contact the system administrator.</p>
                  <p style="margin-top: 10px;">© 2026 WCAM System. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        // Convert HTML to PDF
        const element = document.createElement("div");
        element.innerHTML = htmlContent;

        const options = {
          margin: 10,
          filename: `${filters.report_type.toLowerCase()}_report_${dateStr}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
        };

        html2pdf().set(options).from(element).save();
        showToast("PDF downloaded successfully", "success");
      } else if (type === "excel") {
        // Generate Excel CSV format
        const cols = COLUMNS[detailed && filters.report_type === "Consumption" ? "Consumption (Detailed)" : filters.report_type];
        const header = cols.map((col) => `"${col}"`).join(",");
        const rows = results
          .map((row) =>
            cols
              .map((col) => {
                const val = renderCellText(row, col);
                return `"${String(val).replace(/"/g, '""')}"`;
              })
              .join(",")
          )
          .join("\n");

        const csv = `${header}\n${rows}`;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filters.report_type.toLowerCase()}_report_${dateStr}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        showToast("Excel file downloaded successfully", "success");
      }
    } catch (err) {
      showToast(
        err.message || "Export failed",
        "error"
      );
    } finally {
      setExportLoading("");
    }
  };

  const renderCell = (row, col) => {
    const t = detailed && filters.report_type === "Consumption" ? "Consumption (Detailed)" : filters.report_type;
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
    if (t === "Consumption (Detailed)") {
      if (col === "Date") return row.recorded_at ? new Date(row.recorded_at).toLocaleDateString() : "—";
      if (col === "User") return row.full_name ?? "—";
      if (col === "Source") return row.source_name ?? "—";
      if (col === "Flow In") return (row.flow_in ?? "—");
      if (col === "Flow Out") return (row.flow_out ?? "—");
      if (col === "M3 Delta") return <span className="text-[#FF6B00] font-bold">{row.m3_delta ?? "—"}</span>;
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

  const renderCellText = (row, col) => {
    const t = detailed && filters.report_type === "Consumption" ? "Consumption (Detailed)" : filters.report_type;
    if (t === "Consumption") {
      if (col === "User") return row.full_name ?? "—";
      if (col === "Total M3 Used")
        return row.total_m3 ?? row.m3_delta ?? row.m3_consumed ?? "—";
      if (col === "Last Reading")
        return row.last_recorded_at
          ? new Date(row.last_recorded_at).toLocaleDateString()
          : "—";
    }
    if (t === "Consumption (Detailed)") {
      if (col === "Date") return row.recorded_at ? new Date(row.recorded_at).toLocaleDateString() : "—";
      if (col === "User") return row.full_name ?? "—";
      if (col === "Source") return row.source_name ?? "—";
      if (col === "Flow In") return row.flow_in ?? "—";
      if (col === "Flow Out") return row.flow_out ?? "—";
      if (col === "M3 Delta") return row.m3_delta ?? "—";
    }
    if (t === "Alerts") {
      if (col === "Date")
        return row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "—";
      if (col === "Subject") return row.subject ?? "—";
      if (col === "Severity") return row.severity ?? "—";
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

  const colKey = detailed && filters.report_type === "Consumption" ? "Consumption (Detailed)" : filters.report_type;
  const cols = COLUMNS[colKey];
  const isConsumption = filters.report_type === "Consumption" && !detailed;
  const consumptionTotal = isConsumption
    ? results.reduce((sum, row) => sum + Number(row.total_m3 || 0), 0)
    : 0;

  // Auto-fetch results on mount so page isn't empty for seeded data
  useEffect(() => {
    // only fetch if there are no filters set (to avoid overriding user's choices)
    if (!filters.start_date && !filters.end_date && !filters.province && !filters.district && !filters.cell) {
      handleApply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {filters.report_type === "Consumption" && (
            <div className="flex items-center gap-2 lg:col-start-3">
              <input
                type="checkbox"
                id="detailed-toggle"
                checked={detailed}
                onChange={(e) => setDetailed(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="detailed-toggle" className="text-xs text-gray-300 cursor-pointer">
                Detailed Readings
              </label>
            </div>
          )}
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
