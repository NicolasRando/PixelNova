"use client";

import Link from "next/link";
import { Service } from "@/types";

export default function AlertBanner({ services }: { services: Service[] }) {
  const downServices = services.filter(
    (s) => s.lastCheck?.status === "down"
  );

  if (downServices.length === 0) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        <h3 className="text-sm font-semibold text-red-400">
          {downServices.length} service{downServices.length > 1 ? "s" : ""} hors
          ligne
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {downServices.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm text-red-300 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {service.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
