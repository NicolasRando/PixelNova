import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-8xl font-bold text-indigo-500/20">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page introuvable</h1>
      <p className="text-gray-400 dark:text-gray-500 mt-2 max-w-md">
        La page que vous recherchez n&apos;existe pas ou a ete deplacee.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors"
      >
        Retour au Dashboard
      </Link>
    </div>
  );
}
