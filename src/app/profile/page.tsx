"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  if (session && !initialized) {
    setName(session.user.name || "");
    setInitialized(true);
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la mise a jour");
        setLoading(false);
        return;
      }

      await update({ name });
      setMessage("Profil mis a jour");
    } catch {
      setError("Erreur lors de la mise a jour");
    }

    setLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors du changement de mot de passe");
        setLoading(false);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setMessage("Mot de passe modifie");
    } catch {
      setError("Erreur lors du changement de mot de passe");
    }

    setLoading(false);
  }

  const isOAuthUser = !session.user.email?.includes("@") ? false : true;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mon profil
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gerez vos informations personnelles
        </p>
      </div>

      {message && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Info compte */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations du compte
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-lg">
              {session.user.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium">{session.user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</p>
            </div>
          </div>
          {session.user.image && (
            <p className="text-xs text-gray-400">
              Connecte via OAuth (Google ou GitHub)
            </p>
          )}
        </div>
      </div>

      {/* Modifier le nom */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Modifier le nom
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? "Mise a jour..." : "Enregistrer"}
          </button>
        </form>
      </div>

      {/* Changer le mot de passe (seulement pour les comptes credentials) */}
      {isOAuthUser && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Changer le mot de passe
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Minimum 6 caracteres"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "Mise a jour..." : "Changer le mot de passe"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
