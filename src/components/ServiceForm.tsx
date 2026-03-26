"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types";

interface ServiceFormProps {
  editingService: Service | null;
  onCancel: () => void;
  onSaved: () => void;
}

const INTERVALS = [
  { value: 1, label: "Toutes les 1 min" },
  { value: 5, label: "Toutes les 5 min" },
  { value: 15, label: "Toutes les 15 min" },
  { value: 30, label: "Toutes les 30 min" },
];

export default function ServiceForm({
  editingService,
  onCancel,
  onSaved,
}: ServiceFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(5);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = editingService !== null;

  useEffect(() => {
    if (editingService) {
      setName(editingService.name);
      setUrl(editingService.url);
      setInterval(editingService.interval);
    } else {
      setName("");
      setUrl("");
      setInterval(5);
    }
    setError("");
  }, [editingService]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Le nom est obligatoire");
      return;
    }
    if (name.length > 50) {
      setError("Le nom ne doit pas depasser 50 caracteres");
      return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("L'URL doit commencer par http:// ou https://");
      return;
    }

    setSubmitting(true);

    try {
      const endpoint = isEditing
        ? `/api/services/${editingService.id}`
        : "/api/services";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), url: url.trim(), interval }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue");
        return;
      }

      setName("");
      setUrl("");
      setInterval(5);
      onSaved();
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6"
    >
      <h2 className="text-lg font-semibold mb-4">
        {isEditing ? `Modifier "${editingService.name}"` : "Ajouter un service"}
      </h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
            Nom du service
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Google"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-400 mb-1">
            URL a surveiller
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://google.com"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="interval" className="block text-sm font-medium text-gray-400 mb-1">
            Intervalle de verification
          </label>
          <select
            id="interval"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            {INTERVALS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {submitting
            ? "Chargement..."
            : isEditing
              ? "Sauvegarder"
              : "Ajouter le service"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
