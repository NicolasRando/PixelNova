"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusCard from "@/components/StatusCard";
import { Service } from "@/types";

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchServices() {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Erreur lors du chargement des services:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 15000);
    return () => clearInterval(interval);
  }, []);

  const upCount = services.filter((s) => s.lastCheck?.status === "up").length;
  const downCount = services.filter((s) => s.lastCheck?.status === "down").length;
  const total = services.length;

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">Chargement...</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-900 border border-gray-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">📡</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-300">
            Aucun service surveille
          </h2>
          <p className="text-gray-500 mt-2 max-w-md">
            Ajoutez votre premier service pour commencer a surveiller sa
            disponibilite et ses performances.
          </p>
          <Link
            href="/services"
            className="mt-6 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors"
          >
            Ajouter un service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Vue d&apos;ensemble de vos services
          </p>
        </div>
        <Link
          href="/services"
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Gerer les services
        </Link>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-3xl font-bold text-white mt-1">{total}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-emerald-400">En ligne</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{upCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-red-400">Hors ligne</p>
          <p className="text-3xl font-bold text-red-400 mt-1">{downCount}</p>
        </div>
      </div>

      {/* Grille de services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {services.map((service) => (
          <StatusCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
