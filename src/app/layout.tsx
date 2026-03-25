import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
