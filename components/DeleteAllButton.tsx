'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteAllButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setResult(null);

    try {
      const res = await fetch('/api/delete-all', { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setResult({ type: 'success', message: data.message });
        setShowConfirm(false);
        // Refresh the page data after a short delay so the user sees the success message
        setTimeout(() => router.refresh(), 1200);
      } else {
        setResult({ type: 'error', message: data.error || 'Something went wrong' });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="relative mt-12 mb-8">
      {/* Danger zone card */}
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h3>
        </div>

        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Delete all transactions
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Permanently remove all orders, order items, and merch pack records from the database. This action cannot be undone.
            </p>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => { setShowConfirm(true); setResult(null); }}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-sm
                         hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400
                           hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm
                           transition-colors disabled:opacity-70 shadow-sm cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, delete everything
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Result toast */}
        {result && (
          <div
            className={`mx-6 mb-5 px-4 py-3 rounded-lg text-sm font-medium ${
              result.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900/50'
                : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50'
            }`}
          >
            {result.message}
          </div>
        )}
      </div>
    </section>
  );
}
