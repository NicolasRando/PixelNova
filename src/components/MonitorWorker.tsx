"use client";

import { useEffect } from "react";

export default function MonitorWorker() {
  useEffect(() => {
    async function runMonitor() {
      try {
        await fetch("/api/monitor", { method: "POST" });
      } catch {
        // Silently fail — will retry next cycle
      }
    }

    // Premier check immediat
    runMonitor();

    // Puis toutes les 30 secondes
    const interval = setInterval(runMonitor, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
