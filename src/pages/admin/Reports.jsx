import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import ActionBtn from "../../components/shared/ActionBtn";
import StatCard from "../../components/shared/StatCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const chartData = {
  labels: ["1", "2", "3", "4", "5", "6", "7"],
  datasets: [
    {
      label: "Report",
      data: [8, 12, 10, 14, 13, 18, 17],
      borderColor: "#FF6B00",
      backgroundColor: "rgba(255,107,0,0.2)",
      tension: 0.4,
      pointBackgroundColor: "#FF6B00",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: "#1f1f1f" }, ticks: { color: "#a3a3a3" } },
    y: { grid: { color: "#1f1f1f" }, ticks: { color: "#a3a3a3" } },
  },
};

export default function Reports() {
  const [type, setType] = useState("Consumption");

  const rows = [
    { a: "Apr 10", b: "Kigali Central", c: "R-1001", d: "12.8" },
    { a: "Apr 11", b: "Huye Valley", c: "R-1002", d: "8.2" },
    { a: "Apr 12", b: "Gasabo Hill", c: "R-1003", d: "14.1" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        {["Consumption", "Alerts", "Users", "Equipment"].map((option) => (
          <button
            key={option}
            onClick={() => setType(option)}
            className={`rounded-full border px-3 py-2 text-xs ${type === option ? "border-wcam-orange text-wcam-orange" : "border-wcam-border bg-wcam-card text-zinc-400"}`}
          >
            {option}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <ActionBtn label="Export PDF" />
          <button className="rounded-lg bg-wcam-orange px-4 py-2 text-sm font-medium text-black">
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <Line data={chartData} options={chartOptions} />
        </section>
        <div className="space-y-4">
          <StatCard label="Min" value="8.2" />
          <StatCard label="Max" value="18.0" />
          <StatCard label="Average" value="12.4" />
          <StatCard label="Total" value="94.1" accent />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3">A</th>
              <th className="px-4 py-3">B</th>
              <th className="px-4 py-3">C</th>
              <th className="px-4 py-3">D</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-t border-wcam-border hover:bg-[#151515]"
              >
                <td className="px-4 py-3 text-zinc-300">{row.a}</td>
                <td className="px-4 py-3 text-zinc-300">{row.b}</td>
                <td className="px-4 py-3 text-zinc-300">{row.c}</td>
                <td className="px-4 py-3 text-wcam-orange">{row.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
