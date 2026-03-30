"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Service } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [downCount, setDownCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!session) return;

    async function fetchStatus() {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) return;
        const data: Service[] = await res.json();
        setDownCount(data.filter((s) => s.lastCheck?.status === "down").length);
      } catch {
        // Silently fail
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/services", label: "Services" },
  ];

  const linkClass = (active: boolean) =>
    `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={34} />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Pixel<span className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">Nova</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {session ? (
              <>
                {links.map((link) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link key={link.href} href={link.href} className={linkClass(isActive)}>
                      {link.label}
                      {link.href === "/" && downCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[11px] font-bold text-white flex items-center justify-center animate-pulse">
                          {downCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <ThemeToggle />
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="ml-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link
                  href="/login"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Connexion
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger + theme */}
          <div className="sm:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              {downCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {downCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 border-t border-gray-200 dark:border-gray-800 mt-2 pt-3 space-y-1">
            {session ? (
              <>
                {links.map((link) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link key={link.href} href={link.href} className={mobileLinkClass(isActive)}>
                      {link.label}
                      {link.href === "/" && downCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-[11px] font-bold text-white">
                          {downCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2">
                  <span className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{session.user.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Deconnexion
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Connexion
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
