"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function MonitorWorker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    async function runMonitor() {
      try {
        await fetch("/api/monitor", { method: "POST" });
      } catch {
        // Silently fail
      }
    }

    runMonitor();
    const interval = setInterval(runMonitor, 60000);
    return () => clearInterval(interval);
  }, [session]);

  return null;
}
