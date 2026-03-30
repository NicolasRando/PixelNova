"use client";

import Link from "next/link";
import { Service } from "@/types";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return `il y a ${seconds}s`;
  if (minutes < 60) return `il y a ${minutes}min`;
  return `il y a ${hours}h`;
}

export default function StatusCard({ service }: { service: Service }) {
  const isUp = service.lastCheck?.status === "up";
  const hasCheck = service.lastCheck !== null;

  return (
    <Link
      href={`/services/${service.id}`}
      className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-900/80"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              !hasCheck
                ? "bg-gray-400 dark:bg-gray-500"
                : isUp
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
            }`}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            !hasCheck
              ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              : isUp
                ? "bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-400/10 text-red-600 dark:text-red-400"
          }`}
        >
          {!hasCheck ? "En attente" : isUp ? "UP" : "DOWN"}
        </span>
      </div>

      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 truncate">{service.url}</p>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          {hasCheck && service.lastCheck?.latency != null
            ? `${service.lastCheck!.latency}ms`
            : "\u2014"}
        </span>
        <span className="text-gray-400 dark:text-gray-500">
          {hasCheck
            ? timeAgo(service.lastCheck!.checkedAt)
            : "Aucun check"}
        </span>
      </div>
    </Link>
  );
}
