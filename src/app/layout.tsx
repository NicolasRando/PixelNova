import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import MonitorWorker from "@/components/MonitorWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelNova - Network Monitor",
  description: "Dashboard de monitoring reseau en temps reel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Navbar />
        <MonitorWorker />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
