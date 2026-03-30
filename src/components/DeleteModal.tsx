"use client";

import { useState } from "react";

interface DeleteModalProps {
  serviceName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteModal({
  serviceName,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Supprimer &quot;{serviceName}&quot; ?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Cette action supprimera le service et tout son historique de checks.
          Cette action est irreversible.
        </p>
        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
