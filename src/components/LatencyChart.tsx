"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Check } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function LatencyChart({ checks }: { checks: Check[] }) {
  // Inverser pour avoir l'ordre chronologique (plus ancien → plus récent)
  const sorted = [...checks].reverse();

  const labels = sorted.map((c) => {
    const date = new Date(c.checkedAt);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Latence (ms)",
        data: sorted.map((c) => c.latency ?? 0),
        borderColor: "#818cf8",
        backgroundColor: "rgba(129, 140, 248, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: sorted.map((c) =>
          c.status === "up" ? "#34d399" : "#f87171"
        ),
        pointBorderColor: "transparent",
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#6b7280", maxTicksLimit: 10 },
        grid: { color: "rgba(55, 65, 81, 0.3)" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6b7280",
          callback: (value: number | string) => `${value}ms`,
        },
        grid: { color: "rgba(55, 65, 81, 0.3)" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => {
            const check = sorted[ctx.dataIndex];
            return `${ctx.parsed.y}ms — ${check.status.toUpperCase()}`;
          },
        },
      },
    },
  } as const;

  if (checks.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-500">Aucune donnee de latence disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-400 mb-4">
        Latence sur les derniers checks
      </h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
