"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LatencyChart from "@/components/LatencyChart";
import { Service, Check, ChecksResponse } from "@/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [totalChecks, setTotalChecks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [serviceRes, checksRes] = await Promise.all([
        fetch(`/api/services/${id}`),
        fetch(`/api/services/${id}/checks?limit=50`),
      ]);

      if (!serviceRes.ok) {
        router.push("/services");
        return;
      }

      const serviceData: Service = await serviceRes.json();
      const checksData: ChecksResponse = await checksRes.json();

      setService(serviceData);
      setChecks(checksData.checks);
      setTotalChecks(checksData.total);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  async function handleManualCheck() {
    setChecking(true);
    try {
      await fetch(`/api/services/${id}/check`, { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error("Erreur check:", err);
    } finally {
      setChecking(false);
    }
  }

  const upChecks = checks.filter((c) => c.status === "up").length;
  const uptimePercent =
    checks.length > 0 ? ((upChecks / checks.length) * 100).toFixed(1) : "\u2014";
  const latencies = checks
    .filter((c) => c.latency != null)
    .map((c) => c.latency!);
  const avgLatency =
    latencies.length > 0
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : null;
  const minLatency = latencies.length > 0 ? Math.min(...latencies) : null;
  const maxLatency = latencies.length > 0 ? Math.max(...latencies) : null;

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-3" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!service) return null;

  const isUp = service.lastCheck?.status === "up";
  const hasCheck = service.lastCheck !== null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/services"
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            &larr; Retour aux services
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div
              className={`w-3 h-3 rounded-full ${
                !hasCheck
                  ? "bg-gray-400 dark:bg-gray-500"
                  : isUp
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                    : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
              }`}
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{service.name}</h1>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
          <p className="text-gray-400 dark:text-gray-500 mt-1">{service.url}</p>
        </div>

        <button
          onClick={handleManualCheck}
          disabled={checking}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {checking ? "Check en cours..." : "Check maintenant"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {uptimePercent}
            {uptimePercent !== "\u2014" && <span className="text-sm text-gray-400">%</span>}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Latence moy.</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {avgLatency !== null ? (
              <>{avgLatency}<span className="text-sm text-gray-400">ms</span></>
            ) : "\u2014"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Min / Max</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {minLatency !== null ? (
              <>
                {minLatency}<span className="text-sm text-gray-400">ms</span>
                <span className="text-sm text-gray-400 dark:text-gray-500"> / </span>
                {maxLatency}<span className="text-sm text-gray-400">ms</span>
              </>
            ) : "\u2014"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total checks</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalChecks}</p>
        </div>
      </div>

      {/* Graphique */}
      <div className="mt-8">
        <LatencyChart checks={checks} />
      </div>

      {/* Tableau historique */}
      <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Historique des checks ({totalChecks})
          </h3>
        </div>

        {checks.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            Aucun check enregistre
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-5 py-3 text-left text-gray-500 dark:text-gray-400 font-medium">Date</th>
                  <th className="px-5 py-3 text-left text-gray-500 dark:text-gray-400 font-medium">Statut</th>
                  <th className="px-5 py-3 text-left text-gray-500 dark:text-gray-400 font-medium">Code HTTP</th>
                  <th className="px-5 py-3 text-left text-gray-500 dark:text-gray-400 font-medium">Latence</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check) => (
                  <tr
                    key={check.id}
                    className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {formatDate(check.checkedAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                          check.status === "up"
                            ? "bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-400/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            check.status === "up" ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        {check.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                      {check.statusCode ?? "\u2014"}
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                      {check.latency != null ? `${check.latency}ms` : "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
