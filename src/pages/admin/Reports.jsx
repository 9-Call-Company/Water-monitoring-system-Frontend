import { useEffect, useRef, useState } from "react";
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
import html2pdf from "html2pdf.js";
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
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { showToast } = useToast();

  // Sample data functions
  const getConsumptionData = () => ({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
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
  });

  const getAlertsData = () => ({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
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
  });

  const getUsersData = () => ({
    labels: ["Active", "Inactive", "Pending"],
    datasets: [
      {
        label: "User Count",
        data: [156, 23, 8],
        backgroundColor: ["#FF6B00", "#ef4444", "#f59e0b"],
        borderColor: "#1e1e1e",
        borderWidth: 2,
      },
    ],
  });

  const getEquipmentData = () => ({
    labels: ["Online", "Offline", "Maintenance"],
    datasets: [
      {
        label: "Equipment Status",
        data: [87, 12, 5],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
        borderColor: "#1e1e1e",
        borderWidth: 2,
      },
    ],
  });

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

  const getSummaryStats = () => {
    const stats = {
      Consumption: [
        { label: "Average Usage", value: "13.5 m³" },
        { label: "Peak Week", value: "16.1 m³" },
        { label: "Total (7 weeks)", value: "94.5 m³" },
      ],
      Alerts: [
        { label: "Critical Alerts", value: "19" },
        { label: "Warnings", value: "28" },
        { label: "Info Messages", value: "56" },
      ],
      Users: [
        { label: "Active Users", value: "156" },
        { label: "Inactive Users", value: "23" },
        { label: "Pending Approvals", value: "8" },
      ],
      Equipment: [
        { label: "Online Equipment", value: "87" },
        { label: "Offline Equipment", value: "12" },
        { label: "Under Maintenance", value: "5" },
      ],
    };
    return stats[reportType] || stats.Consumption;
  };

  const getTableData = () => {
    const data = {
      Consumption: [
        { date: "2025-05-01", value: "12.5 m³", status: "Normal", location: "Gasabo" },
        { date: "2025-05-08", value: "14.2 m³", status: "Normal", location: "Kicukiro" },
        { date: "2025-05-15", value: "11.8 m³", status: "Normal", location: "Nyarugenge" },
        { date: "2025-05-22", value: "15.3 m³", status: "High", location: "Gasabo" },
        { date: "2025-05-29", value: "13.7 m³", status: "Normal", location: "Kicukiro" },
      ],
      Alerts: [
        { date: "2025-05-01", value: "5", status: "Critical", location: "All Sources" },
        { date: "2025-05-08", value: "9", status: "Critical", location: "Gasabo" },
        { date: "2025-05-15", value: "5", status: "Warning", location: "Kicukiro" },
        { date: "2025-05-22", value: "11", status: "Critical", location: "All Sources" },
        { date: "2025-05-29", value: "7", status: "Warning", location: "Nyarugenge" },
      ],
      Users: [
        { date: "2025-05-01", value: "156", status: "Active", location: "All" },
        { date: "2025-05-15", value: "160", status: "Active", location: "All" },
        { date: "2025-05-29", value: "23", status: "Inactive", location: "All" },
        { date: "2025-05-30", value: "8", status: "Pending", location: "All" },
      ],
      Equipment: [
        { date: "2025-05-01", value: "87", status: "Online", location: "All" },
        { date: "2025-05-15", value: "90", status: "Online", location: "All" },
        { date: "2025-05-22", value: "12", status: "Offline", location: "All" },
      ],
    };
    return data[reportType] || data.Consumption;
  };

  const downloadAsPDF = async () => {
    setLoading(true);
    try {
      const element = document.getElementById("pdf-report-content");
      if (!element) {
        showToast("Generating PDF...", "info");
        // Create PDF content programmatically
        const stats = getSummaryStats();
        const tableData = getTableData();

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 40px; background: white; color: #000;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #FF6B00; padding-bottom: 20px;">
              <h1 style="color: #FF6B00; font-size: 32px; margin: 0; font-weight: bold;">${reportType} Report</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 13px;">Generated: ${new Date().toLocaleDateString()}</p>
            </div>

            <div style="margin-bottom: 40px;">
              <h2 style="color: #FF6B00; font-size: 18px; border-bottom: 2px solid #FF6B00; padding-bottom: 10px; margin: 0 0 20px 0;">Summary Statistics</h2>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                ${stats.map(stat => `
                  <div style="padding: 15px; background: #f9f9f9; border-left: 4px solid #FF6B00; border-radius: 5px;">
                    <p style="font-size: 12px; color: #666; text-transform: uppercase; margin: 0; font-weight: bold;">${stat.label}</p>
                    <p style="font-size: 28px; font-weight: bold; color: #FF6B00; margin: 10px 0 0 0;">${stat.value}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-bottom: 30px;">
              <h2 style="color: #FF6B00; font-size: 18px; border-bottom: 2px solid #FF6B00; padding-bottom: 10px; margin: 0 0 20px 0;">Report Data</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="background: #FF6B00; color: white;">
                    <th style="padding: 12px; text-align: left; font-weight: bold; border: 1px solid #FF6B00;">Date</th>
                    <th style="padding: 12px; text-align: left; font-weight: bold; border: 1px solid #FF6B00;">Value</th>
                    <th style="padding: 12px; text-align: left; font-weight: bold; border: 1px solid #FF6B00;">Status</th>
                    <th style="padding: 12px; text-align: left; font-weight: bold; border: 1px solid #FF6B00;">Location</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableData.map((row, idx) => `
                    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f5f5f5'}; border-bottom: 1px solid #ddd;">
                      <td style="padding: 10px; border: 1px solid #ddd;">${row.date}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${row.value}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${row.status}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${row.location}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #FF6B00; text-align: center; color: #999; font-size: 11px;">
              <p style="margin: 0;">Water Monitoring System | Professional Report</p>
              <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} • All rights reserved</p>
            </div>
          </div>
        `;

        const opt = {
          margin: 10,
          filename: `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
        };

        html2pdf().set(opt).from(htmlContent).outputPdf().then(() => {
          showToast(`${reportType} report downloaded as PDF`, "success");
          setLoading(false);
        }).catch((error) => {
          console.error("PDF error:", error);
          showToast("Error generating PDF", "error");
          setLoading(false);
        });
        return;
      }

      // Fallback if element exists
      const opt = {
        margin: 10,
        filename: `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      html2pdf().set(opt).from(element).save();
      showToast(`${reportType} report downloaded as PDF`, "success");
      setLoading(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      showToast("Failed to generate PDF", "error");
      setLoading(false);
    }
  };

  const downloadAsCSV = () => {
    setLoading(true);
    try {
      const headers = ["Date", "Value", "Status", "Location"];
      const tableData = getTableData();
      const csvContent = [
        headers.join(","),
        ...tableData.map((row) => [row.date, row.value, row.status, row.location].join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.csv`;
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
      const headers = ["Date", "Value", "Status", "Location"];
      const tableData = getTableData();
      const excelContent = [
        headers.join("\t"),
        ...tableData.map((row) => [row.date, row.value, row.status, row.location].join("\t")),
      ].join("\n");

      const blob = new Blob([excelContent], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.xlsx`;
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

  const tableData = getTableData();
  const chartData = getChartData(reportType);
  const summaryStats = getSummaryStats();

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
          onClick={downloadAsPDF}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-[#FF6B00] bg-[#FF6B00] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#e05f00] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export PDF
        </button>
        <button
          onClick={downloadAsCSV}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-[#1E1E1E] bg-[#111111] px-5 py-2 text-sm font-semibold text-gray-300 transition-all hover:bg-[#1a1a1a] disabled:opacity-50"
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
          <h2 className="mb-4 text-sm font-semibold text-white">{reportType} Trend</h2>
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
          {summaryStats.map((stat, idx) => (
            <div key={idx} className="rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#FF6B00]">{stat.value}</p>
            </div>
          ))}
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
            {tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#0D0D0D]">
                <td className="px-6 py-4 text-white">{row.date}</td>
                <td className="px-6 py-4 text-white font-semibold">{row.value}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      row.status === "Normal" || row.status === "Active" || row.status === "Online"
                        ? "bg-emerald-950/50 text-emerald-300"
                        : row.status === "High" || row.status === "Critical" || row.status === "Offline"
                        ? "bg-red-950/50 text-red-300"
                        : "bg-amber-950/50 text-amber-300"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{row.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden PDF Content for export */}
      <div id="pdf-report-content" className="hidden"></div>
    </div>
  );
}
