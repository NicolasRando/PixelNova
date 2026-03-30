"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Service } from "@/types";
import ServiceForm from "@/components/ServiceForm";
import DeleteModal from "@/components/DeleteModal";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  async function fetchServices() {
    try {
      const res = await fetch("/api/services");
      if (!res.ok) return;
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function handleSaved() {
    setEditingService(null);
    fetchServices();
  }

  async function handleDelete() {
    if (!deletingService) return;
    try {
      await fetch(`/api/services/${deletingService.id}`, { method: "DELETE" });
      setDeletingService(null);
      fetchServices();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Gerez vos services surveilles</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Formulaire */}
        <div className="lg:col-span-1">
          <ServiceForm
            editingService={editingService}
            onCancel={() => setEditingService(null)}
            onSaved={handleSaved}
          />
        </div>

        {/* Liste des services */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mes services ({services.length})
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 dark:text-gray-500">
                Aucun service pour le moment. Utilisez le formulaire pour en
                ajouter un.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => {
                const isUp = service.lastCheck?.status === "up";
                const hasCheck = service.lastCheck !== null;

                return (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                  >
                    <Link
                      href={`/services/${service.id}`}
                      className="flex items-center gap-4 min-w-0 flex-1"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          !hasCheck
                            ? "bg-gray-400 dark:bg-gray-500"
                            : isUp
                              ? "bg-emerald-400"
                              : "bg-red-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 truncate">
                          {service.url}
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <div className="hidden sm:flex flex-col items-end text-sm">
                        <span
                          className={
                            !hasCheck
                              ? "text-gray-400 dark:text-gray-500"
                              : isUp
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                          }
                        >
                          {!hasCheck ? "\u2014" : isUp ? "UP" : "DOWN"}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">
                          {hasCheck && service.lastCheck?.latency != null
                            ? `${service.lastCheck!.latency}ms`
                            : ""}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingService(service)}
                          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeletingService(service)}
                          className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de suppression */}
      {deletingService && (
        <DeleteModal
          serviceName={deletingService.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingService(null)}
        />
      )}
    </div>
  );
}
